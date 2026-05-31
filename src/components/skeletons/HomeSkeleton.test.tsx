import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { HomeSkeleton } from './HomeSkeleton';

describe('HomeSkeleton', () => {
  afterEach(() => {
    cleanup();
  });

  it('exposes a status live region for assistive tech', () => {
    render(<HomeSkeleton />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('carries the loading state as a screen-reader announcement', () => {
    render(<HomeSkeleton />);
    // The text is visually hidden but present in the accessibility tree.
    expect(screen.getByText('Reading account state…')).toBeInTheDocument();
  });

  it('renders two recommendation-card placeholders matching the content shape', () => {
    render(<HomeSkeleton />);
    expect(screen.getAllByTestId('home-skeleton-card')).toHaveLength(2);
  });
});
