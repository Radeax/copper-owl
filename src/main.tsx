import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { routeTree } from './routeTree.gen';
import './styles/tokens.css';

// Bootstrap rule registry. The example placeholder rules always register
// first as a safe default. If the private @copper-owl/rules package is
// installed (the curated production rule set), its module-load side
// effect calls registerRuleSet() and overrides the example placeholders.
import './engine/rules/example';

// Optional load of the private rule package. When @copper-owl/rules isn't
// installed, vite.config.ts stubs the module so Rollup can resolve the import
// at build time. The try/catch handles any remaining runtime failures.
async function loadPrivateRules(): Promise<void> {
  try {
    await import('@copper-owl/rules');
  } catch {
    // Private package not installed — the example rules registered above
    // remain in effect. This is the expected path for public/contributor
    // clones.
  }
}
void loadPrivateRules();

// TanStack Query — server state (GW2 API responses)
// Defaults tuned for GW2's rate-limited API: keep cache long, refetch on focus
// only when stale, avoid retry storms when rate-limited.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error) => {
        // Don't retry 4xx errors (auth/permission issues)
        if (error instanceof Error && /4\d{2}/.test(error.message)) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});

// TanStack Router — file-based routing
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
