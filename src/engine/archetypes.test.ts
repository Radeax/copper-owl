import { describe, it, expect } from 'vitest';
import { classifyArchetype } from './archetypes';
import type { AccountState } from '@/types/domain';

const baseAccount = (overrides: Partial<AccountState> = {}): AccountState => ({
  name: 'TestAccount.1234',
  ageDays: 100,
  daysSinceLastLogin: 1,
  expansions: {
    hot: true,
    pof: true,
    eod: true,
    soto: true,
    jw: true,
    voe: true,
  },
  characters: [
    {
      name: 'Hero',
      level: 80,
      profession: 'Necromancer',
      lastModified: new Date().toISOString(),
    },
  ],
  wallet: {},
  masteries: null,
  ...overrides,
});

describe('classifyArchetype', () => {
  it('returns "unclassified" when no account is provided', () => {
    expect(classifyArchetype(null)).toBe('unclassified');
  });

  it('returns "f2p_explorer" when no expansions are owned', () => {
    const account = baseAccount({
      expansions: {
        hot: false,
        pof: false,
        eod: false,
        soto: false,
        jw: false,
        voe: false,
      },
    });
    expect(classifyArchetype(account)).toBe('f2p_explorer');
  });

  it('returns "returning" when the player has been gone 60+ days', () => {
    const account = baseAccount({ daysSinceLastLogin: 90 });
    expect(classifyArchetype(account)).toBe('returning');
  });

  it('returns "fresh_80" when the player has a level-80 character but hasn\'t played recently', () => {
    const account = baseAccount({ daysSinceLastLogin: 30 });
    expect(classifyArchetype(account)).toBe('fresh_80');
  });

  it('returns "engaged_casual" when the player has been active within 14 days', () => {
    const account = baseAccount({ daysSinceLastLogin: 5 });
    expect(classifyArchetype(account)).toBe('engaged_casual');
  });

  it('returning takes priority over fresh_80 even with max-level characters', () => {
    const account = baseAccount({ daysSinceLastLogin: 200 });
    expect(classifyArchetype(account)).toBe('returning');
  });

  it('f2p_explorer takes priority over returning when no expansions owned', () => {
    const account = baseAccount({
      daysSinceLastLogin: 90,
      expansions: {
        hot: false,
        pof: false,
        eod: false,
        soto: false,
        jw: false,
        voe: false,
      },
    });
    expect(classifyArchetype(account)).toBe('f2p_explorer');
  });
});
