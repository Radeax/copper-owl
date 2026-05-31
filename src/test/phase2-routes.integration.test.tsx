/**
 * Route-level integration harness for PRD 0003 Phase 2.
 *
 * Drives the real router (routeTree.gen) + TanStack Query + the auth store, with
 * the GW2 API stubbed via the committed fixtures, to cover the end-to-end UI
 * states that the per-piece unit tests can't reach on their own:
 *
 *   - welcome → key entry → dispatch → /home (the happy path)
 *   - the loading skeleton (piece #6)
 *   - the dispatcher's fetch → classify → route step
 *   - the /home error/warning bands: auth 401, 429 rate-limit (#4),
 *     network/5xx (#5), and missing-scope (#3)
 *
 * This is the automated half of piece #7. It runs against fixtures, not the
 * live API, so it does NOT replace the manual real-key pass (which verifies
 * recommendations against an actual account, visual layout, and screen-reader
 * behaviour). It exists to lock the branching so a regression can't silently
 * route a state to the wrong surface.
 *
 * Fixture note: the account is fed back with a fresh `last_modified` so
 * `daysSinceLastLogin ≈ 0` regardless of when the suite runs — that keeps the
 * archetype deterministic (engaged_*, never drifting to returning/fresh_80 as
 * real time passes). From the API path `pursuingGoal` is null, so it resolves
 * to engaged_casual; either way it routes to /home, which is what we assert.
 * With no private @copper-owl/rules installed, /home shows the example
 * "Connect a rule provider" card, so assertions target the account name, the
 * archetype label, an <article>, and band copy — never specific rule prose.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, createMemoryHistory, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';
import { useAuthStore } from '@/state/auth';
// Register the example rules via side-effect import, exactly as main.tsx does
// at startup (see the module note above on why the example set is the fallback).
import '@/engine/rules/example';

import accountFixture from '@/api/__fixtures__/account-engaged-committed.json';
import charactersFixture from '@/api/__fixtures__/characters-engaged-committed.json';
import tokeninfoFull from '@/api/__fixtures__/tokeninfo-full-scopes.json';
import tokeninfoMissingProgression from '@/api/__fixtures__/tokeninfo-missing-progression.json';

const API_KEY = 'integration-test-key';

// ─── Fetch stubbing ────────────────────────────────────────────────
interface ResSpec {
  status?: number;
  body?: unknown;
  headers?: Record<string, string>;
}

function res({ status = 200, body = {}, headers = {} }: ResSpec) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: String(status),
    headers: { get: (name: string) => headers[name] ?? null },
    json: async () => body,
  } as unknown as Response;
}

/** Account body fed back with a current last_modified → daysSinceLastLogin ≈ 0. */
function accountOk() {
  return { ...accountFixture, last_modified: new Date().toISOString() };
}

type Handler = (path: string) => Response | Promise<Response>;

function installFetch(handler: Handler) {
  const mock = vi.fn((input: unknown) => {
    const path = new URL(String(input)).pathname;
    return Promise.resolve(handler(path));
  });
  vi.stubGlobal('fetch', mock);
  return mock;
}

/** The common success handler: account + characters + (configurable) tokeninfo. */
function successHandler(tokeninfo: unknown = tokeninfoFull): Handler {
  return (path) => {
    if (path === '/v2/account') return res({ body: accountOk() });
    if (path === '/v2/characters') return res({ body: charactersFixture });
    if (path === '/v2/tokeninfo') return res({ body: tokeninfo });
    return res({ body: {} });
  };
}

// ─── Render harness ────────────────────────────────────────────────
function renderAt(initialPath: string) {
  const queryClient = new QueryClient({
    // retry:false so error branches resolve to their terminal UX immediately
    // (the retry-then-exhaust policy lives in main.tsx and is its own concern).
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router as never} />
    </QueryClientProvider>
  );
}

function seedApiKeySession() {
  useAuthStore.getState().setApiKey(API_KEY);
}

afterEach(() => {
  cleanup();
  useAuthStore.getState().signOut();
  localStorage.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  // The gw2Queue token bucket is a singleton that persists across tests, but it
  // starts at 300 tokens and every request here resolves immediately against
  // the stubbed fetch, so the suite never depletes it — no reset needed.
});

// ─── Happy path: welcome → key entry → dispatch → /home ─────────────
describe('Phase 2 routes — happy path', () => {
  it('drives the welcome key-entry form through to real /home content', async () => {
    installFetch(successHandler());
    renderAt('/welcome');

    // Expand the API-key panel and submit a well-formed key. The first query is
    // awaited so the router has finished its initial (async) route load.
    fireEvent.click(await screen.findByText('Paste a read-only API key'));
    const input = await screen.findByLabelText('GW2 API key');
    fireEvent.change(input, {
      target: { value: 'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE-FFFF-1111-2222-333333333333' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Connect' }));

    // Lands on /home with the real account name + a rendered recommendation card.
    // Reaching the success surface (account name + cards) is itself the proof
    // the welcome→entry→dispatch→home flow completed.
    expect(await screen.findByText(/TestAccount\.1234/)).toBeInTheDocument();
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
  });

  it('shows the loading skeleton while the account fetch is in flight', async () => {
    let resolveAccount: () => void = () => {};
    const gate = new Promise<void>((r) => {
      resolveAccount = r;
    });
    installFetch((path) => {
      if (path === '/v2/account') return gate.then(() => res({ body: accountOk() }));
      if (path === '/v2/characters') return res({ body: charactersFixture });
      if (path === '/v2/tokeninfo') return res({ body: tokeninfoFull });
      return res({ body: {} });
    });
    seedApiKeySession();
    renderAt('/home');

    // Skeleton + its screen-reader announcement appear before data resolves.
    expect(await screen.findByText('Reading account state…')).toBeInTheDocument();

    // Resolve the fetch → skeleton gives way to real content in place.
    await act(async () => {
      resolveAccount();
    });
    expect(await screen.findByText(/TestAccount\.1234/)).toBeInTheDocument();
  });
});

// ─── Dispatcher: fetch → classify → route ───────────────────────────
describe('Phase 2 routes — dispatcher', () => {
  it('classifies an API-key account and routes it to /home', async () => {
    installFetch(successHandler());
    seedApiKeySession();
    renderAt('/');

    // engaged_* (pursuingGoal null from API → engaged_casual) routes to /home;
    // the account name only renders on the /home success surface, so its
    // presence is the proof the dispatcher fetched, classified, and routed.
    expect(await screen.findByText(/TestAccount\.1234/)).toBeInTheDocument();
  });
});

// ─── /home error + warning bands ────────────────────────────────────
describe('Phase 2 routes — /home status bands', () => {
  it('surfaces the auth-error band on a 401', async () => {
    installFetch((path) => {
      if (path === '/v2/account' || path === '/v2/characters') {
        return res({ status: 401, body: { text: 'invalid key' } });
      }
      return res({ body: tokeninfoFull });
    });
    seedApiKeySession();
    renderAt('/home');

    expect(await screen.findByText(/did not authenticate/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try a different key' })).toBeInTheDocument();
  });

  it('surfaces the 429 rate-limit band with a countdown (piece #4)', async () => {
    installFetch(() => res({ status: 429, headers: { 'Retry-After': '30' }, body: { text: 'slow down' } }));
    seedApiKeySession();
    renderAt('/home');

    expect(await screen.findByText(/Rate limit hit/)).toBeInTheDocument();
    expect(screen.getByText(/Retrying in/)).toBeInTheDocument();
  });

  it('surfaces the network band and retries on demand (piece #5)', async () => {
    let down = true;
    const mock = vi.fn((input: unknown) => {
      const path = new URL(String(input)).pathname;
      if (down && (path === '/v2/account' || path === '/v2/characters')) {
        return Promise.reject(new TypeError('Failed to fetch'));
      }
      return Promise.resolve(successHandler()(path));
    });
    vi.stubGlobal('fetch', mock);
    seedApiKeySession();
    renderAt('/home');

    expect(await screen.findByText(/return account data/)).toBeInTheDocument();
    const retry = screen.getByRole('button', { name: 'Try again' });

    // Network recovers, manual retry refetches, real content lands.
    down = false;
    fireEvent.click(retry);
    expect(await screen.findByText(/TestAccount\.1234/)).toBeInTheDocument();
  });

  it('surfaces the scope warning when progression is missing (piece #3)', async () => {
    installFetch(successHandler(tokeninfoMissingProgression));
    seedApiKeySession();
    renderAt('/home');

    // Content still renders (non-blocking), with the permissions band above it.
    expect(await screen.findByText(/TestAccount\.1234/)).toBeInTheDocument();
    expect(screen.getByText('API KEY · PERMISSIONS')).toBeInTheDocument();
    // Assert the warning body actually rendered, not just the label — guards
    // against the band showing with empty children (scopeWarningCopy regression).
    expect(screen.getByText(/will be skipped/)).toBeInTheDocument();
  });
});
