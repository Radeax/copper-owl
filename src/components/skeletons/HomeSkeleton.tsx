import { VisuallyHidden } from '@/components/primitives/VisuallyHidden';
import styles from './HomeSkeleton.module.css';

/**
 * Loading placeholder for /home. Mirrors the real content shape top-to-bottom
 * — brand row, welcome title + account line, the reset-clock band, then two
 * recommendation cards — so the eye is prepared for what's arriving rather than
 * watching a generic blob. The brand mark is rendered for real (no data needed)
 * to keep it stable across the load.
 *
 * role="status" + a VisuallyHidden announcement carries the loading state to
 * assistive tech; every visual box is aria-hidden so a screen reader hears the
 * announcement, not the empty placeholders.
 */
export function HomeSkeleton() {
  return (
    <div role="status" className={styles.root}>
      <VisuallyHidden>Reading account state…</VisuallyHidden>

      <header className={styles.head} aria-hidden="true">
        <div className={styles.brand}>
          <span className={styles.brandMark}>🦉</span>
          <span className={styles.brandName}>COPPER OWL</span>
        </div>
        <div className={`${styles.bar} ${styles.titleBar}`} />
        <div className={`${styles.bar} ${styles.accountBar}`} />
      </header>

      <div className={styles.clock} aria-hidden="true">
        <div className={styles.clockRow}>
          <div className={`${styles.bar} ${styles.clockLabel}`} />
          <div className={`${styles.bar} ${styles.clockValue}`} />
        </div>
        <div className={styles.clockRow}>
          <div className={`${styles.bar} ${styles.clockLabelSm}`} />
          <div className={`${styles.bar} ${styles.clockValueSm}`} />
        </div>
      </div>

      <div className={styles.recs} aria-hidden="true">
        {[0, 1].map((i) => (
          <div key={i} className={styles.card} data-testid="home-skeleton-card">
            <div className={`${styles.bar} ${styles.eyebrow}`} />
            <div className={`${styles.bar} ${styles.cardTitle}`} />
            <div className={`${styles.bar} ${styles.line}`} />
            <div className={`${styles.bar} ${styles.lineShort}`} />
            <div className={styles.tags}>
              <div className={`${styles.bar} ${styles.tag}`} />
              <div className={`${styles.bar} ${styles.tag}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
