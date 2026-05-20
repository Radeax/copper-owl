# ADR 0004: Claude model defaults per repository

**Status:** Accepted
**Date:** May 2026
**Decision-makers:** Solo (Radeax)

## Context

Copper Owl uses Claude across two workflows:

- **Claude Code in the public `copper-owl/` repo.** Mostly mechanical work — porting prototypes, writing components, fixing build issues, implementing API integration, writing tests. Routine coding tasks where Sonnet 4.6 performs at near-Opus quality.
- **Claude Code in the private `copper-owl-rules/` repo.** Almost exclusively voice work — writing recommendation prose, voice-checking against the librarian-out-loud test, refining tone. Opus 4.7 demonstrably catches subtle voice drift that Sonnet 4.6 misses.

Pricing (per million tokens, Nov 2025 rates):

- Sonnet 4.6: $3 input / $15 output
- Opus 4.7: $5 input / $25 output

Running everything on Opus would 5x the input cost and 1.67x the output cost. Running everything on Sonnet would save cost but accept noticeable quality regression on voice work.

## Decision

Set per-repository defaults via `.claude/settings.json`:

- **`copper-owl/.claude/settings.json`** → `"model": "sonnet"`
- **`copper-owl-rules/.claude/settings.json`** → `"model": "opus"`

Override per-session with `/model opus` or `/model sonnet` when the work type doesn't match the default.

## Consequences

**When the defaults apply correctly:**

- Public repo: ~90% of work runs on Sonnet at the lower price point. Routine code generation, refactoring, test writing, bug fixing.
- Private repo: every session defaults to the model best-suited for voice work.

**When to override:**

- Public repo → Opus: architecture decisions, complex multi-state debugging, design pivots, voice-heavy UI copy work (rare in public repo; mostly in route prose and form labels).
- Private repo → Sonnet: mechanical work like renaming files, updating import paths after engine changes, running tests, fixing TypeScript errors.

The override is a single command (`/model sonnet`) and costs nothing to switch. The defaults are guardrails, not constraints.

## References

- Anthropic pricing page: https://www.anthropic.com/pricing
- Claude Code model documentation: https://docs.anthropic.com/en/docs/claude-code
- Decision discussion: Claude.ai chat thread, May 2026
