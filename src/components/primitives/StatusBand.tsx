import type { ReactNode } from 'react';
import styles from './StatusBand.module.css';

interface StatusBandProps {
  children: ReactNode;
  action?: ReactNode;
  /**
   * Visual intent. Drives accent color only; structure is identical.
   * - 'info' (default) — neutral observation (scope warning, rate-limit countdown)
   * - 'error' — recoverable failure (auth error, network failure)
   */
  intent?: 'info' | 'error';
}

/**
 * Status surface that sits above the main content on /home (and similar routes).
 * Used by Phase 2's scope warning, 429 countdown, network-failure, and auth-error
 * states. One message line plus an optional action node (button, link, countdown).
 *
 * Non-blocking by default: callers render it alongside the main content rather
 * than replacing the page with it. The auth-error path replaces because that
 * state has nothing else meaningful to show.
 */
export function StatusBand({ children, action, intent = 'info' }: StatusBandProps) {
  return (
    <div className={`${styles.band} ${styles[intent]}`} role="status">
      <p className={styles.text}>{children}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
