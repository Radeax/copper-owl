# ADR 0002: Public engine, private rules package

**Status:** Accepted
**Date:** May 2026
**Decision-makers:** Solo (Radeax)

## Context

Copper Owl has two distinct value layers:

- **The engine** — recommendation pipeline, archetype classifier, reset clock, API client, rate-limit queue, design system, UI primitives, painted SVG library. Mechanical infrastructure; replaceable in a weekend if needed.
- **The rules** — curated GW2 recommendations, voice-tuned prose, source-cited content. Hand-written using the documented voice principles. Represents the actual product investment; effectively non-replaceable without redoing months of GW2 research and voice work.

Three structural options considered:

- Everything MIT in one repo: maximum openness, but ships the content investment for free to anyone forking. Once pushed publicly, git history preserves rules forever — no recovery if the open-source decision is later reconsidered.
- Everything closed-source: protects content but loses portfolio signal and prevents community forking the engine to build different GW2 tools.
- Engine open, rules private: separates the layers explicitly. Engine becomes a recommendation framework; rules become a specific instance of curation built on it.

## Decision

Split into two repositories with different licensing:

- **`copper-owl/`** — public on GitHub, MIT-licensed. Engine, types, API client, UI components, design system, plug-in rule registry, example placeholder rules. Anyone can fork and build their own GW2 tool against it.
- **`copper-owl-rules/`** — private on GitHub, All Rights Reserved. Curated recommendation rules, voice-tuned prose, source citations. Published as `@copper-owl/rules` (private package).

Connected via pnpm workspace locally and via GitHub Packages registry for production builds. The public engine attempts a dynamic import of `@copper-owl/rules` at startup; if present, registers real rules; if absent (public clone), falls back to example placeholders so the engine still runs.

## Consequences

**Accepted trade-offs:**

- Two repos to maintain, two CI pipelines to keep coherent.
- Local dev requires both repos checked out side-by-side at a workspace parent directory.
- Public clones see placeholder recommendations, not real content — could be slightly disorienting for first-time engine forkers.
- Production builds (Cloudflare Pages, Tauri release) need authenticated access to the private package via GitHub Packages registry.

**Benefits gained:**

- Content moat protected. The engine is open; the curation that makes it actually useful is not redistributable.
- Quality control preserved on the rules. PRs against the rules repo require maintainer access; voice drift can't be introduced by drive-by PRs.
- Optionality kept open for future commercial offerings (premium tier, supporter access, hosted variant) without re-licensing the engine.
- Same pattern as VS Code + extensions, OBS + plugins, Snow Crows + raid methodology — well-precedented "platform + content" split.

**Critical operational note:**

The split was performed *before* the first public push to GitHub. If the rules had been MIT-published even briefly, the content would have been forever in git history. The decision to split early was driven by exactly this concern.

## References

- pnpm workspaces documentation: https://pnpm.io/workspaces
- GitHub Packages for private npm: https://docs.github.com/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
- Decision discussion: Claude.ai chat thread, May 2026
