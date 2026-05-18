# Copper Owl

Free, non-commercial fan companion for Guild Wars 2. Information layer over the public GW2 API. Calm field-guide voice — third-person observational, mentor tone, no FOMO.

## Stack

- React 19 + React Compiler · TypeScript 5.7 strict · Vite 6 · pnpm 9
- TanStack Router (file-based) + TanStack Query
- xstate 5 + Zustand 5 (persisted via middleware)
- Base UI primitives + CSS Modules + design tokens (`src/styles/tokens.css`)
- Tauri 2 for desktop/mobile native packaging
- Vitest + happy-dom

## Build commands

- `pnpm dev` — Vite dev server on port 1420
- `pnpm test:run` — single-run tests
- `pnpm typecheck`
- `pnpm lint` — strict, `--max-warnings=0`
- `pnpm build` — production web build
- `pnpm tauri:dev` — desktop dev (requires Rust + platform deps)

## Architecture

The recommendation engine in `src/engine/` is a pure function:
`recommend({ account, reset })` → `{ archetype, recommendations[] }`. No I/O, no React, no side effects.

Pipeline: `classifyArchetype(account)` → look up rule via `getRule(archetype)` → return recommendations.

Full details in `docs/architecture.md`. Voice principles in `docs/voice.md` — applied to every line of recommendation prose.

## The rule plug-in pattern

`src/engine/rules/` contains the plug-in API (`types.ts`, `registry.ts`, `example.ts`), not the curated rule content. By default, the engine surfaces example placeholder recommendations.

The production rule set lives in a separate package, `@copper-owl/rules`, maintained privately. At startup, `src/main.tsx` attempts to dynamically import it; if present, its rules override the example placeholders. If absent (e.g. you cloned only this repo), the example rules remain in effect and the app still runs.

This separation is intentional — the engine architecture is open source, the curated content is the maintained product. Same pattern as VS Code + extensions, OBS + plugins.

If you want to fork this engine and ship your own GW2 tool with your own rules, see `src/engine/rules/README.md`.

## Conventions

- TypeScript: strict mode, no `any`. Use `unknown` with type guards when type inference can't help.
- Imports: use the `@/` path alias for src-relative imports.
- CSS: use tokens from `tokens.css`, not hardcoded colors. The WCAG AA audit was deliberate; don't undo it.
- Tests: engine tests are mandatory. Routes/components don't need integration tests unless they have non-trivial logic.
- Voice: third-person observational. Never "I" or "you should." "This session" not "tonight." Concrete numbers over hedge words. Honest about skipping.

## What this app is NOT

- Not a build/gear/rotation guide (Snow Crows, MetaBattle, Hardstuck do this well)
- Not a trading post tool (gw2efficiency)
- Not a combat overlay (ArcDPS)
- Not affiliated with or endorsed by ArenaNet/NCSoft

## License

MIT for the engine. The private rule package is licensed separately under all-rights-reserved terms.