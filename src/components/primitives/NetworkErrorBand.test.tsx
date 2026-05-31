import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { NetworkErrorBand } from './NetworkErrorBand';

describe('NetworkErrorBand', () => {
  afterEach(() => {
    cleanup();
  });

  it('surfaces the network-failure copy as a status band', () => {
    render(<NetworkErrorBand onRetry={vi.fn()} />);

    expect(screen.getByRole('status')).toHaveTextContent(
      'The GW2 API didn’t return account data. The connection or the service may be down.'
    );
  });

  it('renders a manual Retry action — no auto-countdown, unlike the 429 band', () => {
    render(<NetworkErrorBand onRetry={vi.fn()} />);

    // A clickable button, not the passive "Retrying in Ns" countdown text.
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('calls onRetry when the Retry button is clicked', () => {
    const onRetry = vi.fn();
    render(<NetworkErrorBand onRetry={onRetry} />);

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('forwards className to the band root for placement composition', () => {
    render(<NetworkErrorBand onRetry={vi.fn()} className="placement" />);

    expect(screen.getByRole('status')).toHaveClass('placement');
  });
});
