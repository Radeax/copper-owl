# PRD 0002: Mastery gate awareness in recommendations

**Status:** Proposed
**Date:** May 2026
**Author:** Solo (Radeax)

## User problem

GW2's expansions (especially Heart of Thorns) gate story chapter progression behind specific mastery unlocks. A player can be mid-chapter, encounter a terrain or interaction that requires a mastery they haven't unlocked, and have no in-game indication of which mastery is needed or how to acquire it. The wiki has this information, but a player mid-session shouldn't have to alt-tab to find it.

Copper Owl currently recommends "Continue HoT story" or "Continue Personal Story" without checking whether the next chapter has unfulfilled mastery prerequisites. Real example: a fresh HoT player will hit Updraft Use (Gliding tier 2) as a hard gate at "The Predator's Path" without warning. The five-gate sequence is documented at docs/research/0001-hot-mastery-gates.md.

The author's own first-time HoT playthrough surfaced this gap. The friction is real and player-confirmed.

## Scope

In scope:

- Surface mastery gates that block the next obvious action recommended by the engine (next story chapter, next zone progression)
- Apply to HoT story first (data already captured). PoF, EoD, SotO, JW data captured as those expansions are encountered in development
- Surface only the single most-blocking mastery if multiple gates exist — don't dump a list

Out of scope:

- Full mastery progression planning ("here's your optimal path through HoT masteries")
- Achievement collection gating (specialization weapons, hero point routes, etc.)
- Mount unlock paths (separate PRD when reached)
- Legendary crafting gates
- Strike Mission / raid prerequisite tracking

The scope line: Copper Owl handles session-level decision support (what should you do right now and what can you skip). Mastery gates qualify because they're "you'll hit a wall in 20 minutes if you keep going." Long-term progression planning belongs to other tools.

## Proposed solution

Three engine pieces:

1. **Account mastery state.** Extend transformGW2Account to fetch /v2/account/masteries and /v2/masteries. Transform into a MasteryState field on AccountState mapping canonical mastery names to current tier levels. Depends on PRD 0003 (real API integration) landing first.

2. **Mastery gate lookup table.** New file src/engine/mastery-gates.ts with a static map: story chapter ID → required masteries. Canonical GW2 data, not curated content — belongs in the engine. HoT data already captured at docs/research/0001-hot-mastery-gates.md.

3. **Rule consumption.** Engaged and fresh-80 rule modules consult mastery state when generating story-progress recommendations. Pattern: when the rule would recommend "Continue HoT story," it checks the player's current chapter, looks up which masteries gate the next chapter, compares against current mastery state, and qualifies the recommendation with the gap if there is one.

Example output transformation:

Without mastery awareness:

> "Continue Heart of Thorns — The Predator's Path"

With mastery awareness (story-focused framing, default):

> "Continue Heart of Thorns — The Predator's Path. The next chapter needs Updraft Use (Gliding tier 2). Currently at Glider Basics — 1 mastery point and ~1M XP from the Verdant Brink meta."

With mastery awareness (completion-focused framing per PRD 0001):

> "Continue Heart of Thorns — The Predator's Path. The next chapter needs Updraft Use (Gliding tier 2). Worth picking up Bouncing Mushrooms (Itzel Lore tier 1) in the same XP push — also an upcoming story gate. Total: 3 mastery points, ~1.5M XP."

Voice principle reminder: third-person observational. "The next chapter needs Updraft Use" not "You'll need Updraft Use."

## Dependencies

- PRD 0003 (real GW2 API integration) — must land first to make /v2/account/masteries fetch real data
- PRD 0001 (playstyle preference) — landed; this PRD's recommendations will consult playstyle for framing

## Effort estimate

- API transform for masteries: ~50 lines + tests, 2-3 hours
- Mastery gate lookup table for HoT: ~30 entries from research doc, 1-2 hours
- Rule integration (engaged.ts + fresh-eighty.ts in private repo): ~100 lines + tests, 2-3 hours
- Total: roughly one focused day for HoT-only; another half-day per additional expansion as data is captured

## Priority

Medium. Higher than nice-to-have polish, lower than PRD 0003 (real API integration — which this depends on). Worth doing before any meaningful external user testing, since fresh HoT players will hit mastery walls and Copper Owl's recommendations will look incomplete without this.

## Open questions

- Story chapter progress: which API endpoint surfaces this cleanly? /v2/account/achievements includes some, /v2/characters/{id}/quests may have more. Investigation needed during implementation.
- Should core Tyria Personal Story get the same treatment? Probably no — core story isn't mastery-gated; that's an expansion-specific design pattern.
- Should this surface "recommended but not gating" masteries (e.g., Bouncing Mushrooms for quality-of-life on the way to Updraft Use)? Out of scope per the line above — that's progression planning, not gate awareness.

## References

- docs/research/0001-hot-mastery-gates.md (canonical mastery gate data, cross-validated)
- docs/product/0001-playstyle-preference.md (framing modifier this PRD consults)
- docs/product/0003-real-api-key-integration.md (dependency — fetches mastery state from real account)
- ADR 0002 (engine purity — this feature stays in the engine, not the rules package, because the data is canonical GW2 data not curated content)
- GW2 API masteries endpoint: https://wiki.guildwars2.com/wiki/API:2/account/masteries
