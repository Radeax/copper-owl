# ADR 0006: Public repo is standalone-installable; rules are a runtime concern

**Status:** Accepted
**Date:** May 2026
**Decision-makers:** Solo (Radeax)

## Context

The public `copper-owl` repo previously declared `@copper-owl/rules` as a `workspace:*` dependency in `optionalDependencies`. This made the public repo uninstallable in any context without the parent pnpm workspace at `~/copperowl/`, including:

- GitHub Actions CI (clones only the public repo)
- External contributors cloning the repo
- Any standalone use outside the author's machine

`workspace:*` is a hard pnpm protocol error when no workspace is present, and `optionalDependencies` does not rescue unresolvable specifiers (it only swallows registry-fetch / build failures).

Three options were considered:

- **Option A**: Drop `@copper-owl/rules` from `package.json` entirely. Rely on the runtime dynamic import in `main.tsx` which already handles presence/absence gracefully. Local workspace linking handled by a shell script.
- **Option B**: Use `file:../copper-owl-rules` in `optionalDependencies`. Local sibling resolution works; CI behavior with file-not-found is fragile and pnpm-version-dependent.
- **Option C**: Publish `@copper-owl/rules` to GitHub Packages as a private versioned package. Public repo depends on a real registry version; CI authenticates via `NPM_TOKEN` secret.

## Decision

Adopt **Option A**.

- `package.json` does not declare `@copper-owl/rules` as a dependency in any form.
- The runtime dynamic import in `src/main.tsx` (`loadPrivateRules()`) handles both presence and absence:
  - Present (local dev with sibling repo symlinked): real rules registered.
  - Absent (CI, external clone): example placeholder rules used, engine still runs.
- Local development uses `scripts/link-rules-dev.sh` to symlink the sibling rules repo into `node_modules/@copper-owl/rules`. The script is idempotent and gracefully exits when the sibling isn't present.
- The `postinstall` script in `package.json` runs `link-rules-dev.sh` automatically on every `pnpm install`. The `|| true` suffix ensures install never fails because of the linking step (e.g., on systems without bash, or in CI).
- The standalone `pnpm-lock.yaml` was generated via `pnpm install --ignore-workspace`. CI uses `pnpm install --frozen-lockfile --ignore-workspace` to match the lockfile's standalone context.

## Consequences

**Accepted trade-offs:**

- Local development setup involves a symlink. Mitigated by the postinstall hook running it automatically; the developer experience is "just run pnpm install."
- The `package.json` no longer documents the integration with `@copper-owl/rules`. Future-self reading the repo cold won't immediately see "this consumes the rules package when available." Mitigated by this ADR and by `CLAUDE.md` documenting the architecture.
- No version pinning between public engine and private rules. If rules export shape changes, the public engine could fail at runtime in dev. Mitigated by TypeScript types co-located in the public repo (ambient `declare module '@copper-owl/rules'` in `src/vite-env.d.ts`) and by both repos being authored by the same developer for now.

**Benefits gained:**

- CI works with zero additional infrastructure.
- External clones build out-of-the-box with placeholder rules.
- No publishing workflow to maintain while the project is solo-dev pre-shipping.
- The migration path to Option C is preserved and simple when the time comes.

## Option C deferred, not abandoned

Option C (GitHub Packages publishing of `@copper-owl/rules`) is the right long-term architecture once any of the following are true:

- Collaborators are added to either repo.
- Public release of Copper Owl with a stable rule cadence.
- Rules updates need to flow into deployed Cloudflare Pages builds without local-machine intervention.
- A formal versioning discipline emerges for rule content.

At that point, the migration steps are:

1. Add publishing workflow to `copper-owl-rules` repo.
2. Configure GitHub Packages registry in public repo's `.npmrc`.
3. Restore `@copper-owl/rules` as a versioned dependency in public repo's `package.json`.
4. Add `NPM_TOKEN` secret and update CI to authenticate.
5. Remove `link-rules-dev.sh` and the postinstall hook (or repurpose for pnpm override-based local linking).
6. Write ADR 0007 documenting the migration.

The current Option A architecture does not paint into a corner. Option C migration is a clean transition when triggered, not a rescue from a broken state.

## References

- `src/main.tsx` (`loadPrivateRules()` — runtime fallback)
- `src/vite-env.d.ts` (ambient module declaration)
- `scripts/link-rules-dev.sh` (local linking)
- `.github/workflows/ci.yml` (CI install command)
- ADR 0002 (public engine, private rules package — the underlying architecture this decision implements)
