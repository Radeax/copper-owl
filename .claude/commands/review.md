---
description: Routine code review. Auto-skips on docs-only PRs; defers to specialized reviewers when scope warrants.
---

Use the code-reviewer agent to review the current branch against main.

The agent will:
1. Run `git diff main...HEAD --name-only` to determine scope.
2. Auto-skip with "Docs-only PR — no code review applicable" if all changes are under `docs/` or `.github/`.
3. Defer to prd-reviewer if all changes are under `docs/product/` or `docs/research/`.
4. Defer to voice-reviewer if changes are prose-heavy.
5. Otherwise run the full review: typecheck, lint, test, architectural fit per ADRs, voice on shipping strings, test coverage.

Report findings in Blockers / Nice-to-fix / Nits / Out-of-scope format per `docs/pr-review.md`.
