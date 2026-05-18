import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/orientation')({
  component: OrientationPage,
});

function OrientationPage() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28 }}>Orientation</h1>
      <p style={{ color: 'var(--muted)' }}>
        Coming soon — port of the 5-state orientation prototype (O1–O5: Fresh 80 → all DLCs).
        Will use the recommendation engine state machine to drive which state to show.
      </p>
    </div>
  );
}
