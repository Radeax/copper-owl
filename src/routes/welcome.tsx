import { createFileRoute, useNavigate } from '@tanstack/react-router';
import styles from './welcome.module.css';

export const Route = createFileRoute('/welcome')({
  component: WelcomePage,
});

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>🦉</span>
          <span className={styles.brandName}>COPPER OWL</span>
        </div>
        <h1 className={styles.title}>What should you do next?</h1>
        <p className={styles.sub}>
          A calm companion for Guild Wars 2. Tells you what to focus on this session, why it
          matters, and what you can skip without guilt.
        </p>
      </header>

      <section className={styles.modes}>
        <h2 className={styles.sectionLabel}>Choose how to start</h2>

        <button
          className={styles.mode}
          onClick={() => navigate({ to: '/orientation' })}
        >
          <div className={styles.modeEyebrow}>Anonymous</div>
          <div className={styles.modeTitle}>Browse without connecting</div>
          <div className={styles.modeDesc}>
            Pick your profile manually. No account, no API key, no tracking.
          </div>
        </button>

        <button
          className={`${styles.mode} ${styles.modeRecommended}`}
          onClick={() => navigate({ to: '/home' })}
        >
          <div className={styles.modeEyebrow}>Recommended · API key</div>
          <div className={styles.modeTitle}>Paste a read-only API key</div>
          <div className={styles.modeDesc}>
            Get personalized recommendations based on your account. Generated at
            account.arena.net, read-only, stays on your device.
          </div>
        </button>

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
