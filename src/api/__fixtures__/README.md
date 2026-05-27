# API fixtures

Anonymized real GW2 API responses captured against the author's account, used in `transform.test.ts` for regression coverage of the engaged_committed archetype classification path.

## Files

- `account-engaged-committed.json` — `/v2/account` response. WvW-focused account, all expansions owned, active player.
- `characters-engaged-committed.json` — `/v2/characters?ids=all` response. Includes at least one level-80 character.
- `tokeninfo-full-scopes.json` — `/v2/tokeninfo` response. Token has all relevant scopes (`account`, `characters`, `progression`, `inventories`, `wallet`, `unlocks`, `builds`, `tradingpost`, `guilds`, `pvp`).
- `tokeninfo-missing-progression.json` — Variant of above with `progression` removed from `permissions`. Used to test the scope-warning UX.

## Schema version

All captures use schema version `2022-03-23T19:00:00.000Z`, matching `GW2_SCHEMA_VERSION` in `src/api/client.ts`. This is required to get the `last_modified` fields used by `daysSinceLastLogin` calculations. If the schema version in `client.ts` changes, the fixtures should be recaptured.

## Anonymization

These fields are replaced with synthetic-but-format-valid values; everything else is preserved:

- `account.id` → `E1234567-89AB-CDEF-0123-456789ABCDEF`
- `account.name` → `TestAccount.1234`
- `account.world` → `1001` (Anvil Rock — generic NA world, no engine-relevant meaning vs. the real value)
- `account.guilds`, `account.guild_leader` → stripped (guild memberships are not engine-relevant)
- `account.created`, `account.last_modified` → rounded to day-start (engine consumes `daysSinceLastLogin` and `ageDays` at integer-day granularity, so the time portion adds correlation potential without test value)
- `account.daily_ap`, `account.monthly_ap`, `account.wvw_rank`, `account.age` → zeroed (engine doesn't currently consume these; non-zero values are GW2 leaderboard-correlatable signals)
- `character.name` (each) → `Hero One`, `Hero Two`, etc.
- `character.last_modified` (each) → rounded to day-start (same rationale as account.last_modified)
- `tokeninfo.id` → `A1B2C3D4-5678-90EF-1234-567890ABCDEF` (intentionally different UUID from account.id, since tokeninfo.id is the API key's UUID, not the account's)
- `tokeninfo.name` → `Copper Owl test key` (synthetic, makes the fixture's origin self-documenting)

Date portions (year-month-day), levels, professions, expansion ownership, and access flags are real — the test exercises real classifier behavior. Time portions, numeric stats not consumed by the engine, and identifying string values are anonymized.

## Recapture

To recapture, write a temporary `scripts/capture-fixtures.ts` that fetches the three endpoints with `X-Schema-Version: 2022-03-23T19:00:00.000Z`, anonymize per the rules above, and replace the files. Delete the script before committing.
