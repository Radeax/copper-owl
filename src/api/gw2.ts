/**
 * GW2 API endpoints + TanStack Query hooks.
 *
 * Centralises:
 *   - Query keys (stable, used for invalidation)
 *   - Endpoint paths (so the client side knows nothing about URLs)
 *   - Lightweight TS types for the response shapes Copper Owl actually reads
 *
 * Only the endpoints Copper Owl uses today are included. Add more as needed.
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { gw2Fetch } from './client';

// ─── Endpoint URLs ──────────────────────────────────────────────
export const endpoints = {
  account: '/v2/account',
  characters: '/v2/characters?ids=all',
  wallet: '/v2/account/wallet',
  masteries: '/v2/account/masteries',
  tokenInfo: '/v2/tokeninfo',
} as const;

// ─── Query keys ─────────────────────────────────────────────────
export const gw2Keys = {
  all: ['gw2'] as const,
  account: (apiKey: string) => ['gw2', 'account', apiKey] as const,
  characters: (apiKey: string) => ['gw2', 'characters', apiKey] as const,
  wallet: (apiKey: string) => ['gw2', 'wallet', apiKey] as const,
  masteries: (apiKey: string) => ['gw2', 'masteries', apiKey] as const,
  tokenInfo: (apiKey: string) => ['gw2', 'tokeninfo', apiKey] as const,
};

// ─── Response shapes (subset of fields the engine reads) ─────────
export interface AccountResponse {
  id: string;
  name: string;
  created: string;
  age: number; // seconds played
  last_modified?: string;
  access: string[]; // ['PlayForFree', 'GuildWars2', 'HeartOfThorns', 'PathOfFire', 'EndOfDragons', 'SecretsOfTheObscure', 'JanthirWilds', 'VisionsOfEternity']
}

export interface CharacterResponse {
  name: string;
  level: number;
  profession: string;
  last_modified: string;
}

export interface TokenInfoResponse {
  id: string;
  name: string;
  permissions: string[];
}

// ─── Hooks ──────────────────────────────────────────────────────
export function useGW2Account(
  apiKey: string | undefined,
  opts?: Omit<UseQueryOptions<AccountResponse>, 'queryKey' | 'queryFn' | 'enabled'>
) {
  return useQuery<AccountResponse>({
    queryKey: gw2Keys.account(apiKey ?? ''),
    queryFn: () => gw2Fetch<AccountResponse>(endpoints.account, { apiKey }),
    enabled: !!apiKey,
    ...opts,
  });
}

export function useGW2Characters(
  apiKey: string | undefined,
  opts?: Omit<UseQueryOptions<CharacterResponse[]>, 'queryKey' | 'queryFn' | 'enabled'>
) {
  return useQuery<CharacterResponse[]>({
    queryKey: gw2Keys.characters(apiKey ?? ''),
    queryFn: () =>
      gw2Fetch<CharacterResponse[]>(endpoints.characters, { apiKey }),
    enabled: !!apiKey,
    ...opts,
  });
}

export function useGW2TokenInfo(
  apiKey: string | undefined,
  opts?: Omit<UseQueryOptions<TokenInfoResponse>, 'queryKey' | 'queryFn' | 'enabled'>
) {
  return useQuery<TokenInfoResponse>({
    queryKey: gw2Keys.tokenInfo(apiKey ?? ''),
    queryFn: () => gw2Fetch<TokenInfoResponse>(endpoints.tokenInfo, { apiKey }),
    enabled: !!apiKey,
    ...opts,
  });
}
