# PR Review Rubric

> The checklist any reviewer (human or Claude Code) applies before approving a PR into Copper Owl. Lives in the repo so the criteria are version-controlled with the code.

The goal of this rubric is to catch the things that compound over time if left unaddressed: voice drift, dispatcher bugs that flash content, primitives that should have been shared, hardcoded colors that bypass the design system. Most PRs will have nothing flagged in most categories — that's expected and good.

## How to use this document

A reviewer reads the PR diff with this rubric open, and writes findings in this format:

    [SEVERITY] path/to/file.tsx:NN — description
      Suggested fix: one sentence

Severities:

- **BLOCKER** — would cause a real bug, broken UX, voice failure, or architectural violation. Don't merge until addressed.
- **NICE-TO-FIX** — not breaking anything, but the PR is a good moment to catch it. Author decides whether to address in this PR or a follow-up.
- **NIT** — purely stylistic or a personal preference. Author can ignore without explanation.

If a finding could be in two categories, prefer the lower severity. Over-flagging trains reviewers and authors to ignore the rubric.

## 1. Voice

The most important category. Copper Owl's voice is a calm field guide left on a table — third-person observational, mentor-tone, mature. See `docs/voice.md` for the full principles.

For every user-facing string in the diff (in JSX, in route copy, in error messages, in form labels, in rule prose):

- **Third-person observational.** No "I", "we", "you should". "The Personal Story is past the halfway point" not "You're past the halfway point on the Personal Story."
- **"This session" not "tonight."** Players run Copper Owl in all timezones.
- **Concrete details over hedge words.** "4 chapters remain" beats "a few left." If the engine has data, use it. If it doesn't, give the wiki number.
- **Honest about skipping.** Every recommendation should make it clear skipping is fine. The default should never feel like an obligation.
- **No FOMO.** Festivals come back. Living World can be bought retroactively. Never imply the player has missed something irrecoverable.
- **Reset-awareness shapes urgency only when reset is actually imminent.** Outside the 30-minute imminent window or the 30-minute post-reset window, recommendations shouldn't invoke reset framing.

Pay extra attention to:

- ChoiceCard and ModeCard tradeoff text in orientation.tsx — these tend to drift to "You get: X / For you: Y" framing.
- Form labels in any self-classification UI — "Which expansions are unlocked?" not "Which expansions do you own?"
- Error messages — "That key was rejected" not "Your key was rejected."
- Loading state copy — "Reading account state…" not "Fetching your data…"
- Tag values on Recommendation objects — short context chips, not advice.

When in doubt, read the prose out loud in the voice of a 50-year-old librarian. If it sounds wrong, flag it.

### Common voice drift patterns

| Drift | Rewrite |
|---|---|
| "You get: X" | "Trade gained: X" or just describe what changes |
| "For you: X" | "Suits: X" or describe the fit |
| "You'll unlock the rest after PoF" | "The rest unlocks after PoF" |
| "If you want mounts" | "For mount access" |
| "Show up at the spawn time" | "Each runs at a fixed spawn time" |
| "Use LFG to find a group" | "LFG is the standard way to find a group" |
| "Hurry to finish before tonight's reset" | (Only at imminent window) "Reset in 12 min — finish today's dailies" |

## 2. Voice rewrites in the PR description

If the PR adds or changes user-facing prose, the description should list voice rewrites made or note the surfaces re-read for voice. Absence of this section in a prose-touching PR is itself a finding — the voice pass may not have happened.

## 3. Dispatcher and routing correctness

For any change to `src/routes/index.tsx` or other dispatcher code:

- **No infinite redirect loops.** Trace every state combination through the dispatcher and confirm it terminates on a real route.
- **Loading states don't flash content.** A user with a stored session shouldn't see /welcome flash before the redirect to /home or /orientation. Return `null` or a skeleton during the initial fetch.
- **Error states route somewhere appropriate.** Auth errors → /welcome with `?reason=auth`. Network/server errors → a route whose UI matches the error semantics, not just whatever's convenient.
- **Session priority is consistent.** If a user has both an api_key session AND an anonymous profile in the store (edge case from mode-switching), the dispatcher's priority order should be explicit and tested.

## 4. Synthetic and transformed state correctness

For changes to `transformGW2Account`, `buildSyntheticAccountState`, or anywhere that constructs an `AccountState`:

- **Round-trip property.** The state coming out should classify to the expected archetype via `classifyArchetype()`. Add a test if one doesn't exist.
- **Default values are honest.** When data isn't available, prefer `null` over fake values. `pursuingGoal: null` says "we don't know" — `pursuingGoal: false` says "we know they're not pursuing a goal," which is a different claim.
- **No hidden mutations.** Pure construction only. No mutating the input account or character arrays.

## 5. Engine purity

The recommendation engine in `src/engine/` is a pure function: no I/O, no side effects, no React. For any change touching `recommend.ts`, `archetypes.ts`, `reset.ts`, or `rules/`:

- **No fetch, no localStorage, no Date.now() inside the function bodies.** Pass current time as a parameter. The engine should be testable with arbitrary inputs.
- **No React imports.** The engine runs in tests, in workers, in any future contexts — staying framework-free protects optionality.
- **No imports from `src/routes/`, `src/state/`, or `src/components/`.** The dependency direction is one-way: routes/state/components depend on the engine, never the reverse.

## 6. State management

For changes to `src/state/`:

- **One store per concern.** Auth, preferences, profile, etc. — don't conflate.
- **Persisted shape changes need migration thought.** If a Zustand store's persisted shape changes, old users will have stale localStorage. Either the change is additive (new fields default safely) or the persist config needs a `version` + `migrate` function. Flag if neither is present and the change isn't additive.
- **Atomic state transitions.** `setApiKey(key, name)` should establish session + name in one set() call, not two. Two-step transitions can render with partial state.

## 7. Component architecture

For new components and route ports:

- **Primitives that appear twice get lifted.** If a `SourceBand`, `Chips`, or similar inline primitive exists in one route, that's fine. The second use is the moment to lift into `src/components/primitives/`. Flag inline duplication across routes.
- **Components in `src/components/` accept `className` and `style` props.** Composition over configuration. Don't bake one-off variants into the component when a className override would handle it.
- **SVG components use namespaced IDs.** `id="bc-sky"` not `id="sky"`. Two SVGs on the same page with colliding IDs will visually break in subtle ways.

## 8. Styling

For CSS Modules and `tokens.css` use:

- **No hardcoded colors in route or component CSS.** Use `var(--bg)`, `var(--gold)`, `var(--muted)`, etc. The only place hex codes live is `src/styles/tokens.css`.
- **No magic spacing values.** If `padding: 18px 20px` appears, that's fine for a one-off. If the same magic numbers appear in three places, lift them to a spacing token.
- **No inline styles on visual components.** Inline `style={{ color: '#fff' }}` bypasses the design system and resists theming. Inline `style={{ width }}` for SVG sizing is fine — that's structural, not aesthetic.

## 9. Tests

- **Engine changes need tests.** New rules, classifier changes, reset clock edge cases — all get tests. The bar is "the test fails meaningfully if the code regresses," not "100% line coverage."
- **Transform functions need tests.** Anything constructing an `AccountState` from external data.
- **Component tests are optional but appreciated for non-trivial logic.** Routes with branching loading/error/success states benefit from a render test per state.
- **Tests don't import from production code via path aliases except for types.** Test files using `@/...` paths is fine; tests reaching into private internals via deep imports is a smell.

## 10. Accessibility

For interactive components — buttons, forms, dialogs, menus:

- **Form inputs have label associations.** `<label htmlFor>` or `<label>wrapping</label>`. Placeholder text is not a label.
- **Disabled-but-meaningful state uses aria-disabled, not visual-only.** A checkbox that's locked because PoF auto-implies HoT should be `aria-disabled` so screen readers announce the lock state.
- **Keyboard navigation works.** Tab order matches visual order. Escape closes modals/expansions. Enter submits the obvious primary action.
- **Color is not the only signal.** A "selected" state should have a visual cue beyond color change — border, weight, icon, etc.
- **Touch targets are at least 44×44 px on mobile.** Tauri mobile and PWA users will tap these.

## 11. Security and privacy

- **API keys never appear in error messages, URLs, or log output.** If a 401 error message includes the key for debugging, that key now lives in browser history.
- **localStorage entries with credentials.** If a Zustand store persists an API key, the store name should make this clear (`copper-owl-auth`), and the field shouldn't appear in any developer-tools-visible context unnecessarily.
- **External links use `rel="noopener noreferrer"`.** Anything with `target="_blank"` to a non-Copper-Owl domain.
- **CSP changes need scrutiny.** Adding to the `connect-src` or `img-src` in `tauri.conf.json` opens new attack surface. Flag and justify.

## 12. Deferred items

A good PR description lists "Known deferred items" with brief reasoning. When reviewing:

- **Items listed as deferred are not blockers in this PR.** The author has flagged them; trust the judgement unless the deferred item is actually a security or correctness issue masquerading as "polish."
- **Items in the diff that should be deferred but aren't called out.** If you spot something that feels like a follow-up but isn't acknowledged, flag it. The deferred list being accurate is part of the review.

## 13. Commit message and PR description

- **Summary leads with what changed, not how it was implemented.** "Port orientation surface + anonymous self-classification flow" is good. "Add 21 SVG files, modify 12 routes" is not.
- **Test plan is concrete.** Specific user flows to verify, not just "run tests."
- **Voice rewrites section if prose changed.** See section 2.

## What to skip

The rubric is not infinite. Skip:

- Bikeshedding on naming when the existing name is clear enough.
- "I would have structured this differently" comments without a concrete benefit.
- Comments on auto-generated files (`src/routeTree.gen.ts`, lockfiles, build artifacts).
- Style preferences not enforced by Prettier or ESLint.

If a comment doesn't change the merge decision or the next PR's quality, it's probably noise.

## Output format

When done, post the findings as a PR comment in this shape:

    ## Review

    ### Blockers
    - [file.tsx:NN] description
      Fix: …

    ### Nice-to-fix
    - [file.tsx:NN] description

    ### Nits
    - [file.tsx:NN] description

    ### Looks good
    - Brief acknowledgment of what worked — design decisions, test coverage, voice discipline, etc. Not flattery; honest signal that the right things landed.

If there are no findings in a severity, omit the section entirely. A clean PR review can be three lines.
