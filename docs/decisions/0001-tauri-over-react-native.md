# ADR 0001: Tauri 2 over React Native for native packaging

**Status:** Accepted
**Date:** May 2026
**Decision-makers:** Solo (Radeax)

## Context

Copper Owl needs to ship to web (primary), desktop (Windows/macOS/Linux), and eventually iOS and Android. Three viable approaches considered:

- **Path A — Universal stack from day 1 (Tamagui or Gluestack-UI).** One React codebase compiles to both web (CSS) and React Native (native views) via an optimizing compiler. Requires committing to Tamagui's theme system, abandoning Base UI, and adopting CSS-in-JS over CSS Modules.
- **Path B — Monorepo with separate UI layers per platform.** Shared business logic in `packages/core`; web app uses Base UI + CSS Modules; future RN app rewrites the UI in React Native primitives. Two UI codebases, one logic codebase.
- **Path C — Tauri 2 wraps a single React app for all platforms.** Tauri 2.0 (stable Oct 2024) supports iOS + Android in addition to desktop. Same React code runs in browser, desktop WebView, and mobile WebView via Tauri's native shell.

## Decision

Adopt **Path C (Tauri 2)** for native packaging.

The React app at `src/` is the single source of truth. `pnpm dev` runs the web version. `pnpm tauri:dev` runs the desktop native version. `pnpm tauri:android:dev` and `pnpm tauri:ios:dev` run the mobile native versions. No UI duplication; the painted SVG library, CSS Modules, design tokens, Base UI primitives, and xstate machines work identically across all targets.

## Consequences

**Accepted trade-offs:**

- Mobile "feel" is WebView-based (iOS WKWebView, Android WebView), not true native — scroll momentum, keyboard handling, and gesture nuances are web-ish. Acceptable because Copper Owl is an information-layer app (cards, lists, painted SVGs, state-aware recommendations) rather than animation-heavy or gesture-driven.
- Rust required for any custom native APIs beyond Tauri's plugin ecosystem. For Copper Owl's planned native needs (notifications for reset windows, secure storage for API keys, file system for cached account data), Tauri's existing plugins cover everything.
- Apple App Store occasionally scrutinises wrapped web apps more carefully than pure native apps; Tauri's track record is improving but is shorter than React Native's 10+ years.
- Tauri mobile is younger than Tauri desktop. Desktop has been stable for years; mobile stabilised in 2024.

**Benefits gained:**

- One UI codebase across web, desktop, and mobile — no rewrites at any platform boundary.
- Bundle size: 600KB–10MB (vs Electron's 80–150MB; vs RN's typical 30-50MB).
- Idle memory: 30–40MB (vs Electron's 200–300MB).
- The painted SVG illustrations, CSS Modules, design tokens, and Base UI primitives all carry forward without per-platform adaptation.
- xstate machines run identically across all targets — pure logic with no platform-specific code.

## References

- Tauri 2 stable announcement: https://v2.tauri.app/blog/tauri-20/
- Tauri vs Electron benchmark studies: https://v2.tauri.app/concept/process-model/
- Decision discussion: Claude.ai chat thread, May 2026
