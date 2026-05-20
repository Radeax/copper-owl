# ADR 0003: Project name — Copper Owl

**Status:** Accepted
**Date:** May 2026
**Decision-makers:** Solo (Radeax)

## Context

The project went through three working names before settling on Copper Owl. Each name was rejected for a specific reason, documented here so future-self doesn't repeat the same exploration paths.

## Decision

Final name: **Copper Owl**.

## Name history and rejection reasoning

### "GW2 Compass" — initial working name during prototype phase

Used throughout v1–v10 HTML prototypes. Functional placeholder; never intended as the shipping name. Rejected because it directly incorporates "GW2" (ArenaNet trademark) and would create brand confusion with ArenaNet-sanctioned tooling.

### "Northwrit" — first scaffold name (Northwriting → Northwrit)

Coined word, sounded distinctive. Rejected after IP research surfaced:

- **"Writ" is a GW2 item category.** Active vendor currency items include Writ of Seitung Province, Writ of Experience, Writ of Tyrian Mastery, Writ of Dragon's End, Writ of Echovald Wilds, Masterful Writ Container, Local Writ of Renown. Players see "Writ of [X]" in their inventory regularly.
- **"North" is GW2-adjacent.** Eye of the North is a major zone; The North Wind is a weapon item.
- **Pronunciation ambiguity.** North-WRIT or NORTH-rit?
- **Brand confusion risk.** A GW2 player seeing "Northwrit" would reasonably assume ArenaNet sanction.

### "Bearings" — second scaffold name

Initially recommended after broader name brainstorming. "Get your bearings" metaphor matched the product purpose exactly. Rejected after deeper IP research:

- **"Arcanum of Astral Bearing"** is a real GW2 achievement and crafting component, part of the Legendary Obsidian Armor chain in Secrets of the Obscure (the most recent expansion at decision time). Recent + high-prestige + name-specific match — exactly the kind of collision that destroys brand distinctiveness.
- Additional weaker concerns: "bearings" is heavily used in industrial product naming (SKF, NTN), and the word lives in compass/GPS app feature language already.

### "Copper Owl" — accepted name

Selected after the pattern shifted from "evocative metaphor word" to "distinctive compound that doesn't appear in GW2 lore."

- **Compound doesn't exist in GW2.** Neither "Copper Owl" nor any close variant appears as an item, location, character, or achievement.
- **Component words are universal.** Owl is a worldwide wisdom symbol used across countless brands. Copper is a generic metal name used in thousands of contexts. Neither evokes specific GW2 lore.
- **Thematic resonance for the right audience.** Norn Spirits of the Wild (an in-game concept) include Owl. For GW2 players, the name carries a quiet thematic nod without being a direct collision — exactly the kind of subtle reference that strengthens brand for the target audience.
- **Two-word distinctive pattern matches successful community tool precedents.** Snow Crows, Hardstuck, MetaBattle, Discretize all use non-fantasy distinctive names. Following this pattern.
- **Legal risk: essentially zero.** ArenaNet doesn't own "copper" or "owl" or their combination. ArenaNet has historically been actively supportive of community tools using even more direct GW2 references (gw2efficiency, ArcDPS).

## Domain and identifier conventions

- Display name: **Copper Owl** (two words, spaced)
- Repo and package names: **copper-owl** (kebab-case for npm/Cargo convention)
- Cargo lib name: **copper_owl_lib** (Rust identifier rules require underscore)
- Tauri bundle identifier: **app.copperowl.desktop** (compound — Android Java package rules forbid hyphens)
- Domain: not yet registered; `copperowl.app` or `copperowl.gg` preferred over `copperowl.com` (industrial-owned)

## Consequences

The name is final. Future renaming would mean updating: repo name, package.json, Cargo.toml, Tauri identifier, all docs, domain registrations, social handles. Cost of renaming scales with project age — committing now prevents that cost from accumulating.

## References

- GW2 Wiki — Writ category: https://wiki.guildwars2.com/wiki/Writ
- GW2 Wiki — Astral Bearing: https://wiki.guildwars2.com/wiki/Arcanum_of_Astral_Bearing
- Decision discussion: Claude.ai chat thread, May 2026
