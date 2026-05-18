/**
 * useReset — React binding for the pure reset clock engine.
 *
 * Returns a live ResetState that updates every second. Components reading
 * this hook re-render on each tick, but the work is minimal (one Date
 * subtraction). The React Compiler handles memoization automatically.
 */

import { useEffect, useState } from 'react';
import { computeResetState } from '@/engine/reset';
import type { ResetState } from '@/types/domain';

export function useReset(): ResetState {
  const [state, setState] = useState<ResetState>(() => computeResetState());

  useEffect(() => {
    const tick = () => setState(computeResetState());
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return state;
}

/**
 * Format a seconds duration as "Hh MMm" or "MMm SSs" depending on scale.
 * Used by the countdown widget; exported separately for testability.
 */
export function formatCountdown(seconds: number): string {
  if (seconds < 0) return '0m';
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m.toString().padStart(2, '0')}m`;
}
