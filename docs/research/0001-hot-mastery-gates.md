# Research 0001: Heart of Thorns story-gating masteries

**Date captured:** May 2026
**Last updated:** May 2026 (cross-validated via Perplexity Pro, Gemini 2.5 Pro, ChatGPT)
**Sources:** GW2 Wiki (canonical), ArenaNet patch notes archive, community guides

This file captures the canonical mastery-gate data for HoT story chapters. Used by the engine's mastery-gate lookup table once PRD 0002 is implemented.

## Mastery system unlock prerequisite

Before any HoT mastery can be trained, the player must:

1. Be level 80
2. Complete the first HoT story chapter "Torn from the Sky" on one character

Completing "Torn from the Sky" automatically unlocks the Gliding track and the Itzel Lore track. Exalted Lore and Nuhoch Lore unlock later when the player physically enters Auric Basin and Tangled Depths respectively.

## Story-gating masteries (the actual story walls)

These five masteries display the in-game "Earn your X mastery to continue your story" prompt and hard-block story progression until unlocked. Confirmed via GW2 Wiki story chapter pages and Heart of Thorns mastery tracks page.

| Order | Mastery | Track + Tier | XP Required | MP Required | Gated chapter |
|---|---|---|---|---|---|
| 1 | Glider Basics | Gliding T1 | 508,000 | 1 | Establishing a Foothold |
| 2 | Bouncing Mushrooms | Itzel Lore T1 | 508,000 | 1 | In Their Footsteps |
| 3 | Exalted Markings | Exalted Lore T1 | 508,000 | 1 | City of Hope |
| 4 | Updraft Use | Gliding T2 | 1,016,000 | 2 | The Predator's Path |
| 5 | Nuhoch Hunting | Nuhoch Lore T1 | 508,000 | 1 | The Way In |

**Total minimum investment: 6 mastery points and 3,048,000 XP.**

No mastery is required for the final two story chapters (Bitter Harvest, Hearts and Minds). Once Nuhoch Hunting is trained, the player can complete the campaign without further mastery unlocks.

## Post-launch changes — Itzel Poison Lore removed as a gate

At HoT's October 2015 launch, the story had **six** mastery gates, not five. The sixth was Itzel Poison Lore (Itzel Lore tier 4), which gated what was then story step 14. The community reaction to a tier-4 mastery (2,540,000 XP) being required mid-campaign was strongly negative.

ArenaNet hotfixed this within the first two days of launch (October 25, 2015 patch). Patch notes: "Itzel Poison Lore is no longer a Mastery requirement for story." From that point forward, Itzel Poison Lore remained a hard requirement for full map completion (several hero points and mastery insights live inside poison fields, especially in Tangled Depths and Dragon's Stand) but was removed from the story-gate list.

Older community guides written in October 2015 may still list six story gates. The current correct count is five.

## Post-launch changes — Spring 2016 Quarterly Update

The April 19, 2016 Spring Quarterly Update was the second major intervention. It did not directly reduce per-tier XP costs significantly. Instead:

- Creature kills in HoT maps yield 50% more XP
- Events were removed from diminishing returns
- Adventures received substantially increased XP rewards
- Meta-events were decoupled to allow drop-in participation

Net effect: the effective grind is significantly shorter than at 2015 launch, even though the displayed per-tier XP costs only reduced marginally (the all-HoT-masteries total went from ~67.5M XP at launch to 58.7M XP today, a ~13% reduction in displayed cost combined with the 50% earning-rate increase).

This is worth capturing because it explains why older guides may quote XP grind times that no longer apply.

## Track unlock conditions

| Track | Unlock condition |
|---|---|
| Gliding | Complete "Torn from the Sky" (HoT Chapter 1) |
| Itzel Lore | Complete "Torn from the Sky" (unlocks alongside Gliding) |
| Exalted Lore | Enter Auric Basin through Tarnished Treetop after completing "Torn from the Sky" |
| Nuhoch Lore | Enter Tangled Depths after completing "Torn from the Sky" |
| Raids | Complete any encounter in Forsaken Thicket or Bastion of the Penitent raids |
| Ancient Magics | Enter Bloodstone Fen (LW3 Episode 1) or Ember Bay (LW3 Episode 2) |
| Ley Line Gliding | Gliding tier 6, unlocks after Advanced Gliding (tier 5) |

## Auxiliary masteries (completion-focused players)

Not story-required, but highly valuable for map completion and collections:

| Mastery | Track + Tier | XP | MP | Purpose |
|---|---|---|---|---|
| Nuhoch Wallows | Nuhoch Lore T2 | 1,016,000 | 2 | Essential for Tangled Depths map traversal — organic fast-travel network |
| Lean Techniques | Gliding T3 | 1,778,000 | 3 | Extended endurance, speed control for vertical traversal |
| Itzel Language | Itzel Lore T2 | 1,016,000 | 2 | Itzel vendor access — needed for Mistward armor and Auric weapons collections |
| Exalted Acceptance | Exalted Lore T2 | 1,016,000 | 2 | Exalted vendor access — Mistward armor component access |
| Stealth Gliding | Gliding T4 | 2,540,000 | 5 | Bypass aerial snipers; required for Gift of Hidden Descent (specialization weapons) |
| Itzel Poison Lore | Itzel Lore T4 | 2,540,000 | 5 | Poison immunity — required for some hero points and insights in Tangled Depths and Dragon's Stand |
| Advanced Gliding | Gliding T5 | 3,302,000 | 8 | Removes endurance drain — transforms map navigation efficiency |
| Nuhoch Stealth Detection | Nuhoch Lore T4 | 2,540,000 | 5 | See stealthed enemies — required for Treasure Mushrooms (daily farm, collection items) |
| Nuhoch Language | Nuhoch Lore T3 | 1,778,000 | 3 | Nuhoch vendor access — Mistward Coat component |
| Exalted Gathering | Exalted Lore T5 | 3,302,000 | 8 | Specialization weapon collection requirement (Auric Sharpening Stones) |
| Exalted Purification | Exalted Lore T4 | 2,540,000 | 5 | Order backpack collections (Agent, Crusader, Scholar) |
| Ley Line Gliding | Gliding T6 | 4,318,000 | 12 | Dragon's Stand meta-event traversal |

## Total cost summary

| Goal | XP needed | MP needed |
|---|---|---|
| Story completion (5 gates) | 3,048,000 | 6 |
| Story + key map traversal (Nuhoch Wallows + Itzel Poison Lore) | 6,604,000 | 13 |
| All HoT masteries (core, non-raid) | 58,674,000 | 144 |

## Sources

- https://wiki.guildwars2.com/wiki/Heart_of_Thorns_mastery_tracks (canonical)
- https://wiki.guildwars2.com/wiki/Mastery (canonical)
- https://wiki.guildwars2.com/wiki/Game_updates/2015-10-25 (Itzel Poison Lore removal hotfix)
- https://wiki.guildwars2.com/wiki/Game_updates/2016-04-19 (Spring Quarterly Update)
- https://www.gaisciochmagazine.com/articles/a_guide_to_heart_of_thorns_masteries.html (community guide, 2016)
- https://forum-en.gw2archive.eu/forum/game/hot/Which-mastery-skills-are-required-in-HoT (forum confirmation thread)
- https://guildjen.com/verdant-brink-achievement-guide/ (achievement-specific requirements)

Cross-validated May 2026 against Perplexity Pro, Gemini 2.5 Pro, and ChatGPT independent research. All three sources agreed on the five-gate canonical list.
