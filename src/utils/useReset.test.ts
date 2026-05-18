import { describe, it, expect } from 'vitest';
import { formatCountdown } from './useReset';

describe('formatCountdown', () => {
  it('returns "0m" for negative input', () => {
    expect(formatCountdown(-1)).toBe('0m');
  });

  it('formats sub-minute durations as seconds', () => {
    expect(formatCountdown(45)).toBe('45s');
    expect(formatCountdown(0)).toBe('0s');
  });

  it('formats sub-hour durations as minutes and zero-padded seconds', () => {
    expect(formatCountdown(60)).toBe('1m 00s');
    expect(formatCountdown(125)).toBe('2m 05s');
    expect(formatCountdown(3599)).toBe('59m 59s');
  });

  it('formats hour-plus durations as hours and zero-padded minutes', () => {
    expect(formatCountdown(3600)).toBe('1h 00m');
    expect(formatCountdown(7200 + 5 * 60)).toBe('2h 05m');
    expect(formatCountdown(24 * 3600)).toBe('24h 00m');
  });
});
