import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // TODO: route to /home if authed, /welcome if not. For now: welcome.
    throw redirect({ to: '/welcome' });
  },
});
