/**
 * Reset clock — computes seconds-until-reset for daily and weekly GW2 resets.
 *
 * GW2 reset times (canonical, per https://wiki.guildwars2.com/wiki/Server_reset):
 *   - Daily reset: 00:00 UTC every day
 *   - Weekly reset: Monday 07:30 UTC
 *
 * The weekly reset is a different time-of-day than the daily reset (07:30 vs
 * 00:00), so it's computed independently rather than rolled off the daily.
 *
 * Reset-awareness is a first-class concept: recommendations should know how
 * close to reset we are. Voice principle: never use "tonight" — use "this
 * session" plus reset context ("Reset in 25 min — knock out today's dailies").
 */

import type { ResetState } from '@/types/domain';

const DAILY_RESET_HOUR_UTC = 0;
const WEEKLY_RESET_DOW = 1; // Monday (0 = Sunday in JS Date)
const WEEKLY_RESET_HOUR_UTC = 7;
const WEEKLY_RESET_MINUTE_UTC = 30;

/**
 * Returns the next daily reset (00:00 UTC) as a Date in UTC. Always the next
 * UTC midnight: if today's 00:00 has already passed (it almost always has),
 * that's tomorrow's.
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
 * Returns the next weekly reset (Monday 07:30 UTC) as a Date in UTC. Computed
 * from its own time-of-day, not nextDailyReset, since the two differ.
 */
export function nextWeeklyReset(now: Date = new Date()): Date {
  const next = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      WEEKLY_RESET_HOUR_UTC,
      WEEKLY_RESET_MINUTE_UTC,
      0,
      0
    )
  );
  // Advance day-by-day until we land on a Monday strictly in the future. The
  // setUTCDate steps preserve the 07:30 time-of-day.
  while (next.getUTCDay() !== WEEKLY_RESET_DOW || next.getTime() <= now.getTime()) {
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
