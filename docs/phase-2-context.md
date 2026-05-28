# PRD 0003 Phase 2 — Implementation kickoff context

> Last updated: May 2026, post-PR-#11 merge
> Status: in progress — piece #2 (fixtures + null-guard) merged via PR #11; piece #1 (CORS fix) queued next
> Branch: one branch per piece off `main` (Phase 1 + piece #2 already merged there)

This doc captures the working context for closing the remaining PRD 0003 work. Read it before starting any Phase 2 commits. It's a snapshot of decisions made during Phase 1 design discussions that aren't all captured in code or PRDs yet.

## What's already done

### Phase 1 (PR #9 merged)

- Schema-version header fix in `src/api/client.ts` (`X-Schema-Version: 2022-03-23T19:00:00.000Z`) — *note: piece #1 below replaces the delivery mechanism. The version string survives; it moves from a header to a `?v=` query param.*
- Anonymized real-account fixtures at `src/api/__fixtures__/` (account, characters, two tokeninfo variants) plus README documenting anonymization rules
- PRD 0003 scope expanded to include tokeninfo scope verification and skeleton loading states
- `.gitignore` blocks `.tmp-fixtures/` from accidental commits

### Piece #2 — fixture-wired transform tests + null-guard (PR #11 merged)

- Loaded each fixture in `transform.test.ts`; asserted `transformGW2Account` round-trip and `classifyArchetype` result for `engaged_committed`
- Verified the PoF-implies-HoT inference path against real fixture data, not synthetic
- Defensive null-guard added to `transform.ts`: when `last_modified` is missing, `daysSinceLastLogin` resolves to `null` instead of `NaN`. Synthetic fixture variant covers the path.

## Phase 2 scope — seven implementation pieces

Renumbered after piece #1 (CORS fix) was discovered during manual testing post-PR-#11. Numbering now matches the [PRD 0003 Phase 2 Tracking](https://www.notion.so/36efe492e88e81f28ed6c029a73c1f82) Notion page.

### 1. CORS bug fix — move API key + schema version from headers to query params

Discovered during manual testing of PR #11. Entering a real GW2 API key in the browser fails with CORS errors. The GW2 API backend does not support CORS preflight (`OPTIONS`), so any non-safelisted request header forces the browser to preflight and the API rejects it. The current `gw2Fetch` sends `Authorization: Bearer ${apiKey}` and `X-Schema-Version` — each independently triggers preflight.

**Fix**: pass the API key as `?access_token=KEY` and the schema version as `?v=SCHEMA`, per ArenaNet's documented browser-safe method. `Accept: application/json` is CORS-safelisted and stays. `GW2_SCHEMA_VERSION` stays a constant; only its delivery mechanism changes. Move `lang` to `?lang=` too for consistency (it was a safelisted header, not part of the bug, but unifying makes the "only simple headers" invariant self-evident).

**URL construction**: use `new URL(path, GW2_API_BASE)` + `searchParams.set(...)`. Naive string concatenation would clobber paths that already carry a query string (e.g. `/v2/characters?ids=all`).

**Why this jumps the queue**: blocks browser login entirely. The Tauri desktop build is unaffected (native HTTP, no browser CORS enforcement), and the Node-based fixture-capture script was unaffected (no CORS enforcement) — which is why this surfaced only on the web build, after manual testing began. Also unblocks piece #7 (manual integration test).

**Anti-regression**: code comment in `client.ts` explaining the CORS root cause so future-self doesn't "fix" the key back to an `Authorization` header. Unit test that parses the URL passed to `fetch` and asserts `access_token`, `v`, and pre-existing query params (`ids=all`) are all present, plus a negative assertion that `Authorization` and `X-Schema-Version` are absent.

### 2. ~~Wire fixtures into `transform.test.ts` + defensive null-guard~~ — DONE (PR #11)

Closed by [PR #11](https://github.com/Radeax/copper-owl/pull/11). `transform.test.ts` loads the fixtures and asserts the `engaged_committed` round-trip, classifier path, and PoF-implies-HoT inference. `daysSinceLastLogin` resolves to `null` (not `NaN`) when `last_modified` is missing.

### 3. Token scope verification via `useGW2TokenInfo`

The hook is already defined in `src/api/gw2.ts:83` but unused. Phase 2 wires it into the dispatcher and `/home`.

**Approach**: fetch tokeninfo alongside the existing account fetch in `home.tsx` and `index.tsx` (dispatcher). If the response is missing `account`, `characters`, or `progression` scopes, surface a non-blocking warning component on `/home`. Don't block the user; recommendations should still render with whatever scopes are present.

**Voice principle 9 reminder**: the warning recommends regenerating with conviction while explicitly permitting the user to continue. Suggested copy (pre-flagged for voice review):

> "This key doesn't include the {scope} scope. Recommendations that depend on it will be skipped."

The original PRD copy ("This key is missing the {scope} scope. Some features won't work until the key is regenerated with it.") reads imperative; the rewrite above is observational. Run `/voice` on the final copy when it ships.

**Use the missing-progression fixture** for testing the missing-scope branch.

### 4. 429 rate-limit handling

`src/api/client.ts:errorCodeForStatus` returns `'rate_limited'` for 429, but the `Retry-After` header is never read.

**Changes needed**:
- Extend `GW2ApiError` class with optional `retryAfterSeconds?: number` field
- Parse `Retry-After` header in the 429 branch of `gw2Fetch`'s error handling
- Add a status band component on `/home` that surfaces "Rate limit hit, retrying in Ns" with a countdown when an active 429 error is held in TanStack Query state

The countdown updates every second; reuse the `useReset` pattern from `src/utils/useReset.ts` if useful.

### 5. Network failure UX

TanStack Query already retries up to 2 times on non-4xx errors (per `main.tsx` configuration). What's missing is the post-exhaustion UX.

**Approach**: after retries exhaust, `accountQuery.error` will be a `GW2ApiError` with `code === 'network'`. On `/home`, surface a single-line recoverable error: "Couldn't reach the API. Try again?" with a Retry button that calls `accountQuery.refetch()`.

Don't blanket-handle this in the global query client — handle in the route so the error UX matches the surface semantics. A blanket toast would feel wrong for the architecture.

### 6. Skeleton loading states

Replace the current bare-text loading states in `home.tsx` ("Connecting to the GW2 API…") and `orientation.tsx` ("Loading account data…") with subtle skeleton placeholders matching the eventual content shape.

**Component shape**:
- `<HomeSkeleton>` — placeholder boxes matching the recommendation card + reset clock layout
- `<OrientationSkeleton>` — placeholder for the orientation hero + section structure

Keep the text label as a screen-reader announcement (`aria-label` or `<VisuallyHidden>` inside the skeleton). Don't lose accessibility for visual polish.

Reuse `var(--bg-3)` and `var(--border)` from `tokens.css` for the skeleton background and border. Add a subtle pulse animation if it fits — but if it doesn't feel right with the warm palette, drop it. Skeletons shouldn't feel busy.

### 7. Manual integration test

Final step. Use a real GW2 API key in dev:

1. Enter the key at `/welcome`
2. Verify `/home` renders the expected archetype (engaged_committed for the author's WvW account)
3. Verify the reset clock is accurate against your local time
4. Verify recommendations reference real expansion ownership
5. Generate a second key without the `progression` scope; verify the scope warning surfaces correctly

Document the manual test results in the PR description, not in repo docs. PR-level evidence is fine for this.

## Phase 1 caveats — status

Two closed by piece #2 (PR #11); one still outstanding.

### ~~Defensive null-check on `last_modified`~~ — CLOSED (PR #11)

The `last_modified ? ... : null` guard is in `transform.ts` and a synthetic null-variant fixture exercises it.

### ~~Fixtures land but no tests consume them yet~~ — CLOSED (PR #11)

`transform.test.ts` loads the fixtures and asserts the round-trip + classifier paths.

### PRD status will need updating on merge

PRD 0003 currently reads "Partially implemented" with explicit Phase 1 and Phase 2 callouts. When Phase 2 merges, update the status to "Implemented" and remove the Phase 1/Phase 2 hedging language. The PRD then represents shipped state, not in-progress state.

## Decisions made during Phase 1 design that aren't in code yet

A few patterns we converged on that the next session should preserve:

**Status bands are the primary error/warning surface on `/home`.** Not modals, not toasts, not inline reformatting of the recommendation cards. A status band sits above the recommendation list, contains the message + any action (Retry button, countdown, scope warning), and disappears when the condition clears. Three of Phase 2's pieces (scope warnings, 429 countdown, network failure) all use this pattern. Build the band as a reusable component (`<StatusBand>` in `src/components/`) rather than reimplementing per-state.

**Voice on error/warning prose follows principle 9.** Recommend the recovery action with conviction; don't soft-pedal. "The key was rejected. Try a different key." is fine. "Sorry, your key didn't work, you might want to try another one?" is not. Run `/voice` before shipping the final copy.

**Skeletons match content shape, not generic shimmer.** A skeleton that's a vague gray blob doesn't earn its place. A skeleton that's "two card-shaped boxes with a small clock band above" prepares the eye for what's coming. This is more work but the right call given the project's design discipline.

**Tests use real fixtures where possible.** The engaged_committed fixture is real-account-derived. Future archetype fixtures (returning, fresh_80, f2p_explorer) should also be real-account-derived when accounts become available. Synthetic fixtures stay for testing classifier edge cases only.

## Workflow reminders

The agents and slash commands from PR #4 are live. Use them.

- `/review` before pushing — handles correctness, voice on shipping strings, ADR compliance
- `/voice` on any new prose (scope warning copy, error messages, button labels)
- `/prd-review` if any PRD updates land in Phase 2

Branch off main for Phase 2 work. The previous `feat/real-api-integration` branch has merged Phase 1 commits but is no longer the active branch. Either continue on that branch with new commits OR start fresh — both work. Fresh is slightly cleaner if you want a separate PR for Phase 2 from Phase 1.

Commit messages should follow the established pattern: short title, blank line, then a body explaining what each change does and why. Multi-paragraph for substantial commits is fine — the project values clear commit history.

## Quick-start order

When the next session begins, do these in order:

1. Read this file
2. Read `docs/product/0003-real-api-key-integration.md` for the canonical PRD
3. Read `docs/voice.md` if writing any new prose
4. Read `docs/pr-review.md` for the review rubric
5. Check `git status` and `git log --oneline -5` to confirm the starting state
6. Start with piece #1 (CORS fix). After it merges, move to piece #3 (token scope verification — piece #2 is already done).

After piece #1 lands, browser login works end-to-end and piece #7's manual integration test is unblocked. That's the foundation for everything else in Phase 2.

## References

- PR #9 (Phase 1 merge): https://github.com/Radeax/copper-owl/pull/9
- Issue #6 (PRD 0003 tracking): https://github.com/Radeax/copper-owl/issues/6
- Milestone #1 (Tool works against my real account): https://github.com/Radeax/copper-owl/milestone/1
- PRD 0003: `docs/product/0003-real-api-key-integration.md`
- Voice principles: `docs/voice.md`
- Review rubric: `docs/pr-review.md`
- Fixture anonymization rules: `src/api/__fixtures__/README.md`