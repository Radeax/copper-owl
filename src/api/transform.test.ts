import { describe, it, expect } from 'vitest';
import { transformGW2Account } from './transform';
import type { AccountResponse, CharacterResponse } from './gw2';

const BASE_ACCOUNT: AccountResponse = {
  id: 'test-id',
  name: 'TestPlayer.1234',
  created: '2020-01-01T00:00:00.000Z',
  age: 100000,
  last_modified: '2023-01-01T00:00:00.000Z',
  access: ['PlayForFree', 'GuildWars2'],
};

const BONE_EMPRESS: CharacterResponse = {
  name: 'Bone Empress',
  level: 80,
  profession: 'Necromancer',
  last_modified: '2024-01-01T00:00:00.000Z',
};

describe('transformGW2Account', () => {
  describe('expansion flags', () => {
    it('F2P account has all expansion flags false', () => {
      const result = transformGW2Account(BASE_ACCOUNT, []);
      expect(result.expansions).toEqual({
        hot: false,
        pof: false,
        eod: false,
        soto: false,
        jw: false,
        voe: false,
      });
    });

    it('PoF sets both pof and hot (PoF bundles HoT)', () => {
      const account = { ...BASE_ACCOUNT, access: ['GuildWars2', 'PathOfFire'] };
      const result = transformGW2Account(account, []);
      expect(result.expansions.pof).toBe(true);
      expect(result.expansions.hot).toBe(true);
    });

    it('HoT alone does not set pof', () => {
      const account = { ...BASE_ACCOUNT, access: ['GuildWars2', 'HeartOfThorns'] };
      const result = transformGW2Account(account, []);
      expect(result.expansions.hot).toBe(true);
      expect(result.expansions.pof).toBe(false);
    });

    it('all expansions owned', () => {
      const account = {
        ...BASE_ACCOUNT,
        access: [
          'GuildWars2',
          'HeartOfThorns',
          'PathOfFire',
          'EndOfDragons',
          'SecretsOfTheObscure',
          'JanthirWilds',
          'VisionsOfEternity',
        ],
      };
      const result = transformGW2Account(account, []);
      expect(result.expansions).toEqual({
        hot: true,
        pof: true,
        eod: true,
        soto: true,
        jw: true,
        voe: true,
      });
    });
  });

  describe('dates', () => {
    it('calculates daysSinceLastLogin correctly', () => {
      const now = new Date('2024-01-10T12:00:00.000Z').getTime();
      const account = {
        ...BASE_ACCOUNT,
        last_modified: '2024-01-08T12:00:00.000Z',
      };
      const result = transformGW2Account(account, [], now);
      expect(result.daysSinceLastLogin).toBe(2);
    });

    it('calculates ageDays correctly', () => {
      const created = '2024-01-01T00:00:00.000Z';
      const now = new Date('2024-01-11T00:00:00.000Z').getTime();
      const account = { ...BASE_ACCOUNT, created };
      const result = transformGW2Account(account, [], now);
      expect(result.ageDays).toBe(10);
    });

    it('truncates fractional days (floor)', () => {
      const now = new Date('2024-01-10T06:00:00.000Z').getTime(); // 1.25 days later
      const account = {
        ...BASE_ACCOUNT,
        last_modified: '2024-01-09T00:00:00.000Z',
      };
      const result = transformGW2Account(account, [], now);
      expect(result.daysSinceLastLogin).toBe(1);
    });
  });

  describe('characters', () => {
    it('maps characters to CharacterSummary shape', () => {
      const result = transformGW2Account(BASE_ACCOUNT, [BONE_EMPRESS]);
      expect(result.characters).toHaveLength(1);
      expect(result.characters[0]).toEqual({
        name: 'Bone Empress',
        level: 80,
        profession: 'Necromancer',
        lastModified: '2024-01-01T00:00:00.000Z',
      });
    });

    it('empty characters array is preserved', () => {
      const result = transformGW2Account(BASE_ACCOUNT, []);
      expect(result.characters).toHaveLength(0);
    });
  });

  describe('deferred fields', () => {
    it('wallet is always an empty object', () => {
      const result = transformGW2Account(BASE_ACCOUNT, []);
      expect(result.wallet).toEqual({});
    });

    it('masteries is always null', () => {
      const result = transformGW2Account(BASE_ACCOUNT, []);
      expect(result.masteries).toBeNull();
    });
  });
});
