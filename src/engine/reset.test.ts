import { describe, it, expect } from 'vitest';
import { nextDailyReset, nextWeeklyReset, computeResetState } from './reset';

describe('reset clock', () => {
  describe('nextDailyReset', () => {
    it('rolls to the next UTC midnight from any time during the day', () => {
      // 2026-05-18 17:00 UTC → next reset is 2026-05-19 00:00 UTC
      const now = new Date('2026-05-18T17:00:00.000Z');
      const next = nextDailyReset(now);
      expect(next.toISOString()).toBe('2026-05-19T00:00:00.000Z');
    });

    it('rolls forward in the early morning before the day is old', () => {
      // 2026-05-18 02:00 UTC → today's 00:00 has passed, so 2026-05-19 00:00
      const now = new Date('2026-05-18T02:00:00.000Z');
      const next = nextDailyReset(now);
      expect(next.toISOString()).toBe('2026-05-19T00:00:00.000Z');
    });

    it('handles exactly 00:00 UTC as having just passed', () => {
      const now = new Date('2026-05-18T00:00:00.000Z');
      const next = nextDailyReset(now);
      // <= comparison rolls forward, so we should land on the next day
      expect(next.toISOString()).toBe('2026-05-19T00:00:00.000Z');
    });
  });

  describe('nextWeeklyReset', () => {
    it('finds today Monday 07:30 UTC when the day is Monday before 07:30', () => {
      // 2026-05-18 is a Monday. At 06:00 UTC, next weekly reset is today 07:30.
      const monday = new Date('2026-05-18T06:00:00.000Z');
      const next = nextWeeklyReset(monday);
      expect(next.getUTCDay()).toBe(1); // Monday
      expect(next.toISOString()).toBe('2026-05-18T07:30:00.000Z');
    });

    it('rolls to next Monday when current time is after Monday 07:30', () => {
      // 2026-05-18 (Mon) 10:00 → next Monday is 2026-05-25 07:30
      const now = new Date('2026-05-18T10:00:00.000Z');
      const next = nextWeeklyReset(now);
      expect(next.toISOString()).toBe('2026-05-25T07:30:00.000Z');
    });

    it('rolls forward from mid-week to next Monday 07:30 UTC', () => {
      // 2026-05-20 (Wed) → next Monday is 2026-05-25
      const wed = new Date('2026-05-20T10:00:00.000Z');
      const next = nextWeeklyReset(wed);
      expect(next.getUTCDay()).toBe(1);
      expect(next.toISOString()).toBe('2026-05-25T07:30:00.000Z');
    });
  });

  describe('computeResetState', () => {
    it('flags reset as imminent when within 30 minutes', () => {
      // 23:45 UTC → 15 min until 00:00 reset
      const now = new Date('2026-05-18T23:45:00.000Z');
      const state = computeResetState(now);
      expect(state.resetImminent).toBe(true);
      expect(state.postResetWindow).toBe(false);
      expect(state.secondsToDailyReset).toBe(15 * 60);
    });

    it('flags post-reset window for first 30 minutes after reset', () => {
      // 00:10 UTC → 10 min after reset
      const now = new Date('2026-05-18T00:10:00.000Z');
      const state = computeResetState(now);
      expect(state.postResetWindow).toBe(true);
      expect(state.resetImminent).toBe(false);
    });

    it('reports neither imminent nor post-reset during normal hours', () => {
      // 10:00 UTC — 14 hours from next 00:00 reset
      const now = new Date('2026-05-18T10:00:00.000Z');
      const state = computeResetState(now);
      expect(state.resetImminent).toBe(false);
      expect(state.postResetWindow).toBe(false);
      expect(state.secondsToDailyReset).toBe(14 * 60 * 60);
    });
  });
});
