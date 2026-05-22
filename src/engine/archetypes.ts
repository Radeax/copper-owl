/**
 * Player archetype classifier.
 *
 * Inspects AccountState and decides which of the five archetypes the player
 * falls into. The archetype determines which surface they land on:
 *   - f2p_explorer       → orientation (F2P-specific path)
 *   - fresh_80           → orientation (full)
 *   - returning          → returning surface
 *   - engaged_casual     → engaged-home (suggested actions, no specific goal)
 *   - engaged_committed  → engaged-home (with goal pursuit)
 *
 * Pure function — no I/O, no side effects, fully testable.
 */

import type { AccountState, PlayerArchetype } from '@/types/domain';

const RETURNING_DAYS_THRESHOLD = 60; // 2 months
const ENGAGED_DAYS_THRESHOLD = 14; // played within last 2 weeks

export function classifyArchetype(account: AccountState | null): PlayerArchetype {
  if (!account) return 'unclassified';

  const { expansions, characters, daysSinceLastLogin, pursuingGoal } = account;
  const hasAnyExpansion = Object.values(expansions).some(Boolean);
  const hasMaxLevelCharacter = characters.some((c) => c.level >= 80);

  // F2P: no expansions owned
  if (!hasAnyExpansion) {
    return 'f2p_explorer';
  }

  // Returning: hasn't logged in recently
  if (daysSinceLastLogin !== null && daysSinceLastLogin >= RETURNING_DAYS_THRESHOLD) {
    return 'returning';
  }

  // Fresh 80: has max level char, owns expansions, but hasn't played enough
  // to count as engaged (this is the "I just hit 80, what now?" state)
  if (
    hasMaxLevelCharacter &&
    (daysSinceLastLogin === null || daysSinceLastLogin > ENGAGED_DAYS_THRESHOLD)
  ) {
    return 'fresh_80';
  }

  // Engaged: plays recently. The committed/casual split uses the explicit
  // pursuingGoal flag (set today only via anonymous-mode self-classification;
  // a future heuristic over wallet/character progress can fill it for API mode).
  if (pursuingGoal === true) {
    return 'engaged_committed';
  }
  return 'engaged_casual';
}
