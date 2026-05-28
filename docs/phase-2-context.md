# PRD 0003 Phase 2 — Implementation kickoff context

> Last updated: May 2026, post-PR-#9 merge
> Status: ready to begin
> Branch: new `feat/real-api-integration-phase-2` off main, OR continue `feat/real-api-integration`

This doc captures the working context for closing the remaining PRD 0003 work. Read it before starting any Phase 2 commits. It's a snapshot of decisions made during Phase 1 design discussions that aren't all captured in code or PRDs yet.

## What's already done (Phase 1, PR #9 merged)

- Schema-version header fix in `src/api/client.ts` (`X-Schema-Version: 2022-03-23T19:00:00.000Z`)
- Anonymized real-account fixtures at `src/api/__fixtures__/` (account, characters, two tokeninfo variants) plus README documenting anonymization rules
- PRD 0003 scope expanded to include tokeninfo scope verification and skeleton loading states
- `.gitignore` blocks `.tmp-fixtures/` from accidental commits

## Phase 2 scope — six remaining implementation pieces

These map 1:1 to the "Remaining implementation pieces" section in PRD 0003. Numbered for tracking.

### 1. Wire fixtures into `transform.test.ts`

The fixtures exist but no test consumes them. First task: load each fixture and assert the `transformGW2Account` round-trip produces the expected `AccountState` shape. The engaged_committed archetype path needs particular attention because that's what the fixture represents (WvW player, max-level main, recent activity).

**Critical test case to include**: the PoF-implies-HoT inference path. The fixture's `account.access` array contains `PathOfFire` but NOT `HeartOfThorns`, because PoF bundles HoT in the GW2 expansion model. `transform.ts:25` adds `expansions.hot = true` when `expansions.pof` is true. The test should verify this inference works against real fixture data, not just synthetic.

**Suggested test names**:
- `engaged_committed fixture round-trips through transformGW2Account`
- `engaged_committed fixture classifies as engaged_committed via classifyArchetype`
- `engaged_committed fixture: PoF in access array implies HoT ownership in expansions`

### 2. Token scope verification via `useGW2TokenInfo`

The hook is already defined in `src/api/gw2.ts:74` but unused. Phase 2 wires it into the dispatcher and `/home`.

**Approach**: fetch tokeninfo alongside the existing account fetch in `home.tsx` and `index.tsx` (dispatcher). If the response is missing `account`, `characters`, or `progression` scopes, surface a non-blocking warning component on `/home`. Don't block the user; recommendations should still render with whatever scopes are present.

**Voice principle 9 reminder**: the warning recommends regenerating with conviction while explicitly permitting the user to continue. Suggested copy (pre-flagged for voice review):

> "This key doesn't include the {scope} scope. Recommendations that depend on it will be skipped."

The original PRD copy ("This key is missing the {scope} scope. Some features won't work until the key is regenerated with it.") reads imperative; the rewrite above is observational. Run `/voice` on the final copy when it ships.

**Use the missing-progression fixture** for testing the missing-scope branch.

### 3. 429 rate-limit handling

`src/api/client.ts:errorCodeForStatus` returns `'rate_limited'` for 429, but the `Retry-After` header is never read.

**Changes needed**:
- Extend `GW2ApiError` class with optional `retryAfterSeconds?: number` field
- Parse `Retry-After` header in the 429 branch of `gw2Fetch`'s error handling
- Add a status band component on `/home` that surfaces "Rate limit hit, retrying in Ns" with a countdown when an active 429 error is held in TanStack Query state

The countdown updates every second; reuse the `useReset` pattern from `src/utils/useReset.ts` if useful.

### 4. Network failure UX

TanStack Query already retries up to 2 times on non-4xx errors (per `main.tsx` configuration). What's missing is the post-exhaustion UX.

**Approach**: after retries exhaust, `accountQuery.error` will be a `GW2ApiError` with `code === 'network'`. On `/home`, surface a single-line recoverable error: "Couldn't reach the API. Try again?" with a Retry button that calls `accountQuery.refetch()`.

Don't blanket-handle this in the global query client — handle in the route so the error UX matches the surface semantics. A blanket toast would feel wrong for the architecture.

### 5. Skeleton loading states

Replace the current bare-text loading states in `home.tsx` ("Connecting to the GW2 API…") and `orientation.tsx` ("Loading account data…") with subtle skeleton placeholders matching the eventual content shape.

**Component shape**:
- `<HomeSkeleton>` — placeholder boxes matching the recommendation card + reset clock layout
- `<OrientationSkeleton>` — placeholder for the orientation hero + section structure

Keep the text label as a screen-reader announcement (`aria-label` or `<VisuallyHidden>` inside the skeleton). Don't lose accessibility for visual polish.

Reuse `var(--bg-3)` and `var(--border)` from `tokens.css` for the skeleton background and border. Add a subtle pulse animation if it fits — but if it doesn't feel right with the warm palette, drop it. Skeletons shouldn't feel busy.

### 6. Manual integration test

Final step. Use a real GW2 API key in dev:

1. Enter the key at `/welcome`
2. Verify `/home` renders the expected archetype (engaged_committed for the author's WvW account)
3. Verify the reset clock is accurate against your local time
4. Verify recommendations reference real expansion ownership
5. Generate a second key without the `progression` scope; verify the scope warning surfaces correctly

Document the manual test results in the PR description, not in repo docs. PR-level evidence is fine for this.

## Phase 1 caveats carried forward

Three things flagged in Phase 1 that should land during Phase 2:

### Defensive null-check on `last_modified`

The PR #9 description noted: "Defensive null-check in `transform.ts` for `daysSinceLastLogin` when `last_modified` is missing — currently relies on the pinned schema-version header staying set. A `last_modified ? ... : null` guard (with a widened return type) would be belt-and-suspenders."

**Recommendation**: do this during piece #1 (fixture-wiring tests). Add a synthetic fixture variant without `last_modified` to verify the null-handling works. Update `AccountState.daysSinceLastLogin` from `number | null` (it's already nullable in the type) to be set to `null` when source is missing, rather than NaN.

**Why now**: the schema header is configured once and never changes. If a future code change accidentally removes the header (refactor, new fetch function, anyone), the silent NaN bug returns. The defensive guard makes the failure mode visible (null cleanly skips classification thresholds) instead of producing garbage classifications.

### Fixtures land but no tests consume them yet

Phase 1 deliberately split fixtures from the tests that use them for reviewability. Phase 2's piece #1 closes this. If Phase 2 stalls or pauses, the fixtures sit unused — they pass `pnpm test:run` only because nothing references them. Don't let the gap persist long; the longer fixtures sit without tests, the more likely they drift from the engine's actual expectations.

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
6. Start with piece #1 (fixture wiring + defensive null-check)

After piece #1 lands, the next session has a working test against real fixtures and a defensive guard against the schema-drift bug. That's the foundation for everything else in Phase 2.

## References

- PR #9 (Phase 1 merge): https://github.com/Radeax/copper-owl/pull/9
- Issue #6 (PRD 0003 tracking): https://github.com/Radeax/copper-owl/issues/6
- Milestone #1 (Tool works against my real account): https://github.com/Radeax/copper-owl/milestone/1
- PRD 0003: `docs/product/0003-real-api-key-integration.md`
- Voice principles: `docs/voice.md`
- Review rubric: `docs/pr-review.md`
- Fixture anonymization rules: `src/api/__fixtures__/README.md`