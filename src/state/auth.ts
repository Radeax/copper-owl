/**
 * Auth store.
 *
 * One unified Session shape regardless of the mode the user picked:
 *   - anonymous: no API key, user picks profile manually
 *   - api_key:   user pasted a read-only API key
 *   - gw2me:     user signed in via gw2.me OAuth (token managed by gw2.me)
 *
 * The recommendation engine and the UI never need to branch on mode —
 * they read `session.apiKey` if present, otherwise treat the account
 * data as user-provided manual input.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Session, AuthMode } from '@/types/domain';

interface AuthState {
  session: Session | null;
  /** Anonymous-mode hand-picked archetype, used when no API key is present. */
  anonymousArchetype: string | null;

  setAnonymous: () => void;
  setApiKey: (apiKey: string, accountName?: string) => void;
  setGw2me: (apiKey: string, accountName?: string) => void;
  setAnonymousArchetype: (archetype: string) => void;
  signOut: () => void;
}

const newSession = (mode: AuthMode, apiKey?: string, accountName?: string): Session => ({
  mode,
  ...(apiKey ? { apiKey } : {}),
  ...(accountName ? { accountName } : {}),
  establishedAt: new Date().toISOString(),
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      anonymousArchetype: null,

      setAnonymous: () =>
        set({
          session: newSession('anonymous'),
          anonymousArchetype: null,
        }),

      setApiKey: (apiKey, accountName) =>
        set({
          session: newSession('api_key', apiKey, accountName),
        }),

      setGw2me: (apiKey, accountName) =>
        set({
          session: newSession('gw2me', apiKey, accountName),
        }),

      setAnonymousArchetype: (archetype) =>
        set({ anonymousArchetype: archetype }),

      signOut: () => set({ session: null, anonymousArchetype: null }),
    }),
    {
      name: 'copper-owl-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
