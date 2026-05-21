---
description: Comprehensive PR review against the project rubric
---

Review the current branch's diff against main using the rubric in `docs/pr-review.md`.

## Setup

First, gather the diff:

    git fetch origin main
    git diff origin/main...HEAD --stat
    git diff origin/main...HEAD

Then read `docs/pr-review.md` in full. The rubric there is authoritative — apply every category that's relevant to the diff. Skip categories that don't apply (e.g., skip "Engine purity" if no `src/engine/` files changed).

## Review pass

Walk the diff file by file. For each file:

1. Read the full file (not just the diff) to understand context. The diff alone hides surrounding code that affects correctness.
2. Apply every relevant rubric category from `docs/pr-review.md`.
3. For voice-heavy files (routes, components with prose, rule files in `copper-owl-rules`), do an explicit librarian-voice pass: read every user-facing string out loud in the voice of a 50-year-old librarian and flag anything that catches.
4. Track findings in the format specified by the rubric.

## Specific things to double-check

These are recurring areas where issues have landed in previous reviews:

- **Dispatcher loading flash.** `src/routes/index.tsx` and any other dispatcher — confirm the initial render doesn't flash a transient route before redirecting.
- **`?state=` and similar dev overrides.** If the diff adds query-param-driven UI overrides, confirm they're gated by `import.meta.env.DEV` or equivalent. Production users hitting dev overrides see misleading UI.
- **ChoiceCard / ModeCard tradeoff prose.** These primitives historically attract second-person voice ("You get: X" / "For you: Y"). Re-read each instance.
- **Form labels.** Self-classification forms tend to slip into "Which expansions do you own?" — rewrite to "Which expansions are unlocked?" or similar.
- **API keys in error messages.** Search the diff for any `${apiKey}` or similar interpolation in user-facing error strings.
- **Hardcoded hex colors in route or component CSS.** Run a grep for `#[0-9a-fA-F]` against `src/routes/` and `src/components/` and confirm any hits are intentional (and ideally rare).
- **Inline primitives that should be lifted.** If a primitive (SourceBand, Chips, AltCard, etc.) appears in two routes' code, the second use is the lift moment.

## Output

Post the review as a single block in the chat. Format:

    ## Review of [branch name] → main

    [N files changed, +X −Y lines]

    ### Blockers
    - `path/file.tsx:NN` — description
      **Fix:** one sentence

    ### Nice-to-fix
    - `path/file.tsx:NN` — description

    ### Nits
    - `path/file.tsx:NN` — description

    ### Looks good
    - Brief acknowledgment of what worked. Honest signal, not flattery.

If a section has no findings, omit it. A clean PR review can be three lines.

After posting, ask me whether to:

1. Apply any of the blockers/nice-to-fix items directly as commits on this branch
2. File follow-up issues for nice-to-fix items I want to defer
3. Move on without changes (e.g., I disagree with a finding)

Do not apply fixes without explicit confirmation.

## What to skip

Per the rubric's "What to skip" section:

- Bikeshedding on naming where the existing name is clear
- "I would have structured this differently" without concrete benefit
- Auto-generated files (`src/routeTree.gen.ts`, lockfiles, build outputs)
- Style preferences not enforced by Prettier or ESLint

If a finding doesn't change the merge decision or the next PR's quality, leave it out.
