/**
 * Reset clock — computes seconds-until-reset for daily and weekly GW2 resets.
 *
 * GW2 reset times (canonical):
 *   - Daily reset: 16:00 UTC every day (8am PT / 11am ET / 5pm CET / midnight JST)
 *   - Weekly reset: Monday 16:00 UTC
 *
 * Reset-awareness is a first-class concept: recommendations should know how
 * close to reset we are. Voice principle: never use "tonight" — use "this
 * session" plus reset context ("Reset in 25 min — knock out today's dailies").
 */

import type { ResetState } from '@/types/domain';

const DAILY_RESET_HOUR_UTC = 16;
const WEEKLY_RESET_DOW = 1; // Monday (0 = Sunday in JS Date)

/**
 * Returns the next daily reset as a Date in UTC.
 * If current UTC time is before 16:00 today, that's the next reset.
 * Otherwise it's 16:00 UTC tomorrow.
 */
export function nextDailyReset(now: Date = new Date()): Date {
  const next = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      DAILY_RESET_HOUR_UTC,
      0,
      0,
      0
    )
  );
  if (next.getTime() <= now.getTime()) {
    next.setUTCDate(next.getUTCDate() + 1);
  }
  return next;
}

/**
 * Returns the next weekly reset (Monday 16:00 UTC) as a Date in UTC.
 */
export function nextWeeklyReset(now: Date = new Date()): Date {
  const next = nextDailyReset(now);
  // Roll forward day-by-day until we land on Monday
  while (next.getUTCDay() !== WEEKLY_RESET_DOW) {
    next.setUTCDate(next.getUTCDate() + 1);
  }
  return next;
}

const THIRTY_MINUTES_SEC = 30 * 60;

/**
 * Compute current ResetState. Pure function — testable, deterministic.
 *
 * "Imminent" means within 30 min of next daily reset (a window where
 * recommendations should prioritize "finish dailies before reset").
 *
 * "Post-reset window" means within 30 min after most recent daily reset
 * (a window where "fresh dailies are available" is the natural framing).
 */
export function computeResetState(now: Date = new Date()): ResetState {
  const dailyReset = nextDailyReset(now);
  const weeklyReset = nextWeeklyReset(now);
  const secondsToDailyReset = Math.floor((dailyReset.getTime() - now.getTime()) / 1000);
  const secondsToWeeklyReset = Math.floor((weeklyReset.getTime() - now.getTime()) / 1000);

  const secondsSinceLastDailyReset = 24 * 60 * 60 - secondsToDailyReset;

  return {
    secondsToDailyReset,
    secondsToWeeklyReset,
    resetImminent: secondsToDailyReset > 0 && secondsToDailyReset <= THIRTY_MINUTES_SEC,
    postResetWindow: secondsSinceLastDailyReset >= 0 && secondsSinceLastDailyReset <= THIRTY_MINUTES_SEC,
  };
}
