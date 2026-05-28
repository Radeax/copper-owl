/**
 * GW2 API token scopes Copper Owl depends on.
 *
 * - `account` — required for /v2/account (account name, age, expansions).
 * - `characters` — required for /v2/characters (archetype classification by level).
 * - `progression` — required for /v2/account/masteries and achievement state.
 *   Not consumed today, but PRD 0002 (mastery gates) will need it. Surfacing the
 *   warning early lets players regenerate the key once instead of twice.
 *
 * The voice principle: recommend regenerating with conviction, permit deviation.
 * The warning surfaces but does not block — recommendations still render with
 * whatever scopes are present.
 */
export const REQUIRED_SCOPES = ['account', 'characters', 'progression'] as const;

export type RequiredScope = (typeof REQUIRED_SCOPES)[number];

export function missingScopes(permissions: readonly string[]): RequiredScope[] {
  return REQUIRED_SCOPES.filter((scope) => !permissions.includes(scope));
}
