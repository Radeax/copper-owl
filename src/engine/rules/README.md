# Rules

This directory contains the **rule registry mechanism** — not the actual recommendation content.

## What lives here

- `types.ts` — `RuleFn` and `RuleSet` type contracts
- `registry.ts` — `registerRuleSet()` and `getRule()` plug-in API
- `example.ts` — placeholder rules that register fallback recommendations

## What does NOT live here

The actual curated recommendation rules (the prose, the GW2 knowledge, the voice work) live in a separate package: **`@copper-owl/rules`** (private).

This separation is intentional. The engine architecture is open source under MIT; the curated content is the maintained product and not redistributed.

## Running locally without the private package

The public engine works out of the box. `pnpm install` and `pnpm dev` will surface example placeholder recommendations on every archetype. The app is fully functional — just with stub content.

## Building your own rule set

Anyone can write their own rules against this public API:

```ts
import { registerRuleSet } from '@/engine/rules/registry';

registerRuleSet({
  fresh_80: (account, reset) => [
    {
      id: 'my-rule',
      priority: 'primary',
      title: 'Try this thing',
      zone: 'Some zone',
      detail: 'Custom recommendation logic.',
      tags: ['Custom'],
      bannerKey: 'custom-banner',
    },
  ],
});
```

Import the registering module once at app startup (typically from `main.tsx`), and the engine will dispatch to it.

## Voice principles

Even if you write your own rules, the recommendation voice principles documented in `docs/voice.md` represent the design philosophy of this engine. Third-person observational, no FOMO, honest about skipping. Worth following if your fork is meant to feel like Copper Owl.
