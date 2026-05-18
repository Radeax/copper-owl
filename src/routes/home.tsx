import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { recommend } from '@/engine/recommend';
import { useReset } from '@/utils/useReset';
import { RecommendationCard } from '@/components/cards/RecommendationCard';
import { ResetClock } from '@/components/cards/ResetClock';
import type { AccountState } from '@/types/domain';
import styles from './home.module.css';

export const Route = createFileRoute('/home')({
  component: HomePage,
});

// Mock account for scaffolding — engaged committed player.
// Will be replaced with real GW2 API data via useGW2Account/useGW2Characters.
const MOCK_ACCOUNT: AccountState = {
  name: 'Stormrider.6048',
  ageDays: 1200,
  daysSinceLastLogin: 1,
  expansions: {
    hot: true,
    pof: true,
    eod: true,
    soto: true,
    jw: true,
    voe: true,
  },
  characters: [
    {
      name: 'Bone Empress',
      level: 80,
      profession: 'Necromancer',
      lastModified: new Date().toISOString(),
    },
  ],
  wallet: {},
  masteries: null,
};

function HomePage() {
  const reset = useReset();

  // The engine is a pure function — memoize on its inputs. The React Compiler
  // would also hoist this, but explicit useMemo is fine and clearer here.
  const { archetype, recommendations } = useMemo(
    () => recommend({ account: MOCK_ACCOUNT, reset }),
    [reset]
  );

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>🦉</span>
          <span className={styles.brandName}>COPPER OWL</span>
        </div>
        <h1 className={styles.welcome}>
          What this session is for
        </h1>
        <p className={styles.account}>
          {MOCK_ACCOUNT.name} · <span className={styles.archetype}>{archetype.replace('_', ' ')}</span>
        </p>
      </header>

      <section className={styles.clockBand}>
        <ResetClock />
      </section>

      <section className={styles.recs}>
        {recommendations.map((rec) => (
          <RecommendationCard key={rec.id} recommendation={rec} />
        ))}
      </section>

      <footer className={styles.foot}>
        <p>
          Scaffolding mode · using mock account data. Real GW2 API integration
          replaces this view when an API key or gw2.me session is connected.
        </p>
      </footer>
    </div>
  );
}
