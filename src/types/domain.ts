/**
 * Copper Owl domain types.
 *
 * These types model the GW2 player state and the recommendations Copper Owl
 * produces. They're the contract between the API layer, the recommendation
 * engine, and the UI. Change carefully — many things depend on these shapes.
 */

// ─── Player archetype ────────────────────────────────────────────────
// Five archetypes the recommendation engine classifies players into.
// The archetype determines which surface the user lands on (welcome →
// orientation, returning, or engaged-home).

export type PlayerArchetype =
  | 'unclassified'
  | 'f2p_explorer' // Free account, exploring
  | 'fresh_80' // Hit max level, expansion(s) owned, unsure what's next
  | 'returning' // Account with gap, played before, drifted away
  | 'engaged_casual' // Plays regularly, no specific goal
  | 'engaged_committed'; // Plays regularly, pursuing specific endgame goal

// ─── Auth mode ────────────────────────────────────────────────────────
// Three access modes per the architecture decisions.

export type AuthMode = 'anonymous' | 'api_key' | 'gw2me';

export interface Session {
  mode: AuthMode;
  apiKey?: string;
  accountName?: string;
  /** ISO timestamp when this session was established */
  establishedAt: string;
}

// ─── Account state (cached from GW2 API or manually entered for anonymous) ─

export interface AccountState {
  name: string | null;
  /** Days since account creation */
  ageDays: number | null;
  /** Days since last login at last fetch */
  daysSinceLastLogin: number | null;
  /** Owned expansion flags */
  expansions: {
    hot: boolean;
    pof: boolean;
    eod: boolean;
    soto: boolean;
    jw: boolean;
    voe: boolean;
  };
  /** Set of characters with their levels */
  characters: CharacterSummary[];
  /** Account-wide currency totals */
  wallet: Record<string, number>;
  /** Mastery completion summary */
  masteries: MasterySummary | null;
}

export interface CharacterSummary {
  name: string;
  level: number;
  profession: string;
  /** Last modified ISO timestamp */
  lastModified: string;
}

export interface MasterySummary {
  central: number; // 0-32 for central Tyria
  hot: number; // Heart of Thorns mastery points spent
  pof: number;
  eod: number;
  soto: number;
  jw: number;
}

// ─── Recommendation ──────────────────────────────────────────────────
// A single recommendation is "do this next, here's why, here's the cost."
// The engine produces a primary recommendation plus alternatives.

export type RecommendationPriority = 'primary' | 'alternative' | 'fallback';

export interface Recommendation {
  /** Stable ID for tracking dismissals, telemetry, etc. */
  id: string;
  priority: RecommendationPriority;
  /** Short headline action: "Continue Personal Story Chapter 5" */
  title: string;
  /** Zone or category label: "Personal Story · Order Arc" */
  zone: string;
  /** Why this is the recommendation — the reasoning */
  detail: string;
  /** A single italicized flavor line — the field-guide voice */
  flavor?: string;
  /** Estimated time/effort tags: ["~30 min", "Solo", "No prep"] */
  tags: string[];
  /** Banner illustration key — references the painted-SVG library */
  bannerKey: string;
  /** Source citations for transparency */
  sources?: SourceCitation[];
}

export interface SourceCitation {
  label: string;
  url: string;
}

// ─── Reset cycle ─────────────────────────────────────────────────────
// GW2 daily reset is at 16:00 UTC. Weekly reset is Monday 16:00 UTC.
// Reset-awareness is a first-class concept in Copper Owl's design.

export interface ResetState {
  /** Seconds until next daily reset */
  secondsToDailyReset: number;
  /** Seconds until next weekly reset (Monday 16:00 UTC) */
  secondsToWeeklyReset: number;
  /** True if daily reset is within 30 minutes */
  resetImminent: boolean;
  /** True if daily reset happened within last 30 minutes */
  postResetWindow: boolean;
}
