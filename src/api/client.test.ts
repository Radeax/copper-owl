import { describe, it, expect, beforeEach, vi } from 'vitest';
import { gw2Fetch } from './client';

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
