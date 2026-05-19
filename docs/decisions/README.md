# Architecture Decision Records

Lightweight records of significant architectural and product decisions. Each ADR captures: the context (why the decision came up), the decision itself, and the consequences accepted.

Format follows the [Michael Nygard ADR template](https://github.com/joelparkerhenderson/architecture-decision-record/blob/main/locations/nygard/nygard-architecture-decision-record.md): Status, Date, Context, Decision, Consequences, References.

## Index

| # | Title | Status |
|---|---|---|
| [0001](./0001-tauri-over-react-native.md) | Tauri 2 over React Native for native packaging | Accepted |
| [0002](./0002-public-engine-private-rules.md) | Public engine, private rules package | Accepted |
| [0003](./0003-name-history.md) | Project name — Copper Owl | Accepted |
| [0004](./0004-claude-model-defaults.md) | Claude model defaults per repository | Accepted |
| [0005](./0005-cloudflare-pages-hosting.md) | Cloudflare Pages for web hosting | Accepted |

## When to write a new ADR

When the decision affects how someone else (or future-you) would understand the codebase, and the reasoning isn't visible from the code alone. Examples that qualify: stack changes, repo structure changes, naming policies, deployment targets, third-party service choices.

Examples that don't qualify: small refactors, day-to-day code-style choices, anything Prettier or ESLint enforces, anything documented in `docs/architecture.md` or `docs/voice.md` already.

Numbering is sequential. Once an ADR is accepted, the file is immutable except to update its Status — if the decision is later reversed, write a new ADR that supersedes it (and update Status on the original to "Superseded by ADR XXXX").
