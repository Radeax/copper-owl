import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  afterEach(() => {
    cleanup();
  });

  it('keeps its content in the accessibility tree (queryable as text)', () => {
    render(<VisuallyHidden>Reading account state…</VisuallyHidden>);
    // Present in the DOM / a11y tree — the whole point is SR availability.
    expect(screen.getByText('Reading account state…')).toBeInTheDocument();
  });

  it('does not use display:none / visibility:hidden, which would hide it from SR', () => {
    render(<VisuallyHidden>Reading account state…</VisuallyHidden>);
    const el = screen.getByText('Reading account state…');
    const style = getComputedStyle(el);
    // The clip-rect pattern keeps the element rendered (just clipped) so it
    // stays announceable — display:none / visibility:hidden would not.
    expect(style.display).not.toBe('none');
    expect(style.visibility).not.toBe('hidden');
  });
});
