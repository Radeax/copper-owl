/**
 * Auth store.
 *
 * One unified Session shape regardless of the mode the user picked:
 *   - anonymous: no API key, user picks profile manually via /start
 *   - api_key:   user pasted a read-only API key
 *   - gw2me:     user signed in via gw2.me OAuth (token managed by gw2.me)
 *
 * The recommendation engine and routes branch on session.mode only at the
 * boundary (to pick API-fetched vs synthetic account state). The engine
 * itself receives the same AccountState shape either way.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  AccountState,
  AuthMode,
  PlayerArchetype,
  Session,
} from '@/types/domain';

export type ExpansionFlags = AccountState['expansions'];

export const NO_EXPANSIONS: Readonly<ExpansionFlags> = Object.freeze({
  hot: false,
  pof: false,
  eod: false,
  soto: false,
  jw: false,
  voe: false,
});

export const ALL_EXPANSIONS: Readonly<ExpansionFlags> = Object.freeze({
  hot: true,
  pof: true,
  eod: true,
  soto: true,
  jw: true,
  voe: true,
});

/**
 * The output of the /start self-classification flow.
 * Stored separately from `session` because it survives a transient session
 * rebuild and lets the user revisit /start to adjust answers.
 */
export interface AnonymousProfile {
  /** The archetype the user explicitly chose at /start. */
  archetype: PlayerArchetype;
  /** Which expansions the user marked as unlocked. */
  expansions: ExpansionFlags;
  /** Days since last login — drives the returning vs fresh_80 vs engaged split. */
  daysSinceLastLogin: number;
  /** Whether they reported having a level-80 character. */
  hasMaxLevel: boolean;
  /** Engaged-player toggle — only set on engaged archetypes. */
  pursuingGoal?: boolean;
}

/**
 * Build the AccountState the engine consumes from a self-classified profile.
 * The synthetic state is constructed so classifyArchetype() returns the
 * archetype the user picked — this keeps the engine ignorant of auth mode.
 */
export function buildSyntheticAccountState(profile: AnonymousProfile): AccountState {
  const characters = profile.hasMaxLevel
    ? [
        {
          name: 'Anonymous profile',
          level: 80,
          profession: 'Unknown',
          lastModified: new Date().toISOString(),
        },
      ]
    : [];

  return {
    name: null,
    ageDays: null,
    daysSinceLastLogin: profile.daysSinceLastLogin,
    // Copy so a frozen constant (NO_/ALL_EXPANSIONS) never flows into
    // engine state as a shared, in-place-mutable reference.
    expansions: { ...profile.expansions },
    characters,
    wallet: {},
    masteries: null,
    pursuingGoal: profile.pursuingGoal ?? null,
  };
}

interface AuthState {
  session: Session | null;
  /** Set when session.mode === 'anonymous'; cleared on signOut. */
  anonymousProfile: AnonymousProfile | null;

  setApiKey: (apiKey: string, accountName?: string) => void;
  setGw2me: (apiKey: string, accountName?: string) => void;
  /**
   * Establish an anonymous session and store the self-classified profile
   * in a single call. The dispatcher routes based on profile.archetype.
   */
  setAnonymousProfile: (profile: AnonymousProfile) => void;
  signOut: () => void;
}

const newSession = (
  mode: AuthMode,
  apiKey?: string,
  accountName?: string
): Session => ({
  mode,
  ...(apiKey ? { apiKey } : {}),
  ...(accountName ? { accountName } : {}),
  establishedAt: new Date().toISOString(),
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      anonymousProfile: null,

      setApiKey: (apiKey, accountName) =>
        set({
          session: newSession('api_key', apiKey, accountName),
          anonymousProfile: null,
        }),

      setGw2me: (apiKey, accountName) =>
        set({
          session: newSession('gw2me', apiKey, accountName),
          anonymousProfile: null,
        }),

      setAnonymousProfile: (profile) =>
        set({
          session: newSession('anonymous'),
          anonymousProfile: profile,
        }),

      signOut: () => set({ session: null, anonymousProfile: null }),
    }),
    {
      name: 'copper-owl-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
