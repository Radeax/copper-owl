import { describe, it, expect, beforeEach, vi } from 'vitest';
import { gw2Fetch, GW2ApiError } from './client';

/**
 * These tests pin the CORS contract documented above gw2Fetch in client.ts:
 * the GW2 API rejects preflight, so auth and schema-version MUST be query
 * params, not headers. The assertions are deliberately worded as positive
 * AND negative (e.g. "access_token in URL" AND "Authorization not in
 * headers"), so reverting either half regresses a test.
 */

function mockFetch(body: unknown = {}, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: 'OK',
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function urlFromCall(fetchMock: ReturnType<typeof vi.fn>): URL {
  const arg = fetchMock.mock.calls[0]?.[0];
  return new URL(String(arg));
}

function headersFromCall(fetchMock: ReturnType<typeof vi.fn>): Record<string, string> {
  const init = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
  return (init?.headers ?? {}) as Record<string, string>;
}

describe('gw2Fetch — CORS contract', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends schema version as ?v= query param, not as X-Schema-Version header', async () => {
    const fetchMock = mockFetch({ name: 'test' });
    await gw2Fetch('/v2/account', { apiKey: 'KEY' });
    const url = urlFromCall(fetchMock);
    const headers = headersFromCall(fetchMock);

    expect(url.searchParams.get('v')).toBe('2022-03-23T19:00:00.000Z');
    expect(headers).not.toHaveProperty('X-Schema-Version');
  });

  it('sends API key as ?access_token= query param, not as Authorization header', async () => {
    const fetchMock = mockFetch({ name: 'test' });
    await gw2Fetch('/v2/account', { apiKey: 'KEY' });
    const url = urlFromCall(fetchMock);
    const headers = headersFromCall(fetchMock);

    expect(url.searchParams.get('access_token')).toBe('KEY');
    expect(headers).not.toHaveProperty('Authorization');
  });

  it('preserves pre-existing query params on the path (e.g. ?ids=all)', async () => {
    const fetchMock = mockFetch([]);
    await gw2Fetch('/v2/characters?ids=all', { apiKey: 'KEY' });
    const url = urlFromCall(fetchMock);

    expect(url.searchParams.get('ids')).toBe('all');
    expect(url.searchParams.get('access_token')).toBe('KEY');
    expect(url.searchParams.get('v')).toBe('2022-03-23T19:00:00.000Z');
  });

  it('sends lang as ?lang= query param, not as Accept-Language header', async () => {
    const fetchMock = mockFetch({});
    await gw2Fetch('/v2/account', { apiKey: 'KEY', lang: 'de' });
    const url = urlFromCall(fetchMock);
    const headers = headersFromCall(fetchMock);

    expect(url.searchParams.get('lang')).toBe('de');
    expect(headers).not.toHaveProperty('Accept-Language');
  });

  it('sends only Accept: application/json as a request header (CORS-safelisted)', async () => {
    const fetchMock = mockFetch({});
    await gw2Fetch('/v2/account', { apiKey: 'KEY', lang: 'en' });
    const headers = headersFromCall(fetchMock);

    expect(headers).toEqual({ Accept: 'application/json' });
  });

  it('omits ?access_token when no apiKey is provided', async () => {
    const fetchMock = mockFetch({});
    await gw2Fetch('/v2/build');
    const url = urlFromCall(fetchMock);

    expect(url.searchParams.has('access_token')).toBe(false);
    expect(url.searchParams.get('v')).toBe('2022-03-23T19:00:00.000Z');
  });

  it('targets the GW2 API host', async () => {
    const fetchMock = mockFetch({});
    await gw2Fetch('/v2/account', { apiKey: 'KEY' });
    const url = urlFromCall(fetchMock);

    expect(url.origin).toBe('https://api.guildwars2.com');
    expect(url.pathname).toBe('/v2/account');
  });
});

/** Await a gw2Fetch call expected to reject, returning the typed error. */
async function captureError(p: Promise<unknown>): Promise<GW2ApiError> {
  try {
    await p;
  } catch (e) {
    return e as GW2ApiError;
  }
  throw new Error('expected gw2Fetch to reject, but it resolved');
}

/**
 * Mock an error response with a controllable Retry-After header. The header
 * getter is case-insensitive on a real Headers object; the production code
 * reads 'Retry-After', so the mock keys on that exact name.
 */
function mockErrorResponse(status: number, retryAfter: string | null = null) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: false,
    status,
    statusText: 'Too Many Requests',
    headers: { get: (name: string) => (name === 'Retry-After' ? retryAfter : null) },
    json: vi.fn().mockResolvedValue({ text: 'too many requests' }),
  } as unknown as Response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('gw2Fetch — 429 Retry-After handling', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('parses Retry-After seconds into GW2ApiError.retryAfterSeconds on a 429', async () => {
    mockErrorResponse(429, '30');
    const err = await captureError(gw2Fetch('/v2/account', { apiKey: 'KEY' }));

    expect(err).toBeInstanceOf(GW2ApiError);
    expect(err.code).toBe('rate_limited');
    expect(err.retryAfterSeconds).toBe(30);
  });

  it('leaves retryAfterSeconds undefined when a 429 carries no Retry-After header', async () => {
    mockErrorResponse(429, null);
    const err = await captureError(gw2Fetch('/v2/account', { apiKey: 'KEY' }));

    expect(err).toBeInstanceOf(GW2ApiError);
    expect(err.code).toBe('rate_limited');
    expect(err.retryAfterSeconds).toBeUndefined();
  });

  it('ignores an unparseable Retry-After value', async () => {
    mockErrorResponse(429, 'Wed, 21 Oct 2026 07:28:00 GMT');
    const err = await captureError(gw2Fetch('/v2/account', { apiKey: 'KEY' }));

    expect(err.retryAfterSeconds).toBeUndefined();
  });

  it('does not attach retryAfterSeconds to non-429 errors', async () => {
    // A 500 with a stray Retry-After header should not surface a countdown.
    mockErrorResponse(500, '30');
    const err = await captureError(gw2Fetch('/v2/account', { apiKey: 'KEY' }));

    expect(err.code).toBe('server');
    expect(err.retryAfterSeconds).toBeUndefined();
  });
});
