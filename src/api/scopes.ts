/**
 * GW2 API token scopes Copper Owl depends on, plus copy helpers that map
 * scope keys → human-readable permission labels and plain-language effect
 * descriptions for the scope-warning surface.
 *
 * - `account` — required for /v2/account (account name, age, expansions).
 * - `characters` — required for /v2/characters (archetype classification by level).
 * - `progression` — required for /v2/account/masteries and achievement state.
 *   Not consumed today, but PRD 0002 (mastery gates) will need it. Surfacing the
 *   warning early lets players regenerate the key once instead of twice.
 *
 * Voice principle: recommend regenerating with conviction, permit deviation.
 * The warning surfaces but does not block — recommendations still render with
 * whatever scopes are present.
 */
export const REQUIRED_SCOPES = ['account', 'characters', 'progression'] as const;

export type RequiredScope = (typeof REQUIRED_SCOPES)[number];

/** Player-facing capitalised permission name as it appears at account.arena.net. */
export const SCOPE_LABEL: Record<RequiredScope, string> = {
  account: 'Account',
  characters: 'Characters',
  progression: 'Progression',
};

/**
 * Plain-language effect: what the scope unlocks for the player.
 * Used by `scopeWarningCopy` to describe what's skipped — no developer
 * jargon, no scope-key leak into UI prose.
 */
export const SCOPE_EFFECT: Record<RequiredScope, string> = {
  account: 'your account state',
  characters: 'your characters',
  progression: 'story, mastery, or unlock progress',
};

export function missingScopes(permissions: readonly string[]): RequiredScope[] {
  return REQUIRED_SCOPES.filter((scope) => !permissions.includes(scope));
}

function oxfordJoin(items: readonly string[]): string {
  if (items.length === 0) return '';
  const first = items[0]!;
  if (items.length === 1) return first;
  const last = items[items.length - 1]!;
  if (items.length === 2) return `${first} and ${last}`;
  const head = items.slice(0, -1).join(', ');
  return `${head}, and ${last}`;
}

/**
 * Scope-warning body copy. Single-scope cases name the affected effect
 * specifically; two-scope cases coordinate both effects; three-scope cases
 * fall back to "them" referring to the permissions list, because the
 * progression effect contains internal commas that make a three-way Oxford
 * join unreadable.
 */
export function scopeWarningCopy(missing: readonly RequiredScope[]): string {
  if (missing.length === 0) return '';
  const labels = oxfordJoin(missing.map((s) => SCOPE_LABEL[s]));
  const word = missing.length === 1 ? 'permission' : 'permissions';
  const opening = `This API key is missing the ${labels} ${word}.`;

  let dependence: string;
  if (missing.length === 1) {
    dependence = SCOPE_EFFECT[missing[0]!];
  } else if (missing.length === 2) {
    dependence = `${SCOPE_EFFECT[missing[0]!]} and ${SCOPE_EFFECT[missing[1]!]}`;
  } else {
    dependence = 'them';
  }

  return `${opening} Recommendations that depend on ${dependence} will be skipped.`;
}
