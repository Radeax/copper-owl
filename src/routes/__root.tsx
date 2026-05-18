import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Suspense, lazy } from 'react';

// Devtools are dev-only — Vite tree-shakes them out of production builds
const TanStackRouterDevtools =
  import.meta.env.PROD
    ? () => null
    : lazy(() =>
        import('@tanstack/react-router-devtools').then((mod) => ({
          default: mod.TanStackRouterDevtools,
        }))
      );

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <Outlet />
      <Suspense fallback={null}>
        <TanStackRouterDevtools position="bottom-right" />
      </Suspense>
    </>
  );
}
