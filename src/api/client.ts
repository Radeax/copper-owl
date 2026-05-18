/**
 * GW2 API client.
 *
 * Thin typed wrapper around fetch() that:
 *   1. Goes through the rate-limit queue (gw2Queue.acquire)
 *   2. Attaches the API key from session when present
 *   3. Translates HTTP errors into typed exceptions the UI can surface
 *
 * Pairs with TanStack Query for caching, retry, and refetch behavior —
 * see src/api/gw2.ts for the query-key conventions and hooks.
 */

import { gw2Queue } from './queue';

const GW2_API_BASE = 'https://api.guildwars2.com';

export class GW2ApiError extends Error {
  public readonly status: number;
  public readonly code: 'unauthorized' | 'forbidden' | 'rate_limited' | 'server' | 'network' | 'unknown';

  constructor(message: string, status: number, code: GW2ApiError['code']) {
    super(message);
    this.name = 'GW2ApiError';
    this.status = status;
    this.code = code;
  }
}

export interface FetchOptions {
  /** Optional API key. If provided, sent as Authorization: Bearer header. */
  apiKey?: string;
  /** Optional Accept-Language header (e.g. 'en', 'de', 'fr'). */
  lang?: string;
  /** AbortSignal for cancellation. */
  signal?: AbortSignal;
}

/**
 * Fetch a GW2 API endpoint. Path is relative to https://api.guildwars2.com
 * (e.g. '/v2/account', '/v2/characters'). Returns parsed JSON.
 */
export async function gw2Fetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  // Wait for a rate-limit token before sending
  await gw2Queue.acquire();

  const url = `${GW2_API_BASE}${path}`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (options.apiKey) {
    headers.Authorization = `Bearer ${options.apiKey}`;
  }
  if (options.lang) {
    headers['Accept-Language'] = options.lang;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers,
      signal: options.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err;
    throw new GW2ApiError(
      `Network error fetching ${path}`,
      0,
      'network'
    );
  }

  if (!response.ok) {
    const code = errorCodeForStatus(response.status);
    let detail = response.statusText;
    try {
      const body = (await response.json()) as { text?: string };
      if (body?.text) detail = body.text;
    } catch {
      // Body wasn't JSON — ignore, use statusText
    }
    throw new GW2ApiError(
      `GW2 API ${response.status}: ${detail}`,
      response.status,
      code
    );
  }

  return (await response.json()) as T;
}

function errorCodeForStatus(status: number): GW2ApiError['code'] {
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 429) return 'rate_limited';
  if (status >= 500) return 'server';
  return 'unknown';
}
