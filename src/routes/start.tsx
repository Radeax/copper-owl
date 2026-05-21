import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  ALL_EXPANSIONS,
  NO_EXPANSIONS,
  useAuthStore,
  type AnonymousProfile,
  type ExpansionFlags,
} from '@/state/auth';
import styles from './start.module.css';

export const Route = createFileRoute('/start')({
  component: StartPage,
});

// ─── Card kinds (the user-facing taxonomy) ─────────────────────────
type CardKey = 'fresh' | 'returning' | 'active' | 'f2p';

interface CardSpec {
  key: CardKey;
  eyebrow: string;
  title: string;
  sub: string;
}

const CARDS: ReadonlyArray<CardSpec> = [
  {
    key: 'fresh',
    eyebrow: 'Fresh at level 80',
    title: 'Hit max recently, looking for what comes next',
    sub: 'The Personal Story is done (or close), an expansion or two is unlocked, and the question is where to go next.',
  },
  {
    key: 'returning',
    eyebrow: 'Returning after a break',
    title: 'Played before, drifted away, catching up',
    sub: 'A familiar account with a gap. The recommendations focus on what changed and what is still relevant.',
  },
  {
    key: 'active',
    eyebrow: 'Active player',
    title: 'Playing regularly, here for session planning',
    sub: 'Logging in often. Recommendations focus on weeklies, goal pursuit, and reset-aware decisions.',
  },
  {
    key: 'f2p',
    eyebrow: 'Free account',
    title: 'No expansions yet, exploring what the game offers',
    sub: 'Core Tyria plus Living World Season 1. Everything free, everything tagged as such.',
  },
];

const EXPANSION_LIST: ReadonlyArray<{ key: keyof ExpansionFlags; label: string }> = [
  { key: 'hot', label: 'Heart of Thorns' },
  { key: 'pof', label: 'Path of Fire' },
  { key: 'eod', label: 'End of Dragons' },
  { key: 'soto', label: 'Secrets of the Obscure' },
  { key: 'jw', label: 'Janthir Wilds' },
  { key: 'voe', label: 'Visions of Eternity' },
];

type GapBucket = 90 | 365 | 700;
const GAP_BUCKETS: ReadonlyArray<{ value: GapBucket; main: string; meta: string }> = [
  { value: 90, main: '2 to 6 months', meta: 'Familiar systems, some patch context to catch up on' },
  { value: 365, main: '6 months to 1.5 years', meta: 'A full content cycle since the last session' },
  { value: 700, main: 'Over 1.5 years', meta: 'Several expansions and seasonal cycles to reorient' },
];

/** True when at least one expansion flag is set. */
function hasAnyExpansion(flags: ExpansionFlags): boolean {
  return Object.values(flags).some(Boolean);
}

/**
 * Narrow a persisted daysSinceLastLogin back to a gap bucket. Returns null
 * for any value that isn't an exact bucket — a corrupted or older persisted
 * profile must not seed the radio group with an unselectable value.
 */
function toGapBucket(value: number | undefined): GapBucket | null {
  return GAP_BUCKETS.some((b) => b.value === value) ? (value as GapBucket) : null;
}

// ─── Page component ────────────────────────────────────────────────
function StartPage() {
  const navigate = useNavigate();
  const setAnonymousProfile = useAuthStore((s) => s.setAnonymousProfile);
  const existingProfile = useAuthStore((s) => s.anonymousProfile);

  // Pre-select the existing profile's card when revisiting /start.
  const initialKey = useMemo<CardKey | null>(() => {
    if (!existingProfile) return null;
    switch (existingProfile.archetype) {
      case 'fresh_80':
        return 'fresh';
      case 'returning':
        return 'returning';
      case 'engaged_casual':
      case 'engaged_committed':
        return 'active';
      case 'f2p_explorer':
        return 'f2p';
      default:
        return null;
    }
  }, [existingProfile]);

  const [selected, setSelected] = useState<CardKey | null>(initialKey);

  // Per-card form state. Initialise from existing profile when the
  // matching card is pre-selected; otherwise sensible defaults.
  const seed = (key: CardKey) => (initialKey === key ? existingProfile : null);

  const [freshExpansions, setFreshExpansions] = useState<ExpansionFlags>(
    seed('fresh')?.expansions ?? { ...NO_EXPANSIONS, hot: true, pof: true }
  );
  const [gap, setGap] = useState<GapBucket | null>(
    toGapBucket(seed('returning')?.daysSinceLastLogin)
  );
  const [activeExpansions, setActiveExpansions] = useState<ExpansionFlags>(
    seed('active')?.expansions ?? { ...ALL_EXPANSIONS }
  );
  const [pursuingGoal, setPursuingGoal] = useState<boolean | null>(
    seed('active')?.pursuingGoal ?? null
  );
  const [f2pHasMaxLevel, setF2pHasMaxLevel] = useState<boolean | null>(
    seed('f2p')?.hasMaxLevel ?? null
  );

  function toggleExpansion(
    state: ExpansionFlags,
    key: keyof ExpansionFlags,
    setter: (next: ExpansionFlags) => void
  ) {
    const next = { ...state, [key]: !state[key] };
    // PoF bundles HoT — checking PoF forces HoT on; unchecking PoF leaves HoT alone.
    if (key === 'pof' && next.pof) next.hot = true;
    setter(next);
  }

  function reset() {
    setSelected(null);
  }

  function submit() {
    if (!selected) return;
    const profile = buildProfileFromForm();
    if (!profile) return;
    setAnonymousProfile(profile);
    void navigate({
      to: profile.archetype === 'fresh_80' ? '/orientation' : '/home',
      replace: true,
    });
  }

  function buildProfileFromForm(): AnonymousProfile | null {
    switch (selected) {
      case 'fresh':
        // A fresh_80 profile with no expansions classifies as f2p_explorer,
        // contradicting the stored archetype. Require at least one expansion
        // — this also disables Continue via canSubmit.
        if (!hasAnyExpansion(freshExpansions)) return null;
        return {
          archetype: 'fresh_80',
          expansions: freshExpansions,
          daysSinceLastLogin: 30,
          hasMaxLevel: true,
        };
      case 'returning':
        if (gap === null) return null;
        return {
          archetype: 'returning',
          expansions: ALL_EXPANSIONS,
          daysSinceLastLogin: gap,
          hasMaxLevel: true,
        };
      case 'active':
        if (pursuingGoal === null) return null;
        return {
          archetype: pursuingGoal ? 'engaged_committed' : 'engaged_casual',
          expansions: activeExpansions,
          daysSinceLastLogin: 1,
          hasMaxLevel: true,
          pursuingGoal,
        };
      case 'f2p':
        if (f2pHasMaxLevel === null) return null;
        return {
          archetype: 'f2p_explorer',
          expansions: NO_EXPANSIONS,
          daysSinceLastLogin: 1,
          hasMaxLevel: f2pHasMaxLevel,
        };
      default:
        return null;
    }
  }

  const canSubmit = buildProfileFromForm() !== null;

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>🦉</span>
          <span className={styles.brandName}>COPPER OWL</span>
        </div>
        <h1 className={styles.title}>Tell Copper Owl about your account</h1>
        <p className={styles.sub}>
          Four common starting points. Pick the one that fits closest — adjustments come later.
        </p>
      </header>

      <div className={styles.cards}>
        {CARDS.map((card) => {
          const isSelected = selected === card.key;
          const isDimmed = selected !== null && !isSelected;
          const className = [
            styles.card,
            isSelected && styles.cardSelected,
            isDimmed && styles.cardDimmed,
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <div key={card.key} className={className}>
              <button
                type="button"
                className={styles.cardButton}
                onClick={() => setSelected(card.key)}
                aria-expanded={isSelected}
              >
                <div className={styles.cardEyebrow}>{card.eyebrow}</div>
                <div className={styles.cardTitle}>{card.title}</div>
                <div className={styles.cardSub}>{card.sub}</div>
              </button>
              {isSelected && (
                <div className={styles.followup}>
                  {card.key === 'fresh' && (
                    <FreshFollowup
                      expansions={freshExpansions}
                      onToggle={(k) =>
                        toggleExpansion(freshExpansions, k, setFreshExpansions)
                      }
                    />
                  )}
                  {card.key === 'returning' && (
                    <ReturningFollowup gap={gap} onPick={setGap} />
                  )}
                  {card.key === 'active' && (
                    <ActiveFollowup
                      expansions={activeExpansions}
                      onToggle={(k) =>
                        toggleExpansion(activeExpansions, k, setActiveExpansions)
                      }
                      pursuingGoal={pursuingGoal}
                      onPursue={setPursuingGoal}
                    />
                  )}
                  {card.key === 'f2p' && (
                    <F2pFollowup hasMaxLevel={f2pHasMaxLevel} onSet={setF2pHasMaxLevel} />
                  )}
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.continueBtn}
                      disabled={!canSubmit}
                      onClick={submit}
                    >
                      Continue
                    </button>
                    <button type="button" className={styles.deselectLink} onClick={reset}>
                      Pick a different starting point
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Per-archetype follow-up components ────────────────────────────
interface ExpansionGridProps {
  expansions: ExpansionFlags;
  onToggle: (key: keyof ExpansionFlags) => void;
}

function ExpansionGrid({ expansions, onToggle }: ExpansionGridProps) {
  return (
    <div className={styles.checkGrid}>
      {EXPANSION_LIST.map(({ key, label }) => {
        // HoT locks when PoF is checked (PoF bundles HoT per the GW2 model).
        const locked = key === 'hot' && expansions.pof;
        const checked = expansions[key];
        const className = [
          styles.check,
          checked && styles.checkChecked,
          locked && styles.checkLocked,
        ]
          .filter(Boolean)
          .join(' ');
        return (
          <label key={key} className={className}>
            <input
              type="checkbox"
              className={styles.checkInput}
              checked={checked}
              disabled={locked}
              onChange={() => onToggle(key)}
            />
            <span>{label}</span>
          </label>
        );
      })}
    </div>
  );
}

interface FollowupBlockProps {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}

function FollowupBlock({ label, hint, children }: FollowupBlockProps) {
  return (
    <div className={styles.question}>
      <div className={styles.questionLabel}>{label}</div>
      {children}
      {hint && <div className={styles.questionHint}>{hint}</div>}
    </div>
  );
}

function FreshFollowup({ expansions, onToggle }: ExpansionGridProps) {
  return (
    <FollowupBlock
      label="Which expansions are unlocked?"
      hint={
        hasAnyExpansion(expansions)
          ? 'Path of Fire includes Heart of Thorns automatically.'
          : 'With no expansions unlocked, the free account starting point is the closer fit.'
      }
    >
      <ExpansionGrid expansions={expansions} onToggle={onToggle} />
    </FollowupBlock>
  );
}

function ReturningFollowup({
  gap,
  onPick,
}: {
  gap: GapBucket | null;
  onPick: (g: GapBucket) => void;
}) {
  return (
    <FollowupBlock label="Roughly how long since the last session?">
      <div className={styles.radioGroup}>
        {GAP_BUCKETS.map((b) => {
          const checked = gap === b.value;
          const className = [styles.radio, checked && styles.radioChecked]
            .filter(Boolean)
            .join(' ');
          return (
            <label key={b.value} className={className}>
              <input
                type="radio"
                name="gap"
                className={styles.radioInput}
                checked={checked}
                onChange={() => onPick(b.value)}
              />
              <div className={styles.radioBody}>
                <span className={styles.radioMain}>{b.main}</span>
                <span className={styles.radioMeta}>{b.meta}</span>
              </div>
            </label>
          );
        })}
      </div>
    </FollowupBlock>
  );
}

function ActiveFollowup({
  expansions,
  onToggle,
  pursuingGoal,
  onPursue,
}: ExpansionGridProps & {
  pursuingGoal: boolean | null;
  onPursue: (v: boolean) => void;
}) {
  return (
    <>
      <FollowupBlock
        label="Which expansions are unlocked?"
        hint="Path of Fire includes Heart of Thorns automatically."
      >
        <ExpansionGrid expansions={expansions} onToggle={onToggle} />
      </FollowupBlock>
      <FollowupBlock label="Currently working toward a specific long-term goal?">
        <div className={styles.toggleRow}>
          <ToggleButton selected={pursuingGoal === true} onClick={() => onPursue(true)}>
            Yes, focused on something
            <span className={styles.toggleMeta}>Legendary, mastery, achievement run</span>
          </ToggleButton>
          <ToggleButton selected={pursuingGoal === false} onClick={() => onPursue(false)}>
            No, just playing
            <span className={styles.toggleMeta}>Open-ended session</span>
          </ToggleButton>
        </div>
      </FollowupBlock>
    </>
  );
}

function F2pFollowup({
  hasMaxLevel,
  onSet,
}: {
  hasMaxLevel: boolean | null;
  onSet: (v: boolean) => void;
}) {
  return (
    <FollowupBlock label="Already have a level-80 character?">
      <div className={styles.toggleRow}>
        <ToggleButton selected={hasMaxLevel === true} onClick={() => onSet(true)}>
          Yes
          <span className={styles.toggleMeta}>Personal Story complete (or close)</span>
        </ToggleButton>
        <ToggleButton selected={hasMaxLevel === false} onClick={() => onSet(false)}>
          Not yet
          <span className={styles.toggleMeta}>Still leveling through core Tyria</span>
        </ToggleButton>
      </div>
    </FollowupBlock>
  );
}

function ToggleButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const className = [styles.toggle, selected && styles.toggleSelected]
    .filter(Boolean)
    .join(' ');
  return (
    <button type="button" className={className} onClick={onClick} aria-pressed={selected}>
      {children}
    </button>
  );
}
