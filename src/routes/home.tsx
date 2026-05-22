import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { recommend } from '@/engine/recommend';
import { useReset } from '@/utils/useReset';
import { RecommendationCard } from '@/components/cards/RecommendationCard';
import { ResetClock } from '@/components/cards/ResetClock';
import { useAuthStore, buildSyntheticAccountState } from '@/state/auth';
import { useGW2Account, useGW2Characters } from '@/api/gw2';
import { GW2ApiError } from '@/api/client';
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
          <div className={styles.statusBand}>
            <p className={styles.statusText}>Connecting to the GW2 API…</p>
          </div>
        </div>
      );
    }

    if (isAuthError(accountQuery.error) || isAuthError(charsQuery.error)) {
      return (
        <div className={styles.page}>
          <div className={styles.statusBand}>
            <p className={styles.statusText}>
              The API key did not authenticate. A different key may resolve this.
            </p>
            <button
              className={styles.retryLink}
              onClick={() => {
                signOut();
                void navigate({ to: '/welcome' });
              }}
            >
              Try a different key
            </button>
          </div>
        </div>
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
