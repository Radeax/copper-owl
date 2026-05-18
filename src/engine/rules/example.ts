/**
 * Example rule set — the public fallback.
 *
 * Registers a single placeholder recommendation for every archetype. If
 * the production rule package (private) is not installed, this is what
 * the engine surfaces. Useful for:
 *
 *   - Demonstrating the rule shape to anyone learning the codebase
 *   - Letting contributors run `pnpm dev` without authenticated access
 *   - Acting as a no-op default during tests
 *
 * This file is intentionally minimal. Real curated rules live elsewhere.
 */

import type { AccountState, PlayerArchetype, Recommendation, ResetState } from '@/types/domain';
import { registerRuleSet } from './registry';

const placeholder = (archetype: PlayerArchetype): ((
  account: AccountState | null,
  reset: ResetState
) => Recommendation[]) =>
  (_account, _reset) => [
    {
      id: `example-${archetype}`,
      priority: 'primary' as const,
      title: 'Connect a rule provider',
      zone: 'Engine running with example rules',
      detail:
        'The public engine has no curated recommendations. Install a rule provider package (such as the private @copper-owl/rules) or implement custom rules by calling registerRuleSet() against the registry.',
      tags: ['Example', `archetype: ${archetype}`],
      bannerKey: 'placeholder',
    },
  ];

registerRuleSet({
  fresh_80: placeholder('fresh_80'),
  returning: placeholder('returning'),
  engaged_casual: placeholder('engaged_casual'),
  engaged_committed: placeholder('engaged_committed'),
  f2p_explorer: placeholder('f2p_explorer'),
});
