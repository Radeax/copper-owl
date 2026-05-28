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

/**
 * Pin to a specific GW2 API schema version. ArenaNet's API uses schema versioning
 * to prevent surprise breaking changes: fields like last_modified on /v2/account
 * and /v2/characters only appear when an explicit schema version is requested.
 *
 * 2022-03-23T19:00:00.000Z is post-EoD release, well past the 2019-02-21 schema
 * that introduced last_modified, and includes EoD content schemas the engine
 * will need. Bump when ArenaNet ships a meaningful new schema version Copper
 * Owl wants to consume.
 *
 * Reference: https://wiki.guildwars2.com/wiki/API:2
 */
const GW2_SCHEMA_VERSION = '2022-03-23T19:00:00.000Z';

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
  /** Optional API key. If provided, sent as the ?access_token= query param. */
  apiKey?: string;
  /** Optional language (e.g. 'en', 'de', 'fr'). Sent as the ?lang= query param. */
  lang?: string;
  /** AbortSignal for cancellation. */
  signal?: AbortSignal;
}

/**
 * Fetch a GW2 API endpoint. Path is relative to https://api.guildwars2.com
 * (e.g. '/v2/account', '/v2/characters'). May include a query string
 * (e.g. '/v2/characters?ids=all'); existing params are preserved. Returns
 * parsed JSON.
 *
 * CORS contract — DO NOT BREAK:
 * The GW2 API does not respond to CORS preflight (OPTIONS), so any non-
 * safelisted request header causes the browser to fail the request before
 * it leaves. That means auth and schema-version cannot be sent as
 * Authorization or X-Schema-Version headers — they go in the query string
 * as ?access_token= and ?v=, per ArenaNet's documented browser-safe method.
 * Accept: application/json is CORS-safelisted and is the only header sent.
 * If you find yourself wanting to add a header here, route it through the
 * query string instead, or the web build will break.
 */
export async function gw2Fetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  // Wait for a rate-limit token before sending
  await gw2Queue.acquire();

  const url = new URL(path, GW2_API_BASE);
  url.searchParams.set('v', GW2_SCHEMA_VERSION);
  if (options.apiKey) {
    url.searchParams.set('access_token', options.apiKey);
  }
  if (options.lang) {
    url.searchParams.set('lang', options.lang);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
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
