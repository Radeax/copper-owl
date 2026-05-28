import { describe, it, expect, beforeEach } from 'vitest';
import { transformGW2Account } from './transform';
import type { AccountResponse, CharacterResponse } from './gw2';
import { classifyArchetype } from '@/engine/archetypes';
import accountFixture from './__fixtures__/account-engaged-committed.json';
import charactersFixture from './__fixtures__/characters-engaged-committed.json';

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

    it('returns daysSinceLastLogin=null when last_modified is missing', () => {
      const account: AccountResponse = { ...BASE_ACCOUNT, last_modified: undefined };
      const result = transformGW2Account(account, []);
      expect(result.daysSinceLastLogin).toBeNull();
    });

    it('returns daysSinceLastLogin=null when last_modified is malformed', () => {
      const account: AccountResponse = { ...BASE_ACCOUNT, last_modified: 'not-a-date' };
      const result = transformGW2Account(account, []);
      expect(result.daysSinceLastLogin).toBeNull();
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

    it('pursuingGoal is always null (not derivable from API yet)', () => {
      const result = transformGW2Account(BASE_ACCOUNT, []);
      expect(result.pursuingGoal).toBeNull();
    });
  });

  describe('engaged_committed fixture', () => {
    // Pin `now` to the fixture's last_modified day so date assertions are
    // deterministic regardless of when the test runs.
    const FIXED_NOW = Date.UTC(2026, 4, 27); // 2026-05-27 UTC

    let result: ReturnType<typeof transformGW2Account>;
    beforeEach(() => {
      result = transformGW2Account(
        accountFixture as AccountResponse,
        charactersFixture as CharacterResponse[],
        FIXED_NOW
      );
    });

    it('round-trips through transformGW2Account', () => {
      expect(result.name).toBe('TestAccount.1234');
      expect(result.ageDays).toBe(164); // 2025-12-14 → 2026-05-27
      expect(result.daysSinceLastLogin).toBe(0);
      expect(result.expansions).toEqual({
        hot: true, // inferred from pof
        pof: true,
        eod: true,
        soto: true,
        jw: true,
        voe: false,
      });
      expect(result.wallet).toEqual({});
      expect(result.masteries).toBeNull();
      expect(result.pursuingGoal).toBeNull();
      expect(result.characters).toHaveLength(charactersFixture.length);
      expect(result.characters[0]).toEqual({
        name: 'Hero One',
        level: 80,
        profession: 'Revenant',
        lastModified: '2026-05-27T00:00:00Z',
      });
    });

    it('PoF in access array implies HoT ownership in expansions', () => {
      // Precondition: document that the fixture exercises the inference
      expect(accountFixture.access).toContain('PathOfFire');
      expect(accountFixture.access).not.toContain('HeartOfThorns');

      expect(result.expansions.pof).toBe(true);
      expect(result.expansions.hot).toBe(true);
    });

    it('classifies as engaged_casual when pursuingGoal is null (API-derived default)', () => {
      expect(classifyArchetype(result)).toBe('engaged_casual');
    });

    it('classifies as engaged_committed once pursuingGoal=true is set', () => {
      // transformGW2Account sets pursuingGoal=null for API-derived accounts
      // because it isn't derivable from the public endpoints yet. The
      // classifier requires pursuingGoal===true to promote to engaged_committed.
      // Once that signal exists (anonymous self-classification today, a future
      // wallet/character heuristic for API mode), this fixture lands in its
      // namesake archetype.
      expect(classifyArchetype({ ...result, pursuingGoal: true })).toBe(
        'engaged_committed'
      );
    });
  });
});
