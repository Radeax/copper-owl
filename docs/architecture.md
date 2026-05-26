# Copper Owl Architecture

> The why behind the stack and the shape of the code.

## Core principles

1. **Pure engine, framework-free.** The recommendation engine (`src/engine/`) is plain TypeScript with no React, no I/O, no side effects. `recommend({account, reset})` → `{archetype, recommendations[]}`. Trivially testable, runs identically across all build targets.
2. **Reset-awareness is first-class.** GW2's daily reset (16:00 UTC) and weekly reset (Monday 16:00 UTC) shape recommendations directly. The engine takes the current `ResetState` as input alongside account state.
3. **One unified Session.** The three access modes (anonymous / API key / gw2.me OAuth) all produce the same `Session` shape. The UI and engine never branch on mode.
4. **No backend.** The web app calls the public GW2 API directly. If a backend is ever needed, Cloudflare Workers is the natural fit (we're already on Cloudflare Pages).
5. **Web-first, Tauri for native.** Same React codebase ships to browser, desktop, iOS, and Android via Tauri 2. No UI duplication.

## Stack decisions

### React 19 + React Compiler

The React Compiler (`babel-plugin-react-compiler`) automatically memoizes components and eliminates most manual `useMemo` / `useCallback`. Configured in `vite.config.ts`. The ESLint plugin `eslint-plugin-react-compiler` flags patterns that would prevent the compiler from optimizing.

### TanStack Router (file-based)

Routes live in `src/routes/`. The build plugin generates `src/routeTree.gen.ts` (gitignored — regenerated on every build / dev start). Type-safe navigation, automatic code splitting, scroll restoration built in. Auto-loaded devtools in development.

### TanStack Query

Tuned for GW2's rate-limited API in `src/main.tsx`:

- `staleTime: 5 minutes` — most account data doesn't change that fast
- `gcTime: 30 minutes` — keep cache around across navigations
- No retry on 4xx errors — auth issues shouldn't retry
- No refetch on window focus — avoids burning rate-limit budget

### Zustand for UI state

One store currently, doing the work the original three-store plan split out:

- `src/state/auth.ts` — Session + AnonymousProfile, persisted to localStorage at key `copper-owl-auth`

The store consolidates auth state and anonymous-profile self-classification because they're updated atomically (entering anonymous mode establishes both a session and a profile in one transition). If a third concern emerges that doesn't share that lifetime — durable user preferences across sign-outs, or a cached account snapshot independent of session — a second store will be added then. Not before.

### xstate for state machines

xstate handles flows where the next state depends on multiple inputs and transitions are non-trivial. Planned machines:

- Auth machine — anonymous → api-key-entered → validated → ready
- Recommendation machine — orchestrates archetype + reset + account fetch
- Reset clock machine — broadcasts reset events to subscribers

Pure logic — works identically on web and native.

### Base UI for primitives

Headless accessibility primitives from `@base-ui-components/react`. Web-only, but Tauri renders web in WebView so this works on native too. CSS Modules style the primitives.

### CSS Modules + tokens.css

Design tokens live in `src/styles/tokens.css`. Every component imports a `.module.css` file that uses `var(--token)` references. The WCAG AA audit passes on every body-text combination.

## Build targets

| Target | Command | Output |
|---|---|---|
| Web (dev) | `pnpm dev` | http://localhost:1420 |
| Web (prod) | `pnpm build` | `dist/` → Cloudflare Pages |
| Desktop (dev) | `pnpm tauri:dev` | Native window, hot-reloaded |
| Desktop (prod) | `pnpm tauri:build` | Platform binaries in `src-tauri/target/` |
| Android | `pnpm tauri:android:dev` / `build` | APK/AAB |
| iOS | `pnpm tauri:ios:dev` / `build` | IPA |

All targets use the same `src/` React code.

## Rate-limit queue

The GW2 API rate limits at 300 burst / 5 per second per IP. Naively firing requests will hit 429 errors fast.

`src/api/queue.ts` implements a token-bucket queue:

- 300 tokens at full
- Refills 5 tokens per second up to 300
- `acquire()` returns a promise that resolves when a token is available
- `drain()` rejects all pending acquires (used during auth changes)

`src/api/client.ts` wraps `fetch()` and goes through the queue automatically. Every GW2 API call uses `gw2Fetch()`.

## Voice as a first-class concern

The recommendation engine produces `Recommendation` objects with:

- `title` — short headline action ("Continue the Personal Story")
- `zone` — context label ("Core Tyria · 8 chapters")
- `detail` — the reasoning, in third-person observational voice
- `flavor` — optional italicized field-guide line
- `tags` — short context chips
- `bannerKey` — references the painted-SVG library
- `sources` — optional citation links

Voice principles enforce themselves through the rule modules: every recommendation is hand-written prose, no template strings interpolating account data into vague language. The cost is that adding rules takes thought; the benefit is that the voice stays consistent. See `docs/voice.md` for the full nine principles, including principle 9 (recommend with conviction, permit deviation explicitly) which governs how the default recommendation should be framed relative to alternatives.

## What's deferred

- xstate machines (declared in the stack but not yet implemented; auth, recommendation orchestration, reset clock are the candidates)
- gw2.me OAuth PKCE flow (third access mode; the unified Session shape supports it but the flow is stubbed)
- Real API integration error UX polish (429 rate-limit handling and network-failure recoverable retry on /home; see PRD 0003)
- Mastery gate awareness in recommendations (see PRD 0002, depends on PRD 0003 closing)
- Playstyle preference UI and rule consumption (see PRD 0001)
- Push notifications for reset (Tauri native plugin work)
- WvW ticket pacer (third product module, not v1)
- Friends features (v2+)

See `docs/product/` for active feature specs.
