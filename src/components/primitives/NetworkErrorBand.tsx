import type { CSSProperties } from 'react';
import { StatusBand } from './StatusBand';
import styles from './NetworkErrorBand.module.css';

interface NetworkErrorBandProps {
  /** Re-runs the failed account fetch. Wired to the queries' refetch() on /home. */
  onRetry: () => void;
  /** Forwarded to the underlying StatusBand root — e.g. placement margins. */
  className?: string;
  /** Forwarded to the underlying StatusBand root. */
  style?: CSSProperties;
}

/**
 * The recoverable load-failure surface on /home — the third StatusBand consumer
 * after the scope warning and the 429 countdown. Covers a rejected fetch
 * (network), a GW2 5xx (server), and an unexpected non-auth status (unknown,
 * e.g. a stray 4xx) — see isRecoverableLoadError in home.tsx. The copy speaks to
 * the common network/5xx case; the unknown path is rare enough on these
 * endpoints to reuse it rather than split the component.
 *
 * intent="error": unlike the 429 (a transient throttle that self-resolves on a
 * timer), an unreachable API or a 5xx is a genuine failure the user must act on
 * — there's no promised recovery time, so the action is a manual Retry, not an
 * auto-countdown. Deliberately the opposite of RateLimitBand: a down or failing
 * server shouldn't be hammered on a timer; the human decides when to retry.
 *
 * Stateless — the contrast with RateLimitBand's self-stopping countdown. Just
 * StatusBand + a Retry button that calls onRetry.
 */
export function NetworkErrorBand({ onRetry, className, style }: NetworkErrorBandProps) {
  return (
    <StatusBand
      intent="error"
      className={className}
      style={style}
      action={
        <button type="button" className={styles.retry} onClick={onRetry}>
          Try again
        </button>
      }
    >
      The GW2 API didn&rsquo;t return account data. The connection or the service may be down.
    </StatusBand>
  );
}
