# Rules Design — Discussion Agenda

> A map of the design space for Copper Owl's recommendation rules. This is the agenda for a dedicated rules-design conversation, not a spec. The conversation it seeds should produce real PRDs and a "how to write a rule" guide.

## Why this doc exists

The engine, archetype classifier, reset clock, and API integration are infrastructure — they answer "what does the system know about the player and the moment." The **rules** answer "given all that, what should the player actually do this session." The rules are the product. Everything else is plumbing for them.

The rules live in the private `copper-owl-rules` repo (per ADR 0002) because they're the non-replaceable content investment. As of this doc, that repo holds only placeholder example rules. The real rules haven't been written yet.

This doc captures eight threads worth deciding before (or while) writing real rules, so the design conversation starts with an agenda instead of a blank page.

## When to have this conversation

- Not in a Claude Code session — that's for execution. Rules design is product + content strategy.
- In a dedicated `claude.ai` chat, Opus-backed (voice nuance + reasoning), with web search (canonical GW2 sourcing) and Notion (decision capture) available.
- After the CORS fix unblocks login, ideally in parallel with or just after Phase 2's UI pieces. Rules work doesn't depend on Phase 2 finishing — the private repo is separate.

## The eight threads

### 1. How rules work mechanically — partly decided

The plug-in architecture exists: `RuleFn` takes `(account, reset)` → `Recommendation[]`; the registry dispatches by archetype; the private package overrides public placeholders at module load.

**Undecided**: how a single archetype's rule function internally decides *which* recommendations to surface and in what priority. The example rules return one placeholder. A real `engaged_casual` rule needs internal logic — "given this account state, which of the many things I could recommend are the right 3 for this session?"

### 2. The selection + ranking algorithm — the meatiest undecided piece

A rule function needs to:
- Generate candidate recommendations from a pool of possible actions
- Filter by relevance to this account (owns the expansion, hasn't done the thing)
- Rank into primary / alternative / fallback priority
- Cap the output (3 cards, not 30)

**Design questions**:
- Hand-written conditionals per rule, or a shared scoring model (each candidate scores on relevance / timeliness / reward, top N win), or a mix?
- The PRD 0001 playstyle modifier and PRD 0002 mastery-gate awareness both plug in here — they change which candidates score high. The selection model should accommodate them cleanly rather than special-casing.
- Where does reset-awareness factor in? A reset-imminent window should bump time-sensitive candidates (dailies) up the ranking, but only within the 30-min window per voice principle 6.

This is worth designing deliberately rather than letting it emerge ad hoc, because every rule will use whatever pattern the first few rules establish.

### 3. Sources and sourcing discipline — pattern exists, system doesn't

Established: wiki-canonical, cross-validate contested data across multiple AIs, citations first-class (voice principle 8).

**Undecided — the system**:
- Where does a source link live? Inline in the rule (`sources: [{label, url}]` on the Recommendation), or a shared sources registry the rules reference by key?
- A shared registry deduplicates ("Event timers" link used by 20 rules) and makes mass-updates easier when a URL changes, at the cost of indirection.
- How do sources stay fresh when ArenaNet patches? (See thread 5.)

### 4. Factors — what signals a recommendation considers

Currently readable: archetype, expansions, character levels, days-since-login, reset state, pursuingGoal.

Potentially readable as the API integration expands: mastery state (PRD 0002), Living World ownership (PRD 0004), wallet, achievements, current story chapter, WvW rank, daily/weekly completion state.

**Decision per factor**: does it earn its place by changing recommendations *meaningfully*, or is it noise? A "what factors matter, in what order of importance" conversation beats bolting on signals as the API surfaces them. The discipline mirrors the fixture-anonymization discipline: a factor is worth reading only if a rule actually consumes it.

### 5. Revisions and the content lifecycle — anticipated, not designed

Rules aren't write-once. ArenaNet patches; metas change; expansions ship. A rule about "the current Wizard's Vault season" is wrong in three months.

The `patch-awareness` issue template already exists — evidence the concern was anticipated. **Undecided**:
- How do rules get reviewed for staleness? A periodic sweep? Triggered by patch notes?
- Does each rule carry a "last verified against patch X" marker?
- Which rules are patch-sensitive (meta timings, current-season rewards) vs. evergreen (Personal Story structure, expansion order)? The sensitive ones need a review cadence; the evergreen ones don't.

This is the maintenance discipline that keeps Copper Owl from rotting as the game evolves.

### 6. Reviews — voice gate exists, correctness gate doesn't

The `voice-reviewer` agent catches "this sounds wrong." **Undecided**: what catches "this recommendation is factually wrong about GW2"?

That's a different review — needs GW2 knowledge, not voice judgment. Options:
- Manual (you, with your game knowledge)
- A research-validation step (web search + cross-validation, like the HoT mastery research)
- A second agent (`rule-correctness-reviewer`?) that checks claims against canonical sources

The `rule` issue template suggests the concern was anticipated. Worth making the correctness-review step concrete and distinct from the voice-review step.

### 7. The rule-writing workflow — pieces exist, flow undocumented

The pieces are there (private repo, voice agent, `rule` + `patch-awareness` issue templates). The end-to-end flow isn't documented: how does a rule go from "I noticed Copper Owl should have told me X during play" to a merged, voiced, sourced, correctness-checked, tested rule?

**Output candidate**: a "how to write a rule" guide in `copper-owl-rules`, analogous to `docs/phase-2-context.md` — captures the discipline so future-self (or a contributor) can write a rule without re-deriving the process.

### 8. The first rules to write — concrete starting scope

Practical question independent of the strategy threads: which rules first?

**Forcing function**: the author's own HoT playthrough. The `fresh_80` and `engaged_casual` rules for HoT progression, mastery-gate-aware (per PRD 0002), are the ones usable immediately.

**Principle**: start narrow and deeply correct (one archetype, one expansion) over broad and shallow (all archetypes, placeholder-quality). The first real rule that produces a recommendation the author would actually act on is the alpha-useful milestone.

## What this conversation should produce

Likely outputs (to be decided in the conversation, not prescribed here):

- A PRD for the selection/ranking algorithm (thread 2) — possibly `docs/product/0005-recommendation-selection.md`
- A sourcing-system decision — possibly an ADR if it's structural, or a section in the rule-writing guide
- A "how to write a rule" guide in `copper-owl-rules` (thread 7)
- A factors-priority decision captured somewhere (thread 4)
- A content-lifecycle / patch-awareness workflow doc (thread 5)
- A concrete first-rules scope (thread 8) — probably a GitHub issue or two

Not all in one session. The first session should prioritize: which threads block writing the *first* rule, vs. which can be decided later as the rule set grows. Threads 2 (selection), 7 (workflow), and 8 (first scope) are probably the blocking set. Threads 3-6 can mature as rules accumulate.

## Relationship to existing PRDs

- **PRD 0001 (playstyle)**: a modifier on the selection algorithm (thread 2). The selection model must accommodate it.
- **PRD 0002 (mastery gates)**: a factor (thread 4) and a recommendation type. Mastery-gate-aware HoT rules are part of the first-rules scope (thread 8).
- **PRD 0003 (API integration)**: provides the factors (thread 4) the rules read. Must be working before rules can consume real account state.
- **PRD 0004 (Living World)**: a deferred factor (thread 4). Rules don't consume it until that PRD's triggers fire.

## References

- ADR 0002 (public engine, private rules) — why rules are a separate private repo
- docs/voice.md — the 9 voice principles all rule prose follows
- docs/product/0001-playstyle-preference.md — selection modifier
- docs/product/0002-mastery-gates.md — factor + recommendation type
- docs/product/0004-living-world-ownership.md — deferred factor (Living World ownership)
- src/engine/rules/ — the plug-in mechanism (types, registry, example placeholders)
- src/engine/rules/README.md — the public-facing rule API doc
- .github/ISSUE_TEMPLATE/rule.md — the rule issue template
- .github/ISSUE_TEMPLATE/patch-awareness.md — the patch-awareness template
