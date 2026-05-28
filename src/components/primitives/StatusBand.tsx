import type { ReactNode } from 'react';
import styles from './StatusBand.module.css';

interface StatusBandProps {
  children: ReactNode;
  /**
   * Optional eyebrow label rendered above the body text in uppercase. Mirrors
   * the recommendation-card eyebrow pattern so status surfaces read as peers
   * to cards. Format follows "TOPIC · SUBCATEGORY" (e.g. "API KEY · PERMISSIONS").
   * Omit when the band's body text alone is enough context (e.g. auth error,
   * loading state).
   */
  label?: string;
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
 * states. Optional eyebrow label + body text + optional action node.
 *
 * Non-blocking by default: callers render it alongside the main content rather
 * than replacing the page with it. The auth-error path replaces because that
 * state has nothing else meaningful to show.
 */
export function StatusBand({ children, label, action, intent = 'info' }: StatusBandProps) {
  return (
    <div className={`${styles.band} ${styles[intent]}`} role="status">
      {label && <p className={styles.label}>{label}</p>}
      <p className={styles.text}>{children}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
