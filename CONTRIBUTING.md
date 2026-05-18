# Contributing to Copper Owl

Thanks for the interest. A few notes before opening an issue or PR.

## Scope

Copper Owl is intentionally focused. It's not trying to be a competitor to gw2efficiency or Snow Crows — it's a decision-support layer that says "here's what fits this session." If a proposed feature doesn't fit that, please discuss in an issue first before opening a PR.

In scope:
- Recommendation engine rules (per archetype, per reset window)
- Voice / content improvements
- Painted SVG illustrations
- Reset-aware UI patterns
- Native packaging improvements (Tauri configs, signing, etc)

Out of scope for now:
- Build/gear/rotation guides (Snow Crows, MetaBattle, Hardstuck do this well)
- Trading post tooling (gw2efficiency, gw2bltc)
- Real-time combat overlays (ArcDPS)
- Friend/guild social features (deferred to v2+)

## Voice

The recommendation engine's prose follows specific principles:

- **Third-person observational** — never "I" or "you should." "Picking up Chapter 5 unlocks..." not "I'd recommend Chapter 5."
- **"This session" not "tonight"** — players use Copper Owl at all hours.
- **Concrete details** — "4 chapters remain" beats "a few left."
- **Honest about skipping** — every recommendation should make it clear that skipping is fine.
- **No FOMO** — never imply the player has missed something irrecoverable.

If a PR adds or changes recommendation text, the voice check is the most important review step.

## Development

Setup is documented in [README.md](./README.md). Quick version:

```bash
pnpm install
pnpm dev           # web dev server
pnpm test          # watch mode
pnpm typecheck
pnpm lint
```

Before opening a PR:

1. `pnpm typecheck` passes
2. `pnpm lint` passes (no warnings — config is `--max-warnings=0`)
3. `pnpm test:run` passes
4. New rules in `src/engine/rules/` have at least one test case
5. CSS uses tokens from `tokens.css` rather than hardcoded values

## Architecture decisions

Significant decisions live in [docs/architecture.md](./docs/architecture.md). Read that first if a PR proposes structural changes — most of those decisions have reasons that aren't obvious from the code alone.

## Issues

Useful issue templates:

- **Bug** — what you did, what you expected, what happened, browser/OS
- **Voice** — quote the current text + suggested rewrite + reasoning
- **Rule** — describe the scenario the engine doesn't handle well + what it should suggest
- **Feature** — describe the player problem first, then the proposed solution

## License

By contributing, you agree your contributions are licensed under the MIT License (see [LICENSE](./LICENSE)).
