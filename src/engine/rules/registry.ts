/**
 * Rule registry — the plug-in mechanism for swapping rule sets.
 *
 * The public engine starts with example rules registered. External rule
 * packages (such as @copper-owl/rules) call registerRuleSet() at module
 * load time to override the examples with curated content.
 *
 * Pattern is identical to how VS Code, OBS, and many other "engine + plugin"
 * systems separate platform from content.
 */

import type { PlayerArchetype } from '@/types/domain';
import type { RuleFn, RuleSet } from './types';

const registry = new Map<PlayerArchetype, RuleFn>();

/** Register a complete or partial rule set. Later registrations override earlier ones. */
export function registerRuleSet(rules: RuleSet): void {
  for (const [archetype, fn] of Object.entries(rules)) {
    if (fn) registry.set(archetype as PlayerArchetype, fn);
  }
}

/** Look up the rule for a given archetype. Returns undefined if nothing registered. */
export function getRule(archetype: PlayerArchetype): RuleFn | undefined {
  return registry.get(archetype);
}

/** Clear all registered rules. Used in tests; not for production. */
export function _clearRegistry(): void {
  registry.clear();
}
