---
description: Reviews PRDs and research docs for internal consistency, status accuracy against code reality, and cross-reference correctness.
---

Use the prd-reviewer agent to review the current branch's PRD and research document changes.

The agent will:
1. Verify all changed files are under `docs/product/` or `docs/research/`.
2. Check structural format (required header fields and sections in order).
3. Verify Status accuracy against code reality — every "DONE" / "NOT DONE" claim against a specific file gets read and checked.
4. Verify every PRD / ADR / research cross-reference points to a file that exists.
5. Flag voice violations in example output strings inside PRDs.
6. Check internal consistency (Status matches body claims, In scope doesn't contradict Out of scope, effort estimates sum approximately).

Report findings in Blockers / Nice-to-fix / Nits / Out-of-scope format.
