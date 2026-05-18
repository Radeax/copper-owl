import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RateLimitQueue } from './queue';

describe('RateLimitQueue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('allows the full 300 burst immediately', async () => {
    const q = new RateLimitQueue();
    const promises = Array.from({ length: 300 }, () => q.acquire());
    await vi.runAllTimersAsync();
    await Promise.all(promises);
    expect(q.availableTokens).toBeLessThanOrEqual(0);
  });

  it('queues additional requests beyond burst', async () => {
    const q = new RateLimitQueue();
    // Acquire all 300 burst tokens
    await Promise.all(Array.from({ length: 300 }, () => q.acquire()));

    // The 301st should pend until refill
    let resolved = false;
    const next = q.acquire().then(() => {
      resolved = true;
    });

    // Without time passing, still pending
    await Promise.resolve();
    expect(resolved).toBe(false);

    // Advance 250ms → 1.25 tokens regenerated → should now resolve
    await vi.advanceTimersByTimeAsync(250);
    await next;
    expect(resolved).toBe(true);
  });

  it('drain() rejects all pending acquires', async () => {
    const q = new RateLimitQueue();
    // Drain the burst budget
    await Promise.all(Array.from({ length: 300 }, () => q.acquire()));
    // Queue one more
    const pending = q.acquire();
    q.drain('test reason');
    await expect(pending).rejects.toThrow('test reason');
  });
});
