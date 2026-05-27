# PRD 0003: Real GW2 API integration end-to-end

**Status:** Partially implemented (transform.ts and home.tsx wired; schema-version header pinned and anonymized fixtures landed; tokeninfo scope verification, fixture-consuming tests, 429 and network UX, skeleton loading states, and manual integration test still pending)
**Date:** May 2026
**Author:** Solo (Radeax)

## User problem

The API key entry flow accepts a GW2 API key and stores it in the auth store. The root dispatcher loads and classifies the real account state, routing `fresh_80` accounts to `/orientation` and all other archetypes to `/home`. The transformGW2Account function in src/api/transform.ts maps fetched /v2/account responses into AccountState, and src/routes/home.tsx consumes real account data via the useGW2Account + useGW2Characters hooks.

What's still missing for the loop to close:

- Anonymized real-API-response fixtures committed to the repo for regression tests
- Manual verification that an actual GW2 key produces sensible /home recommendations (the author has a key ready)
- Error-state UX for 429 rate-limit and network failures (401 unauthorized already surfaces a recoverable status band on /home with a "Try a different key" action that signs out and returns to /welcome)
- Loading state polish during the initial fetch

Author has a personal GW2 key ready (WvW-focused engaged_committed player). The acceptance test is: "Copper Owl shows recommendations against my actual account, including correct archetype classification, real reset-clock awareness, and recommendations that reference my actual game state."

## Scope

In scope (phase 1):

- The existing GW2 client and TanStack Query hooks fetch /v2/account and /v2/characters using the stored API key via gw2Fetch, and transformGW2Account maps those fetched responses into AccountState — DONE across src/api/gw2.ts and src/api/transform.ts
- The dispatcher routes API-key sessions through a real account-state load before rendering /home — DONE in src/routes/index.tsx
- /home renders recommendations through the existing engine pipeline with real account state as input — DONE in src/routes/home.tsx
- Loading state during initial fetch (skeleton or minimal indicator, not a blank flash) — PARTIAL; statusBand exists but minimal
- Error handling:
  - 401 invalid/revoked key → surface a recoverable status band on /home with a "Try a different key" action that signs out and returns to /welcome — DONE
  - 429 rate-limit → respect Retry-After, surface a brief "rate limited, retrying" state — NOT DONE
  - Network failure → retry up to 2 times via TanStack Query (per the QueryClient default in src/main.tsx), then surface a recoverable error state with a manual retry action — NOT DONE
- TanStack Query caching applies as already configured (5 min staleTime, 30 min gcTime) — DONE via main.tsx defaults
- Real-account fixture committed for regression tests — fixtures DONE (under `src/api/__fixtures__/`); test wiring NOT DONE (see remaining piece #1)
- Token scope verification via /v2/tokeninfo fetch on session establishment; surface scope warnings if expected scopes (account, characters, progression) are missing — NOT DONE
- Skeleton loading states on /home and /orientation during initial fetch (replacing the current bare text "Connecting to the GW2 API…" / "Loading account data…") — NOT DONE

Out of scope for phase 1 (deferred to follow-up PRDs):

- Mastery state (PRD 0002 handles /v2/account/masteries fetch and consumption)
- Character-level data beyond what /v2/characters?ids=all currently provides
- Currency and wallet data (gold tracking, Wizard's Vault tokens, karma)
- Achievement state (used by mastery-gate awareness, deferred to PRD 0002)
- gw2.me OAuth PKCE flow (separate PRD when ready to enable third access mode)
- Server-side caching, CDN, or backend (architectural decision per ADR 0001 — no backend for v1)

## Remaining implementation pieces

1. **Wire the committed fixtures into transform.test.ts.** Anonymized real-account fixtures already landed under `src/api/__fixtures__/` (PRD 0003 Phase 1). What remains is adding regression tests that run `transformGW2Account` over those fixtures and assert the WvW-focused engaged_committed classification path. Anonymization rules are documented in `src/api/__fixtures__/README.md` and should be respected when adding new fixture variants.

2. **Token scope verification.** Fetch /v2/tokeninfo on session establishment via useGW2TokenInfo (already defined in src/api/gw2.ts). Surface a non-blocking warning on /home if the token is missing 'account' (always needed), 'characters' (needed for archetype classification), or 'progression' (needed for future mastery-gates work in PRD 0002). Warning copy: "This key is missing the {scope} scope. Some features won't work until the key is regenerated with it." per voice principles.

3. **429 rate-limit handling in src/api/client.ts.** Currently the error code 'rate_limited' is returned but no Retry-After header is consulted. Read Retry-After from the response, attach it to the GW2ApiError instance (new optional retryAfterSeconds field), surface a brief countdown banner on /home when active.

4. **Network failure UX.** TanStack Query's default retry behavior (up to 2 retries on non-4xx errors) covers transient failures. After exhausted retries, the error state should be a single-line recoverable surface on /home with a Retry button that re-runs the query rather than a hard error page.

5. **Skeleton loading states.** Replace the current "Connecting to the GW2 API…" / "Loading account data…" bare-text states with subtle skeleton placeholders matching the eventual content shape (one for the recommendation cards, one for the reset clock). Keep the text label as a screen-reader announcement.

6. **Manual integration test against real account.** Enter the author's real API key in dev, verify /home renders engaged_committed archetype, reset clock is accurate, recommendations reference real expansion ownership. Verify the tokeninfo scope warnings appear correctly for a key missing 'progression'.

## Test plan

- Unit tests for transformGW2Account against committed real-response fixtures (currently uses synthetic test data only)
- Test the 401 path with a deliberately invalid key — currently covered by the auth-error guard in home.tsx
- Test the 429 path by mocking Retry-After response
- Integration test: enter a real key in dev, observe /home rendering real recommendations
- Manual test: enter a key that's missing the account scope, observe graceful error handling

## Effort estimate

Remaining work:

- Fixture capture + anonymization + test integration: 1-2 hours
- 429 rate-limit handling refinement: 1-2 hours
- Network failure recoverable UX on /home: 1-2 hours
- Manual integration testing pass: 1 hour
- Total: roughly half a day for what's left

## Priority

High. The implementation is already mostly done; closing the remaining gaps takes the app from "demo with mock data" to "tool the author actively uses." This is the milestone that justifies all the infrastructure work to date.

## Open questions

- Should we capture multiple fixture variants (engaged_committed, fresh_80, returning, f2p) or just engaged_committed for now? Author's account only produces one variant; synthetic variants for the other archetypes are already covered in transform.test.ts. Probably just commit the real engaged_committed fixture and leave the rest synthetic.
- Should we add a manual refresh action on /home? Probably yes, but deferred to a polish pass. Current TanStack Query staleTime (5 min) handles freshness for most session lengths.
- What's the right behavior if the account has no expansions (F2P player who entered an API key from a free account)? Classifier already handles this case via f2p_explorer archetype. Verified via transform.test.ts.

## References

- docs/architecture.md (TanStack Query configuration, rate-limit queue, three-mode unified Session shape)
- docs/product/0001-playstyle-preference.md (consumed by rule modules after this lands)
- docs/product/0002-mastery-gates.md (depends on this — fetches /v2/account/masteries)
- ADR 0002 (public engine, private rules package — this PRD doesn't touch rules)
- ADR 0005 (Cloudflare Pages hosting — no backend, direct API calls only)
- src/api/transform.ts (implementation)
- src/api/transform.test.ts (existing coverage)
- src/routes/home.tsx (real account state consumption)
- GW2 API /v2/account: https://wiki.guildwars2.com/wiki/API:2/account
- GW2 API rate limits: https://wiki.guildwars2.com/wiki/API:Main
