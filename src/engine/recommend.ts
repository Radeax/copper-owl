/**
 * Recommendation engine — the heart of Copper Owl.
 *
 * Given an account state and the current reset clock, produces a primary
 * recommendation plus alternatives. Pure function — fully testable, no I/O.
 *
 * Architecture:
 *   classifyArchetype(account)         → PlayerArchetype
 *   getRule(archetype)(account, reset) → Recommendation[]
 *
 * The rule registry is a plug-in mechanism (src/engine/rules/registry.ts).
 * The default registration is the public example set; a private rule
 * package can register over the top of it to provide curated content.
 *
 * Voice principles applied by rule authors:
 *   - Third-person observational ("Picking up Chapter 5 unlocks...")
 *   - Never "I" or "you should"
 *   - "This session" not "tonight"
 *   - Concrete details ("4 chapters remain") over vague ("a few left")
 *   - Honest about skipping ("worth knowing if you'd rather not")
 *
 * See docs/voice.md for the canonical voice principles.
 */

import type {
  AccountState,
  PlayerArchetype,
  Recommendation,
  ResetState,
} from '@/types/domain';
import { classifyArchetype } from './archetypes';
import { getRule } from './rules/registry';

export interface RecommendInput {
  account: AccountState | null;
  reset: ResetState;
}

export interface RecommendOutput {
  archetype: PlayerArchetype;
  recommendations: Recommendation[];
}

/**
 * Entry point: classify the player, then dispatch to the registered rule
 * for that archetype. Output is sorted primary → alternative → fallback,
 * stable within each priority.
 */
export function recommend({ account, reset }: RecommendInput): RecommendOutput {
  const archetype = classifyArchetype(account);
  const recommendations = dispatch(archetype, account, reset);

  const order: Record<Recommendation['priority'], number> = {
    primary: 0,
    alternative: 1,
    fallback: 2,
  };
  const sorted = [...recommendations].sort(
    (a, b) => order[a.priority] - order[b.priority]
  );

  return { archetype, recommendations: sorted };
}

function dispatch(
  archetype: PlayerArchetype,
  account: AccountState | null,
  reset: ResetState
): Recommendation[] {
  if (archetype === 'unclassified') {
    return [
      {
        id: 'unclassified-welcome',
        priority: 'primary',
        title: 'Tell Copper Owl about your account',
        zone: 'Setup',
        detail:
          'Pick a profile manually, paste an API key, or sign in with gw2.me. Recommendations get sharper once Copper Owl knows where the account stands.',
        tags: ['Setup', '~1 min'],
        bannerKey: 'welcome',
      },
    ];
  }

  const rule = getRule(archetype);
  if (!rule) {
    // No rule registered for this archetype — engine returns empty rather
    // than crashing. Should never happen in production (example rules
    // cover all archetypes); useful for tests that intentionally clear
    // the registry.
    return [];
  }

  return rule(account, reset);
}
