# PRD 0003: Real GW2 API integration end-to-end

**Status:** Implemented (shipped end-to-end: the dispatcher loads and classifies real account state, /home renders real recommendations, with tokeninfo scope verification, 429 and network-failure status bands, skeleton loading states, fixture-backed regression tests, and a route-level integration harness. Manually verified against a real GW2 account — which surfaced and fixed a reset-clock UTC bug.)
**Date:** May 2026
**Author:** Solo (Radeax)

## User problem

The API key entry flow accepts a GW2 API key and stores it in the auth store. The root dispatcher loads and classifies the real account state, routing `fresh_80` accounts to `/orientation` and all other archetypes to `/home`. The transformGW2Account function in src/api/transform.ts maps fetched /v2/account responses into AccountState, and src/routes/home.tsx consumes real account data via the useGW2Account + useGW2Characters hooks.

What closed the loop, now all shipped:

- Anonymized real-API-response fixtures committed for regression tests, wired into `transform.test.ts`
- Token scope verification via `/v2/tokeninfo`, with a non-blocking `/home` warning when expected scopes are missing
- Error-state UX for 429 rate-limit (a countdown band that auto-retries) and network/5xx failures (a recoverable band with a manual Retry), alongside the existing 401 auth band that signs out and returns to `/welcome`
- Skeleton loading states on `/home` and `/orientation` during the initial fetch
- A route-level integration harness exercising the full welcome → dispatch → /home flow and every error branch

The acceptance test passed against the author's real account (WvW-focused engaged player): Copper Owl shows recommendations against the actual account, with correct archetype classification (an engaged account is classified `engaged_casual` rather than `engaged_committed` via the API path, since `pursuingGoal` isn't derivable from the API), real reset-clock awareness, and recommendations referencing real game state. The manual pass also surfaced a reset-clock bug — the daily/weekly reset times were wrong (16:00 UTC instead of the canonical 00:00 UTC daily / Monday 07:30 UTC weekly) — since fixed.

## Scope

In scope — all delivered:

- The GW2 client and TanStack Query hooks fetch /v2/account and /v2/characters using the stored API key via gw2Fetch, and transformGW2Account maps those responses into AccountState — DONE across src/api/gw2.ts and src/api/transform.ts
- The dispatcher routes API-key sessions through a real account-state load before rendering /home — DONE in src/routes/index.tsx
- /home renders recommendations through the existing engine pipeline with real account state as input — DONE in src/routes/home.tsx
- Loading state during initial fetch (skeleton, not a blank flash) — DONE via HomeSkeleton/OrientationSkeleton
- Error handling:
  - 401 invalid/revoked key → recoverable status band on /home with a "Try a different key" action that signs out and returns to /welcome — DONE
  - 429 rate-limit → respect Retry-After, surface a countdown band that auto-retries — DONE (GW2ApiError.retryAfterSeconds + RateLimitBand)
  - Network/5xx failure → retry up to 2 times via TanStack Query (per the QueryClient default in src/main.tsx), then a recoverable band with a manual Retry — DONE (NetworkErrorBand)
- TanStack Query caching applies as configured (5 min staleTime, 30 min gcTime) — DONE via main.tsx defaults
- Real-account fixtures committed and wired into regression tests (under `src/api/__fixtures__/`) — DONE
- Token scope verification via /v2/tokeninfo on session establishment; non-blocking scope warning when account/characters/progression are missing — DONE
- Skeleton loading states on /home and /orientation, replacing the bare "Connecting to the GW2 API…" / "Loading account data…" text — DONE

Out of scope (deferred to follow-up PRDs):

- Mastery state (PRD 0002 handles /v2/account/masteries fetch and consumption)
- Character-level data beyond what /v2/characters?ids=all currently provides
- Currency and wallet data (gold tracking, Wizard's Vault tokens, karma)
- Achievement state (used by mastery-gate awareness, deferred to PRD 0002)
- gw2.me OAuth PKCE flow (separate PRD when ready to enable third access mode)
- Server-side caching, CDN, or backend (architectural decision per ADR 0005 — no backend for v1)

## Implementation

Shipped across these changes, all merged to main (numbered by the Phase 2 piece they implement, not by merge order):

1. **CORS fix — API key + schema version moved to query params** ([PR #14](https://github.com/Radeax/copper-owl/pull/14)). The GW2 API rejects CORS preflight, so sending `Authorization` / `X-Schema-Version` as headers broke the web build. Both now ride the query string (`?access_token=`, `?v=`), with a `DO NOT BREAK` contract comment in `src/api/client.ts` and a URL-asserting test.
2. **Fixture-backed transform tests + null-guard** ([PR #11](https://github.com/Radeax/copper-owl/pull/11)). `transform.test.ts` runs `transformGW2Account` over the committed fixtures and asserts the classification path; `daysSinceLastLogin` resolves to `null` (not `NaN`) when `last_modified` is missing.
3. **Token scope verification** ([PR #15](https://github.com/Radeax/copper-owl/pull/15)). `/v2/tokeninfo` via `useGW2TokenInfo`, surfacing a non-blocking `StatusBand` warning on /home when `account` / `characters` / `progression` are missing. Introduced the reusable `StatusBand` primitive.
4. **429 rate-limit handling** ([PR #25](https://github.com/Radeax/copper-owl/pull/25)). `GW2ApiError.retryAfterSeconds` parsed from `Retry-After`; a countdown band (`RateLimitBand`) on /home that auto-retries when it reaches zero.
5. **Network-failure UX** ([PR #26](https://github.com/Radeax/copper-owl/pull/26)). A recoverable band (`NetworkErrorBand`) with a manual Retry for `network` / `server` errors after TanStack Query's retries exhaust — deliberately a manual retry, not an auto-countdown.
6. **Skeleton loading states** ([PR #27](https://github.com/Radeax/copper-owl/pull/27)). Shape-matching skeletons on /home and /orientation, reduced-motion-aware, with a screen-reader announcement via a shared `VisuallyHidden` primitive.
7. **Manual integration test + route-level harness** ([PR #30](https://github.com/Radeax/copper-owl/pull/30)). Automated coverage of the full welcome → dispatch → /home flow and every error branch. The manual real-key pass surfaced a reset-clock UTC bug, fixed in [PR #31](https://github.com/Radeax/copper-owl/pull/31) (engine) and copper-owl-rules PR #2 (the matching rule prose).

## Test coverage

- `transformGW2Account` unit tests over committed real-response fixtures (`transform.test.ts`)
- 401 path covered by the auth-error guard on /home
- 429 `Retry-After` parsing in `client.test.ts`; the countdown band in `RateLimitBand.test.tsx`
- Network/5xx error classification in `client.test.ts`; the band in `NetworkErrorBand.test.tsx`
- Scope detection + warning copy in `scopes.test.ts`
- Skeleton render + screen-reader announcement in `HomeSkeleton` / `OrientationSkeleton` tests; `VisuallyHidden` unit test
- Route-level integration harness (`src/test/phase2-routes.integration.test.tsx`) drives welcome → dispatch → /home and the 401 / 429 / network / missing-scope branches against the committed fixtures
- Manual: real key in dev — verified the archetype, reset clock, real expansion references, and the missing-progression scope warning (and caught the reset-time bug)

## Priority

High — and delivered. This was the milestone that takes the app from a demo over mock data to a tool the author actively uses, justifying the infrastructure built to date.

## Resolved questions

- **Multiple fixture variants, or just engaged?** Committed the real engaged fixture; the other archetypes (fresh_80, returning, f2p) stay synthetic in `transform.test.ts`, since the author's account only produces one real variant.
- **A manual refresh action on /home?** Still deferred to a polish pass — TanStack Query's 5-min staleTime handles freshness for most session lengths. Not a blocker for this PRD.
- **F2P account with no expansions?** Handled — the classifier returns `f2p_explorer`, verified via `transform.test.ts`.

## References

- docs/architecture.md (TanStack Query configuration, rate-limit queue, three-mode unified Session shape)
- docs/product/0001-playstyle-preference.md (consumed by rule modules)
- docs/product/0002-mastery-gates.md (depends on this — fetches /v2/account/masteries; needs the `progression` scope this PRD now verifies)
- ADR 0002 (public engine, private rules package — this PRD doesn't touch rules)
- ADR 0005 (Cloudflare Pages hosting — no backend, direct API calls only)
- src/api/transform.ts, src/api/transform.test.ts (transform + coverage)
- src/api/client.ts (CORS contract, 429 Retry-After, error classification)
- src/routes/home.tsx (real account state consumption + the status bands)
- src/engine/reset.ts (reset clock — corrected to 00:00 UTC daily / Monday 07:30 UTC weekly)
- src/test/phase2-routes.integration.test.tsx (route-level integration harness)
- GW2 API /v2/account: https://wiki.guildwars2.com/wiki/API:2/account
- GW2 API rate limits: https://wiki.guildwars2.com/wiki/API:Main
- GW2 server reset times: https://wiki.guildwars2.com/wiki/Server_reset
