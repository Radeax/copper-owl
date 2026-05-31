import { useEffect, useRef, useState } from 'react';
import { StatusBand } from './StatusBand';
import { formatCountdown } from '@/utils/useReset';
import styles from './RateLimitBand.module.css';

interface RateLimitBandProps {
  /**
   * Seconds to count down before retrying, seeded from the 429 response's
   * Retry-After header (GW2ApiError.retryAfterSeconds). The /home caller
   * supplies a default when the header was absent.
   */
  retryAfterSeconds: number;
  /** Called once when the countdown reaches zero — re-runs the throttled query. */
  onRetry: () => void;
}

/**
 * The 429 rate-limit surface on /home — the second StatusBand consumer after
 * the scope warning. A transient throttle, not a failure, so intent="info".
 *
 * Owns a self-stopping one-second countdown; when it lands on zero it calls
 * onRetry once. The copy promises a retry, so the band must trigger one —
 * TanStack Query does not auto-retry 4xx, including 429.
 *
 * Restarting on a *repeat* throttle is the caller's job: /home keys this band
 * on the query's errorUpdatedAt, so each fresh 429 remounts it with a clean
 * countdown. That keeps the component a pure "count down once, then fire".
 */
export function RateLimitBand({ retryAfterSeconds, onRetry }: RateLimitBandProps) {
  const [remaining, setRemaining] = useState(retryAfterSeconds);
  const intervalRef = useRef<number | undefined>(undefined);

  // One interval for the band's life — a single setInterval ticks reliably,
  // where a per-tick rescheduled timeout would not. Math.max keeps it from
  // running past zero; the zero-effect below stops it.
  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setRemaining((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(intervalRef.current);
  }, []);

  // Land on zero once: stop the interval and fire the retry the copy promises.
  // remaining holds at zero and onRetry is stable (React Compiler), so this
  // does not re-run until a fresh 429 remounts the band.
  useEffect(() => {
    if (remaining === 0) {
      window.clearInterval(intervalRef.current);
      onRetry();
    }
  }, [remaining, onRetry]);

  return (
    <StatusBand
      intent="info"
      action={
        <span className={styles.countdown}>
          {remaining > 0 ? `Retrying in ${formatCountdown(remaining)}` : 'Retrying…'}
        </span>
      }
    >
      Rate limit hit. The API is pacing requests.
    </StatusBand>
  );
}
