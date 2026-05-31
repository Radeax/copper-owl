import { VisuallyHidden } from '@/components/primitives/VisuallyHidden';
import styles from './OrientationSkeleton.module.css';

/**
 * Loading placeholder for /orientation. The route keeps its real BrandHeader;
 * this fills the space below it.
 *
 * Orientation is a large, state-dependent page (o1–o5), so the skeleton
 * mirrors only the stable above-the-fold structure — the hero and one section
 * (header + a primary card + two alternative rows). Reproducing the full path
 * strip and every section would be busy and often wouldn't match the resolved
 * state, which defeats the purpose of preparing the eye.
 *
 * role="status" + a VisuallyHidden announcement carries the loading state to
 * assistive tech; the visual boxes are aria-hidden.
 */
export function OrientationSkeleton() {
  return (
    <div role="status" className={styles.root}>
      <VisuallyHidden>Reading account state…</VisuallyHidden>

      <div className={styles.hero} aria-hidden="true">
        <div className={`${styles.bar} ${styles.heroEyebrow}`} />
        <div className={`${styles.bar} ${styles.heroTitle}`} />
        <div className={`${styles.bar} ${styles.heroSub}`} />
        <div className={`${styles.bar} ${styles.heroSubShort}`} />
      </div>

      <section className={styles.section} aria-hidden="true">
        <div className={styles.sectionHeader}>
          <div className={`${styles.bar} ${styles.sectionLabel}`} />
          <div className={`${styles.bar} ${styles.sectionSub}`} />
        </div>

        <div className={styles.primary} data-testid="orientation-skeleton-card">
          <div className={`${styles.bar} ${styles.primaryIllustration}`} />
          <div className={styles.primaryBody}>
            <div className={`${styles.bar} ${styles.cardTitle}`} />
            <div className={`${styles.bar} ${styles.line}`} />
            <div className={`${styles.bar} ${styles.lineShort}`} />
          </div>
        </div>

        <div className={styles.alts}>
          {[0, 1].map((i) => (
            <div key={i} className={styles.alt} data-testid="orientation-skeleton-card">
              <div className={`${styles.bar} ${styles.altImage}`} />
              <div className={styles.altContent}>
                <div className={`${styles.bar} ${styles.altTitle}`} />
                <div className={`${styles.bar} ${styles.line}`} />
                <div className={`${styles.bar} ${styles.lineShort}`} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
