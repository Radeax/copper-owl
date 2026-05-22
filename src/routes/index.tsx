import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { useAuthStore } from '@/state/auth';
import { useGW2Account, useGW2Characters } from '@/api/gw2';
import { transformGW2Account } from '@/api/transform';
import { classifyArchetype } from '@/engine/archetypes';

export const Route = createFileRoute('/')({
  component: IndexDispatcher,
});

// The root route dispatches based on session mode + archetype:
//   - no session                            → /welcome
//   - anonymous session, profile present    → archetype-based route
//   - anonymous session, no profile         → /start (recover mid-flow)
//   - api_key / gw2me session               → archetype-based route after fetch
//
// The "archetype-based route" is: fresh_80 → /orientation, everything else → /home.
function IndexDispatcher() {
  const navigate = useNavigate();
  const session = useAuthStore((s) => s.session);
  const anonymousProfile = useAuthStore((s) => s.anonymousProfile);
  const apiKey = session?.apiKey;
  const isAnonymous = session?.mode === 'anonymous';

  useEffect(() => {
    if (!session) {
      void navigate({ to: '/welcome', replace: true });
    } else if (isAnonymous && !anonymousProfile) {
      void navigate({ to: '/start', replace: true });
    }
  }, [session, isAnonymous, anonymousProfile, navigate]);

  // Anonymous path: archetype is the explicit choice from /start.
  useEffect(() => {
    if (!isAnonymous || !anonymousProfile) return;
    void navigate({
      to: anonymousProfile.archetype === 'fresh_80' ? '/orientation' : '/home',
      replace: true,
    });
  }, [isAnonymous, anonymousProfile, navigate]);

  // API path: fetch, classify, route.
  const accountQuery = useGW2Account(isAnonymous ? undefined : apiKey);
  const charsQuery = useGW2Characters(isAnonymous ? undefined : apiKey);

  const archetype = useMemo(() => {
    if (isAnonymous) return null;
    if (!accountQuery.data || !charsQuery.data) return null;
    const account = transformGW2Account(accountQuery.data, charsQuery.data);
    return classifyArchetype(account);
  }, [isAnonymous, accountQuery.data, charsQuery.data]);

  useEffect(() => {
    if (isAnonymous) return;
    if (accountQuery.error || charsQuery.error) {
      void navigate({ to: '/home', replace: true });
    }
  }, [isAnonymous, accountQuery.error, charsQuery.error, navigate]);

  useEffect(() => {
    if (!archetype) return;
    void navigate({
      to: archetype === 'fresh_80' ? '/orientation' : '/home',
      replace: true,
    });
  }, [archetype, navigate]);

  return null;
}
