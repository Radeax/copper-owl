import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ApiKeyEntry } from '@/components/auth/ApiKeyEntry';
import styles from './welcome.module.css';

export const Route = createFileRoute('/welcome')({
  component: WelcomePage,
});

function WelcomePage() {
  const navigate = useNavigate();
  const [showKeyEntry, setShowKeyEntry] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>🦉</span>
          <span className={styles.brandName}>COPPER OWL</span>
        </div>
        <h1 className={styles.title}>What should you do next?</h1>
        <p className={styles.sub}>Not sure where to start? Here&apos;s what&apos;s worth your session.</p>
      </header>

      <section className={styles.modes}>
        <h2 className={styles.sectionLabel}>Choose how to start</h2>

        <button
          className={styles.mode}
          onClick={() => navigate({ to: '/start' })}
        >
          <div className={styles.modeEyebrow}>Anonymous</div>
          <div className={styles.modeTitle}>Browse without connecting</div>
          <div className={styles.modeDesc}>
            Pick a profile manually. No account, no API key, no tracking.
          </div>
        </button>

        <div className={styles.modeWrapper}>
          <button
            className={`${styles.mode} ${styles.modeRecommended}${showKeyEntry ? ` ${styles.modeRecommendedOpen}` : ''}`}
            onClick={() => setShowKeyEntry((s) => !s)}
            aria-expanded={showKeyEntry}
          >
            <div className={styles.modeEyebrow}>Recommended · API key</div>
            <div className={styles.modeTitle}>Paste a read-only API key</div>
            <div className={styles.modeDesc}>
              Get personalized recommendations based on your account. Generated at
              account.arena.net, read-only, stays on your device.
            </div>
          </button>
          {showKeyEntry && (
            <div className={styles.keyEntryPanel}>
              <ApiKeyEntry onSuccess={() => navigate({ to: '/home' })} />
            </div>
          )}
        </div>

        <button
          className={styles.mode}
          onClick={() => navigate({ to: '/orientation' })}
        >
          <div className={styles.modeEyebrow}>OAuth</div>
          <div className={styles.modeTitle}>Sign in with gw2.me</div>
          <div className={styles.modeDesc}>
            Community OAuth — no API key handling, scope-limited access.
          </div>
        </button>
      </section>
    </div>
  );
}
