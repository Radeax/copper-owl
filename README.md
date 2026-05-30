# Copper Owl

> Tells GW2 players what to do next, why it matters, and what they can skip.

A decision-support companion for Guild Wars 2. An information layer over the public GW2 API — no FOMO, no first-person narration, no guilt for skipping things. Field-guide voice, mentor tone.

Built as a free, non-commercial fan tool. Not affiliated with or endorsed by ArenaNet or NCSoft.

## What it does

- **Orients fresh-80 players** — what's worth doing first, what each expansion unlocks, what can wait
- **Catches returning players up** — what changed in the time they were gone, scaled to their gap
- **Paces engaged players** — reset-aware "what fits this session" suggestions
- **F2P-honest** — what works without buying expansions and what each expansion actually delivers

Copper Owl never tells the player they "should" do anything. The voice is third-person observational, like a field guide left on a table.

## Stack

| Layer | Choice |
|---|---|
| UI | React 19 + TypeScript 5.7 + Vite 6 |
| Routing | TanStack Router (file-based) |
| Server state | TanStack Query |
| UI state | Zustand 5 |
| State machines | xstate 5 |
| Primitives | Base UI |
| Styling | CSS Modules + design tokens |
| Tests | Vitest + happy-dom |
| Native packaging | Tauri 2 (Windows / macOS / Linux / iOS / Android) |
| Web hosting | Cloudflare Pages |
| License | MIT |

The React Compiler is enabled (`babel-plugin-react-compiler`) — no manual `useMemo` / `useCallback` for memoization.

## Prerequisites

- **Node.js** 20+
- **pnpm** 9+ (`npm i -g pnpm`)
- **Rust** stable (only needed to build the Tauri native apps — install via [rustup](https://rustup.rs))
- **Platform deps for Tauri**: see [tauri.app/start/prerequisites](https://v2.tauri.app/start/prerequisites/)

The web app runs without Rust installed. Rust is only needed for desktop / mobile native builds.

## Run

```bash
# Install dependencies
pnpm install

# Web dev server (http://localhost:1420)
pnpm dev

# Production web build (outputs to dist/)
pnpm build
pnpm preview

# Native desktop app (Rust required)
pnpm tauri:dev
pnpm tauri:build

# Native mobile (Rust + platform SDKs required)
pnpm tauri:android:init   # first time only
pnpm tauri:android:dev
pnpm tauri:ios:init       # first time only
pnpm tauri:ios:dev

# Tests
pnpm test                 # watch mode
pnpm test:run             # single run
pnpm test:coverage        # with coverage report

# Lint + typecheck + format
pnpm lint
pnpm typecheck
pnpm format
```

## Repository layout

```
copper-owl/
├── src/
│   ├── routes/             TanStack Router file-based routes
│   ├── components/         Shared UI components
│   ├── illustrations/      Painted SVGs (banners, mode illustrations)
│   ├── engine/             Pure recommendation engine
│   │   ├── recommend.ts        Main entry — classify + dispatch
│   │   ├── archetypes.ts       Player archetype classifier
│   │   ├── reset.ts            Daily/weekly reset clock
│   │   └── rules/              Rule plug-in API (NOT the curated rules)
│   │       ├── types.ts            RuleFn / RuleSet contracts
│   │       ├── registry.ts         Plug-in mechanism
│   │       └── example.ts          Public fallback placeholder rules
│   ├── api/                GW2 API client + rate-limit queue
│   ├── state/              Zustand stores
│   ├── styles/             Design tokens (tokens.css)
│   └── types/              Shared TS types
└── src-tauri/              Rust native shell (only built when needed)
```

The recommendation engine is a **pure function**: `recommend({ account, reset })` → `{ archetype, recommendations[] }`. It has no I/O, no React, no side effects. This means it's trivially testable and runs identically in web, desktop, and mobile builds.

### Where the actual rules live

This repo contains the rule **plug-in API**, not the curated rule **content**. Out of the box, the engine surfaces placeholder example recommendations (good enough to verify the pipeline works locally; not real GW2 advice).

The production rule set — months of GW2 research, voice-tuned prose, source-cited recommendations — lives in a separate package, `@copper-owl/rules`, maintained privately. The public engine attempts to import it at startup; if present, it overrides the example placeholders. If not, the example rules remain in effect and the app still runs.

This separation lets the engine architecture be open source (MIT) while the curated content stays as a maintained product. The pattern is the same one VS Code, OBS Studio, and many other "platform + content" projects use.

If you want to fork the engine and ship your own rule set, see `src/engine/rules/README.md` for the API.

## GW2 API usage

Copper Owl calls the public Guild Wars 2 API directly from the client. No backend, no proxy.

- Rate limit: 300 burst / 5 requests per second per IP, enforced by `src/api/queue.ts`
- API key: read-only, stored locally (localStorage on web; Tauri secure storage on native, planned)
- OAuth: gw2.me PKCE flow (planned)
- CORS: GW2 API allows any origin

The app works without an API key — anonymous mode lets the user pick a profile manually.

## Voice principles

Copper Owl's recommendations follow a small set of voice rules documented in `docs/voice.md`:

- Third-person observational, never "I" or "you should"
- "This session" not "tonight"
- Concrete details ("4 chapters remain") over vague ("a few left")
- Honest about skipping ("worth knowing if you'd rather not")
- Reset-awareness shapes urgency wording
- No first-person narration anywhere

## Contributing

This is a personal project for now, but issues and PRs are welcome.

- Bugs → file an issue with reproduction steps
- Voice / content suggestions → file an issue tagged `voice`
- Architecture changes → discuss in an issue first

## License

[MIT](./LICENSE)

## Acknowledgements

- ArenaNet for the GW2 API and decades of supporting community tools
- [gw2.me](https://gw2.me/) for community OAuth
- The community tools that came before — Snow Crows, Hardstuck, MetaBattle, GuildJen, gw2efficiency, gw2timer, ArcDPS — all of which set the bar
