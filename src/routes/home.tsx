import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { recommend } from '@/engine/recommend';
import { useReset } from '@/utils/useReset';
import { RecommendationCard } from '@/components/cards/RecommendationCard';
import { ResetClock } from '@/components/cards/ResetClock';
import { StatusBand } from '@/components/primitives/StatusBand';
import { RateLimitBand } from '@/components/primitives/RateLimitBand';
import { NetworkErrorBand } from '@/components/primitives/NetworkErrorBand';
import { HomeSkeleton } from '@/components/skeletons/HomeSkeleton';
import { useAuthStore, buildSyntheticAccountState } from '@/state/auth';
import { useGW2Account, useGW2Characters, useGW2TokenInfo } from '@/api/gw2';
import { GW2ApiError } from '@/api/client';
import { missingScopes, scopeWarningCopy } from '@/api/scopes';
import { transformGW2Account } from '@/api/transform';
import styles from './home.module.css';

export const Route = createFileRoute('/home')({
  component: HomePage,
});

function isAuthError(err: unknown): boolean {
  return (
    err instanceof GW2ApiError &&
    (err.code === 'unauthorized' || err.code === 'forbidden')
  );
}

function isRateLimited(err: unknown): err is GW2ApiError {
  return err instanceof GW2ApiError && err.code === 'rate_limited';
}

/**
 * A failure where the data the page needs didn't arrive but retrying might fix
 * it: a rejected fetch (offline, DNS, timeout → code 'network'), a GW2 5xx
 * (code 'server'), or an unexpected non-auth, non-429 status (code 'unknown' —
 * e.g. a stray 4xx these endpoints don't normally return). Distinct from 429
 * (transient, self-resolving — RateLimitBand) and auth (401/403 — a bad key,
 * retrying won't help).
 *
 * 'unknown' is folded in so it surfaces a recoverable band with a Retry rather
 * than falling through to a blank page (#29). TanStack Query retries network/5xx
 * up to twice before this fires; a 4xx 'unknown' isn't retried, so it fires at
 * once.
 */
function isRecoverableLoadError(err: unknown): err is GW2ApiError {
  return (
    err instanceof GW2ApiError &&
    (err.code === 'network' || err.code === 'server' || err.code === 'unknown')
  );
}

/**
 * Fallback countdown when a 429 arrives without a Retry-After header — GW2's
 * rate-limit window is roughly per-minute, so 60s is a safe automatic retry
 * delay. The gw2Queue already paces requests, so an over-long wait here only
 * delays the refetch; it never causes a second throttle.
 */
const DEFAULT_RETRY_AFTER_SECONDS = 60;

function HomePage() {
  const navigate = useNavigate();
  const session = useAuthStore((s) => s.session);
  const anonymousProfile = useAuthStore((s) => s.anonymousProfile);
  const signOut = useAuthStore((s) => s.signOut);
  const reset = useReset();

  const isAnonymous = session?.mode === 'anonymous';
  const apiKey = session?.apiKey;

  useEffect(() => {
    if (!session) {
      void navigate({ to: '/welcome' });
    } else if (isAnonymous && !anonymousProfile) {
      void navigate({ to: '/start' });
    }
  }, [session, isAnonymous, anonymousProfile, navigate]);

  // API queries are disabled when apiKey is undefined (anonymous mode).
  const accountQuery = useGW2Account(isAnonymous ? undefined : apiKey);
  const charsQuery = useGW2Characters(isAnonymous ? undefined : apiKey);
  const tokenQuery = useGW2TokenInfo(isAnonymous ? undefined : apiKey);

  const missing = useMemo(
    () => (tokenQuery.data ? missingScopes(tokenQuery.data.permissions) : []),
    [tokenQuery.data]
  );

  // Every mounted query currently holding a 429. They share one rate-limit
  // bucket (the gw2Queue), so a throttle usually hits all three at once.
  const throttledQueries = isAnonymous
    ? []
    : [accountQuery, charsQuery, tokenQuery].filter((q) => isRateLimited(q.error));
  // Both the throttle band and the network band re-run all three queries: they
  // share the gw2Queue bucket, so whatever throttled or downed one downed them
  // all, and a single retry recovers the page as a unit.
  const refetchAll = () => {
    void accountQuery.refetch();
    void charsQuery.refetch();
    void tokenQuery.refetch();
  };

  // Seed from the *longest* active Retry-After: retryThrottled refetches all of
  // them, so counting down to the shortest would jump a longer query's window
  // before it elapsed. Re-key on the latest error so a fresh 429 restarts the
  // countdown rather than leaving it stuck at zero.
  const isThrottled = throttledQueries.length > 0;
  const throttleKey = isThrottled
    ? Math.max(...throttledQueries.map((q) => q.errorUpdatedAt))
    : undefined;
  const throttleSeconds = isThrottled
    ? Math.max(
        ...throttledQueries.map(
          (q) => (q.error as GW2ApiError).retryAfterSeconds ?? DEFAULT_RETRY_AFTER_SECONDS
        )
      )
    : 0;
  // className carries the placement margin so the band composes without a
  // wrapper div (per docs/pr-review.md §7). The two surfaces differ only in
  // that margin: a top offset when it replaces the page, bottom space when it
  // sits above content.
  const renderThrottleBand = (className: string | undefined) =>
    isThrottled ? (
      <RateLimitBand
        key={throttleKey}
        className={className}
        retryAfterSeconds={throttleSeconds}
        onRetry={refetchAll}
      />
    ) : null;

  // A recoverable load failure on the page-gating queries only (account +
  // characters): an unreachable/down API (network/5xx) or an unexpected status
  // (unknown). A tokeninfo-only failure shouldn't band the page — the scope
  // warning is non-blocking by design (piece #3), so it just doesn't render.
  // Suppressed while throttled so a rare mixed 429+failure state shows one band,
  // not two stacked; the throttle band takes precedence and auto-recovers.
  const loadErrored =
    !isAnonymous &&
    !isThrottled &&
    (isRecoverableLoadError(accountQuery.error) || isRecoverableLoadError(charsQuery.error));
  const renderNetworkBand = (className: string | undefined) =>
    loadErrored ? <NetworkErrorBand className={className} onRetry={refetchAll} /> : null;

  const account = useMemo(() => {
    if (isAnonymous && anonymousProfile) {
      return buildSyntheticAccountState(anonymousProfile);
    }
    if (accountQuery.data && charsQuery.data) {
      return transformGW2Account(accountQuery.data, charsQuery.data);
    }
    return null;
  }, [isAnonymous, anonymousProfile, accountQuery.data, charsQuery.data]);

  const { archetype, recommendations } = useMemo(
    () => recommend({ account, reset }),
    [account, reset]
  );

  if (!session) return null;
  if (isAnonymous && !anonymousProfile) return null;

  // API-only loading + auth-error states.
  if (!isAnonymous) {
    if (accountQuery.isLoading || charsQuery.isLoading) {
      return (
        <div className={styles.page}>
          <HomeSkeleton />
        </div>
      );
    }

    if (isAuthError(accountQuery.error) || isAuthError(charsQuery.error)) {
      return (
        <div className={styles.page}>
          <div className={styles.authErrorWrap}>
            <StatusBand
              intent="error"
              action={
                <button
                  className={styles.linkAction}
                  onClick={() => {
                    signOut();
                    void navigate({ to: '/welcome' });
                  }}
                >
                  Try a different key
                </button>
              }
            >
              The API key did not authenticate. A different key may resolve this.
            </StatusBand>
          </div>
        </div>
      );
    }

    // No cached account to fall back on — the throttle band stands in for the
    // page until the retry lands, structurally parallel to the loading state.
    if (isThrottled && !account) {
      return (
        <div className={styles.page}>{renderThrottleBand(styles.authErrorWrap)}</div>
      );
    }

    // First load failed with no cached account — the recoverable band replaces
    // the page with a manual Retry, parallel to the throttle and loading states.
    if (loadErrored && !account) {
      return (
        <div className={styles.page}>{renderNetworkBand(styles.authErrorWrap)}</div>
      );
    }
  }

  if (!account) return null;

  const accountLabel = isAnonymous ? 'Anonymous profile' : (account.name ?? 'Account');

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>🦉</span>
          <span className={styles.brandName}>COPPER OWL</span>
        </div>
        <h1 className={styles.welcome}>What this session is for</h1>
        <p className={styles.account}>
          {accountLabel} ·{' '}
          <span className={styles.archetype}>{archetype.replace(/_/g, ' ')}</span>
        </p>
      </header>

      {renderThrottleBand(styles.scopeWarnWrap)}

      {/* A refresh failed while stale account data is still on screen — surface
          the recoverable band above the content rather than replacing it. */}
      {renderNetworkBand(styles.scopeWarnWrap)}

      {!isAnonymous && missing.length > 0 && (
        <div className={styles.scopeWarnWrap}>
          <StatusBand
            label="API KEY · PERMISSIONS"
            action={
              <>
                <a
                  className={styles.linkAction}
                  href="https://account.arena.net/applications"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Manage API keys
                </a>
                <button
                  className={styles.linkAction}
                  onClick={() => {
                    signOut();
                    void navigate({ to: '/welcome' });
                  }}
                >
                  Use a different key
                </button>
              </>
            }
          >
            {scopeWarningCopy(missing)}
          </StatusBand>
        </div>
      )}

      <section className={styles.clockBand}>
        <ResetClock />
      </section>

      <section className={styles.recs}>
        {recommendations.map((rec) => (
          <RecommendationCard key={rec.id} recommendation={rec} />
        ))}
      </section>

      {isAnonymous && (
        <button
          type="button"
          className={styles.switchLink}
          onClick={() => navigate({ to: '/start' })}
        >
          Switch starting point
        </button>
      )}
    </div>
  );
}
