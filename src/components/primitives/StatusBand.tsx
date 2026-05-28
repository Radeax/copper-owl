import type { ReactNode } from 'react';
import styles from './StatusBand.module.css';

interface StatusBandProps {
  children: ReactNode;
  action?: ReactNode;
  /**
   * Visual intent. Drives accent color only; structure is identical.
   * - 'info' (default) — quiet observation. Scope warning, rate-limit
   *   countdown, anything the user can keep working through without
   *   any action.
   * - 'error' — recoverable failure needing attention. Auth error,
   *   network failure. Not a catastrophic alarm state — the project
   *   palette deliberately avoids red. If a true alarm intent is ever
   *   needed (server down, account banned), add a third value rather
   *   than escalating the 'error' treatment.
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
