/**
 * Public rule API.
 *
 * Defines the shape every rule module must satisfy. Lives in the public
 * repo so external rule packages (including the private @copper-owl/rules
 * package) can import the types and register against them.
 *
 * This file intentionally contains NO actual recommendation content —
 * only the interface contract.
 */

import type {
  AccountState,
  PlayerArchetype,
  Recommendation,
  ResetState,
} from '@/types/domain';

/**
 * A rule function takes account + reset state and returns the
 * recommendations to surface for one archetype.
 *
 * Pure function — no I/O, no side effects, no React.
 */
export type RuleFn = (
  account: AccountState | null,
  reset: ResetState
) => Recommendation[];

/**
 * A complete rule set covers every archetype. External rule packages
 * implement this and call registerRuleSet() to plug in.
 */
export type RuleSet = Partial<Record<PlayerArchetype, RuleFn>>;
