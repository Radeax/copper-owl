import { describe, it, expect } from 'vitest';
import {
  ALL_EXPANSIONS,
  NO_EXPANSIONS,
  buildSyntheticAccountState,
  type AnonymousProfile,
} from './auth';
import { classifyArchetype } from '@/engine/archetypes';

describe('buildSyntheticAccountState', () => {
  it('f2p_explorer profile classifies back to f2p_explorer', () => {
    const profile: AnonymousProfile = {
      archetype: 'f2p_explorer',
      expansions: NO_EXPANSIONS,
      daysSinceLastLogin: 1,
      hasMaxLevel: false,
    };
    const state = buildSyntheticAccountState(profile);
    expect(classifyArchetype(state)).toBe('f2p_explorer');
  });

  it('f2p_explorer with max level still classifies as f2p_explorer (no expansions wins)', () => {
    const profile: AnonymousProfile = {
      archetype: 'f2p_explorer',
      expansions: NO_EXPANSIONS,
      daysSinceLastLogin: 1,
      hasMaxLevel: true,
    };
    expect(classifyArchetype(buildSyntheticAccountState(profile))).toBe('f2p_explorer');
  });

  it('fresh_80 profile classifies back to fresh_80', () => {
    const profile: AnonymousProfile = {
      archetype: 'fresh_80',
      expansions: { ...ALL_EXPANSIONS, jw: false, voe: false },
      daysSinceLastLogin: 30,
      hasMaxLevel: true,
    };
    expect(classifyArchetype(buildSyntheticAccountState(profile))).toBe('fresh_80');
  });

  it('fresh_80 profile with no expansions classifies as f2p_explorer (start.tsx blocks this combination)', () => {
    // Selecting the "Fresh at level 80" card with every expansion unchecked
    // would store archetype 'fresh_80' but classify as 'f2p_explorer' — the
    // stored and derived archetypes disagree. start.tsx disables Continue in
    // this state; this pins the classifier behavior the guard exists for.
    const profile: AnonymousProfile = {
      archetype: 'fresh_80',
      expansions: NO_EXPANSIONS,
      daysSinceLastLogin: 30,
      hasMaxLevel: true,
    };
    expect(classifyArchetype(buildSyntheticAccountState(profile))).toBe('f2p_explorer');
  });

  it('returning profile classifies back to returning at each gap bucket', () => {
    for (const gap of [90, 365, 700]) {
      const profile: AnonymousProfile = {
        archetype: 'returning',
        expansions: ALL_EXPANSIONS,
        daysSinceLastLogin: gap,
        hasMaxLevel: true,
      };
      expect(classifyArchetype(buildSyntheticAccountState(profile))).toBe('returning');
    }
  });

  it('engaged_casual profile classifies back to engaged_casual', () => {
    const profile: AnonymousProfile = {
      archetype: 'engaged_casual',
      expansions: ALL_EXPANSIONS,
      daysSinceLastLogin: 1,
      hasMaxLevel: true,
      pursuingGoal: false,
    };
    expect(classifyArchetype(buildSyntheticAccountState(profile))).toBe('engaged_casual');
  });

  it('engaged_committed profile classifies back to engaged_committed via pursuingGoal=true', () => {
    const profile: AnonymousProfile = {
      archetype: 'engaged_committed',
      expansions: ALL_EXPANSIONS,
      daysSinceLastLogin: 1,
      hasMaxLevel: true,
      pursuingGoal: true,
    };
    expect(classifyArchetype(buildSyntheticAccountState(profile))).toBe('engaged_committed');
  });

  it('synthesizes a max-level character only when hasMaxLevel is true', () => {
    const withMax = buildSyntheticAccountState({
      archetype: 'fresh_80',
      expansions: ALL_EXPANSIONS,
      daysSinceLastLogin: 30,
      hasMaxLevel: true,
    });
    expect(withMax.characters).toHaveLength(1);
    expect(withMax.characters[0]?.level).toBe(80);

    const withoutMax = buildSyntheticAccountState({
      archetype: 'f2p_explorer',
      expansions: NO_EXPANSIONS,
      daysSinceLastLogin: 1,
      hasMaxLevel: false,
    });
    expect(withoutMax.characters).toHaveLength(0);
  });

  it('leaves wallet empty and masteries null (engine handles absent data)', () => {
    const state = buildSyntheticAccountState({
      archetype: 'engaged_casual',
      expansions: ALL_EXPANSIONS,
      daysSinceLastLogin: 1,
      hasMaxLevel: true,
    });
    expect(state.wallet).toEqual({});
    expect(state.masteries).toBeNull();
  });

  it('omitted pursuingGoal collapses to null on AccountState', () => {
    const state = buildSyntheticAccountState({
      archetype: 'fresh_80',
      expansions: ALL_EXPANSIONS,
      daysSinceLastLogin: 30,
      hasMaxLevel: true,
    });
    expect(state.pursuingGoal).toBeNull();
  });
});
