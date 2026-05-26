---
description: Generate a new PRD in the Copper Owl format. Pass the feature name as the argument.
---

Use the prd-writer agent to draft a new PRD.

The agent will:
1. List `docs/product/` to find the next number (highest + 1).
2. Read existing PRDs 0001 through the latest to internalize the structural and prose patterns.
3. Read `docs/architecture.md` and relevant ADRs so the PRD doesn't contradict landed decisions.
4. Read `docs/voice.md` so example output strings model house voice.
5. If the feature touches existing code, read those files first. Status reflects code reality.
6. Verify every cross-reference points to a real file.
7. Save the PRD at `docs/product/NNNN-<kebab-name>.md`.

After writing, the agent will suggest the branch + commit + PR + issue flow rather than committing directly to main.

Feature to spec: $ARGUMENTS
