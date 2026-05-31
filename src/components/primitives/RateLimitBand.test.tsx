import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, render, screen, cleanup } from '@testing-library/react';
import { RateLimitBand } from './RateLimitBand';

const flush = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

describe('RateLimitBand', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('renders the seeded countdown and ticks down each second', () => {
    render(<RateLimitBand retryAfterSeconds={3} onRetry={vi.fn()} />);

    expect(screen.getByText('Retrying in 3s')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Retrying in 2s')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Retrying in 1s')).toBeInTheDocument();
  });

  it('calls onRetry exactly once when the countdown reaches zero', () => {
    const onRetry = vi.fn();
    render(<RateLimitBand retryAfterSeconds={2} onRetry={onRetry} />);

    expect(onRetry).not.toHaveBeenCalled();

    // Tick past zero; the band must trigger the retry the copy promises.
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('Retrying…')).toBeInTheDocument();
    expect(onRetry).toHaveBeenCalledTimes(1);

    // Extra ticks at zero must not fire a second retry.
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('fires onRetry only once even when the parent passes a new callback after zero', () => {
    const first = vi.fn();
    const { rerender } = render(<RateLimitBand retryAfterSeconds={1} onRetry={first} />);

    flush(1000);
    expect(first).toHaveBeenCalledTimes(1);

    // A re-render with a fresh callback while remaining is already zero must
    // not fire a second retry — the guard is intrinsic, not caller-dependent.
    const second = vi.fn();
    rerender(<RateLimitBand retryAfterSeconds={1} onRetry={second} />);
    flush(1000);
    expect(second).not.toHaveBeenCalled();
    expect(first).toHaveBeenCalledTimes(1);
  });

  it('surfaces as an info status band, not an alarm', () => {
    render(<RateLimitBand retryAfterSeconds={5} onRetry={vi.fn()} />);

    const band = screen.getByRole('status');
    expect(band).toHaveTextContent('Rate limit hit. The API is pacing requests.');
  });
});
