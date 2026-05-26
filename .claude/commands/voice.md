---
description: Reviews prose-heavy changes for voice compliance against docs/voice.md. Opus-backed.
---

Use the voice-reviewer agent to review the current branch's prose changes.

The agent will:
1. Read `docs/voice.md` completely (all 9 principles, drift patterns table).
2. Run `git diff main...HEAD` to see prose changes in context.
3. Apply each principle to every changed user-facing string:
   - Rule recommendation strings (highest stakes — `copper-owl-rules`)
   - Route copy (form labels, error messages, loading states)
   - PRD example strings inside blockquotes
4. Flag drift patterns from the canonical table (you / your, tonight, hedge words, etc.).
5. Quote each violating phrase and propose the rewrite in house voice.

Report findings in Blockers / Nice-to-fix / Nits / Out-of-scope format.
