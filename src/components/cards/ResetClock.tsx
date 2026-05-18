import { useReset, formatCountdown } from '@/utils/useReset';
import styles from './ResetClock.module.css';

export function ResetClock() {
  const reset = useReset();

  const dailyLabel = reset.resetImminent
    ? 'Daily reset · soon'
    : reset.postResetWindow
      ? 'Daily reset · just refreshed'
      : 'Next daily reset';

  const state = reset.resetImminent
    ? styles.imminent
    : reset.postResetWindow
      ? styles.fresh
      : styles.normal;

  return (
    <div className={`${styles.clock} ${state}`}>
      <div className={styles.row}>
        <span className={styles.label}>{dailyLabel}</span>
        <span className={styles.value}>
          {formatCountdown(reset.secondsToDailyReset)}
        </span>
      </div>
      <div className={styles.row}>
        <span className={styles.labelMuted}>Weekly reset</span>
        <span className={styles.valueMuted}>
          {formatCountdown(reset.secondsToWeeklyReset)}
        </span>
      </div>
    </div>
  );
}
