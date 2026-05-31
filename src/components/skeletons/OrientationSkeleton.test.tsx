import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { OrientationSkeleton } from './OrientationSkeleton';

describe('OrientationSkeleton', () => {
  afterEach(() => {
    cleanup();
  });

  it('exposes a status live region for assistive tech', () => {
    render(<OrientationSkeleton />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('carries the loading state as a screen-reader announcement', () => {
    render(<OrientationSkeleton />);
    expect(screen.getByText('Reading account state…')).toBeInTheDocument();
  });

  it('renders the above-the-fold card placeholders (one primary + two alts)', () => {
    render(<OrientationSkeleton />);
    expect(screen.getAllByTestId('orientation-skeleton-card')).toHaveLength(3);
  });
});
