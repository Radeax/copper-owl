# PRD 0001: Playstyle preference as a recommendation framing modifier

**Status:** Proposed
**Date:** May 2026
**Author:** Solo (Radeax)

## User problem

Five distinct GW2 playstyles produce meaningfully different "optimal next action" recommendations from the same engine state:

- **Story-first** — narrative arc is the goal; side content is optional and frequently skipped; cutscenes watched; quest dialogue read.
- **Completion-first** — 100% zone exploration before moving on; every Hero Point, Mastery Insight, Point of Interest, Vista, and Renown Heart collected; the Zeigarnik satisfaction of full territory mapped.
- **Goal-driven** — pursues specific mechanical unlocks (mounts, masteries, ascended gear, legendary precursors); narrative secondary; efficiency-focused.
- **Achievement-focused** — chases Achievement Points, titles, and meta-achievement rewards; treats AP as the primary progression currency.
- **Balanced** *(default)* — mix of all approaches; follows what feels right in the moment; doesn't strongly identify with any single mode.

Copper Owl currently treats all engaged players the same way. A Goal-driven player asking "should I do the Verdant Brink meta?" deserves a different answer than a Story-first player asking the same question. Same archetype, same reset clock, same mastery state — different ideal recommendation prose.

Real-world example surfaced by author's own play experience: starting HoT for the first time. The question "what mastery should I focus on first?" has different right answers depending on intent:

- Story-first → "Updraft Use is required for chapter 4; that's the next gate."
- Goal-driven → "Glider Basics unlocks gliding everywhere going forward. Updraft Use lets you skip terrain in PoF and SotO too."
- Completion-first → "Glider Basics opens 9 mastery insights in Verdant Brink alone."

All three statements are true. The engine should pick the right framing automatically based on declared playstyle.

## Scope

In scope:

- Add `playstylePreference: PlaystylePreference | null` to `AccountState` and the auth store's `AnonymousProfile`.
- PlaystylePreference values: `'story_first' | 'completion_first' | 'goal_driven' | 'achievement_focused' | 'balanced'`. Null indicates "not specified, use balanced default."
- For API key users: expose an unobtrusive toggle on `/home` and `/orientation` to set or change preference. Default null. Visible but secondary.
- For anonymous users: do NOT ask at the start.tsx archetype-selection form. Allow setting from `/home` after the archetype-driven flow lands.
- Rule modules that generate session-level recommendations consult the preference and adjust the detail prose accordingly.
- Apply to engaged_casual, engaged_committed, and fresh_80 archetypes where playstyle materially changes the recommendation.
- F2P and returning archetypes default to balanced; playstyle is less relevant for these dominant questions.

Out of scope:

- Mixed-mode preferences ("completion-first for HoT, goal-driven for PoF") — too complex for v1.
- Behavioral inference ("we noticed you skip cutscenes, switching to story_first off") — premature.
- Pre-populating playstyle from API data alone — no reliable signal exists.
- Applying playstyle to PvP/WvW/fractal-specific recommendations until those features ship.

## Proposed solution

Four engine + UI pieces:

**1. Type and state additions.**

    // src/types/domain.ts
    export type PlaystylePreference =
      | 'story_first'
      | 'completion_first'
      | 'goal_driven'
      | 'achievement_focused'
      | 'balanced';

    // Added to AccountState:
    playstylePreference: PlaystylePreference | null;

    // Added to AnonymousProfile in auth.ts:
    playstylePreference: PlaystylePreference | null;

**2. UI capture on the home and orientation routes.**

A small disclosure on the page footer or below the recommendation cards:

    Reading recommendations as: Balanced · change

Clicking "change" expands a five-option toggle with the modes above plus brief one-line descriptions. Setting updates the auth store immediately; the recommendation cards re-render with the new framing. No reload, no confirmation step.

**3. Rule consumption pattern.**

Rule modules accept `playstylePreference` as input (via `account.playstylePreference`) and produce framing-appropriate detail text:

    // Inside a rule:
    const detail = framingFor(account.playstylePreference, {
      story_first: 'The next chapter requires Updraft Use. Available now from Gliding T2.',
      completion_first: 'Updraft Use opens 5 mastery insights in Verdant Brink. Required for chapter 4 also.',
      goal_driven: 'Updraft Use is gliding T2. Used heavily in PoF and SotO too. Two mastery points away.',
      achievement_focused: 'Updraft Use unlocks 3 adventures with gold-tier AP. Required for chapter 4.',
      balanced: 'Updraft Use is the next gliding tier. Required for chapter 4 of HoT; useful broadly.',
    });

Rule helper function `framingFor()` lives in the public engine since it's pure logic, not curated content.

**4. Voice principle integration.**

The "skip without guilt" voice principle stays in effect. New companion principle (see docs/voice.md update in this same session): "Recommend with conviction, permit deviation explicitly." Default recommendations should be clear and directive; alternative paths should be named and explicitly skippable. Playstyle preference modifies framing tone but does not soften the core recommendation.

## Voice considerations

Playstyle-aware prose still follows the field-guide voice principles:

- Third-person observational, never first-person.
- "This session" not "tonight".
- Concrete details over hedge words.
- Honest about skipping.

The new wrinkle: playstyle changes *what details matter*, not the underlying voice. A goal-driven player wants to hear about cross-expansion utility; a story-first player wants the narrative connection; a completion-first player wants the map coverage implication. All described in the same calm field-guide tone.

Avoid loaded labels in the UI. "Goal-driven" not "Min-maxer." "Completion-first" not "Completionist whore." "Achievement-focused" not "Achievement hunter" (slightly cleaner; same idea). "Balanced" not "Casual."

## Effort estimate

- Type and state additions: ~30 lines + a few tests, 1 hour.
- UI toggle component + integration on /home and /orientation: ~150 lines across new component + route updates, 2-3 hours.
- Rule rewrites in copper-owl-rules (engaged.ts, fresh-eighty.ts at minimum): ~50 lines per file plus tests, 2-3 hours per file.
- `framingFor()` helper in public engine: ~30 lines + tests, 1 hour.
- Total: roughly one focused day for the infrastructure + initial engaged.ts rewrite. Subsequent rule files add ~2-3 hours each.

## Priority

Medium-high. Higher than nice-to-have polish, lower than completing the real GW2 API integration end-to-end. Worth doing before serious external user testing since playstyle variance produces meaningfully different first impressions of the app's value.

## Open questions

- Should playstyle apply to Personal Story (core Tyria) recommendations? Probably yes — Personal Story has clear "watch every dialogue" (story-first) vs "rush the racial finale" (goal-driven) axes.
- Should the orientation route's 5 states (O1-O5) surface playstyle for fresh-80 players, given that the orientation flow is itself a "what to focus on first" decision? Probably yes, but defer until the basic toggle infrastructure proves out.
- Where exactly on /home does the toggle live? Suggestion: a small disclosure beneath the recommendation cards, above the footer. Not in the header (too prominent for a secondary setting).
- Should changing playstyle mid-session re-render immediately, or require a refresh? Immediate. Cost is one re-render; the UX win is real.

## References

- docs/voice.md (companion principle update lands in this same session)
- GW2 player typology research: Bartle's framework, BrainHex model
- WoW Classic vs Retail player choice data — high engagement correlates with clear directive recommendations rather than open-ended sandbox guidance
- Csikszentmihalyi flow research — challenge-skill matching depends on knowing what the player is actually optimizing for
