import type { ReactNode } from 'react';
import styles from './VisuallyHidden.module.css';

interface VisuallyHiddenProps {
  children: ReactNode;
}

/**
 * Renders content that is invisible on screen but available to assistive
 * technology. Used to carry a loading announcement inside a role="status"
 * region while the visual placeholders stay aria-hidden — the screen reader
 * hears the announcement, not a pile of empty boxes.
 *
 * The clip-rect pattern (not display:none / visibility:hidden) is deliberate:
 * those would also hide the text from screen readers. This keeps it in the
 * accessibility tree while removing it from the visual flow.
 */
export function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return <span className={styles.visuallyHidden}>{children}</span>;
}
