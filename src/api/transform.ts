import type { AccountState } from '@/types/domain';
import type { AccountResponse, CharacterResponse } from './gw2';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const EXPANSION_FLAGS: Partial<Record<string, keyof AccountState['expansions']>> = {
  HeartOfThorns: 'hot',
  PathOfFire: 'pof',
  EndOfDragons: 'eod',
  SecretsOfTheObscure: 'soto',
  JanthirWilds: 'jw',
  VisionsOfEternity: 'voe',
};

export function transformGW2Account(
  account: AccountResponse,
  characters: CharacterResponse[],
  now = Date.now()
): AccountState {
  const expansions: AccountState['expansions'] = {
    hot: false,
    pof: false,
    eod: false,
    soto: false,
    jw: false,
    voe: false,
  };

  for (const flag of account.access) {
    const key = EXPANSION_FLAGS[flag];
    if (key) expansions[key] = true;
  }

  // PoF ships with HoT bundled per the GW2 expansion model
  if (expansions.pof) expansions.hot = true;

  return {
    name: account.name,
    ageDays: Math.floor((now - new Date(account.created).getTime()) / MS_PER_DAY),
    daysSinceLastLogin: Math.floor(
      (now - new Date(account.last_modified).getTime()) / MS_PER_DAY
    ),
    expansions,
    characters: characters.map((c) => ({
      name: c.name,
      level: c.level,
      profession: c.profession,
      lastModified: c.last_modified,
    })),
    wallet: {},
    masteries: null,
    pursuingGoal: null,
  };
}
