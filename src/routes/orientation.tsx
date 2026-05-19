import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore, buildSyntheticAccountState } from '@/state/auth';
import { useGW2Account, useGW2Characters } from '@/api/gw2';
import { GW2ApiError } from '@/api/client';
import { transformGW2Account } from '@/api/transform';
import type { AccountState } from '@/types/domain';

import { OpenWorldMode } from '@/illustrations/OpenWorldMode';
import { InstancedMode } from '@/illustrations/InstancedMode';
import { WvwMode } from '@/illustrations/WvwMode';
import { PvpMode } from '@/illustrations/PvpMode';
import { PersonalStoryBanner } from '@/illustrations/PersonalStoryBanner';
import { LivingWorldSeason1Banner } from '@/illustrations/LivingWorldSeason1Banner';
import { HeartOfThornsBanner } from '@/illustrations/HeartOfThornsBanner';
import { PathOfFireBanner } from '@/illustrations/PathOfFireBanner';
import { ExplorationAlt } from '@/illustrations/ExplorationAlt';
import { DungeonAlt } from '@/illustrations/DungeonAlt';
import { DailyAlt } from '@/illustrations/DailyAlt';
import { WorldBossAlt } from '@/illustrations/WorldBossAlt';
import { FractalsAlt } from '@/illustrations/FractalsAlt';
import { PvpAlt } from '@/illustrations/PvpAlt';
import { MountAlt } from '@/illustrations/MountAlt';
import { SigilAlt } from '@/illustrations/SigilAlt';
import { ScrollAlt } from '@/illustrations/ScrollAlt';
import { ForgeAlt } from '@/illustrations/ForgeAlt';
import { GuildBannerAlt } from '@/illustrations/GuildBannerAlt';
import { NoticeboardAlt } from '@/illustrations/NoticeboardAlt';
import { BeaconsAlt } from '@/illustrations/BeaconsAlt';

import styles from './orientation.module.css';

// ─── Route ─────────────────────────────────────────────────────────
type OrientationState = 'o1' | 'o2' | 'o3' | 'o4' | 'o5';
const OVERRIDE_KEYS: ReadonlySet<OrientationState> = new Set(['o1', 'o2', 'o3', 'o4', 'o5']);

export interface OrientationSearch {
  state?: OrientationState;
}

export const Route = createFileRoute('/orientation')({
  component: OrientationPage,
  validateSearch: (search: Record<string, unknown>): OrientationSearch => {
    const raw = typeof search.state === 'string' ? search.state : undefined;
    return raw && OVERRIDE_KEYS.has(raw as OrientationState)
      ? { state: raw as OrientationState }
      : {};
  },
});

// Highest-tier expansion owned picks the orientation state.
// O1 (PS unfinished) and O5 (HoT-vs-PoF choice) are reachable only via
// the ?state= query override until story-completion data is available.
function pickOrientationState(account: AccountState | null): OrientationState {
  if (!account) return 'o2';
  const e = account.expansions;
  if (e.eod || e.soto || e.jw || e.voe) return 'o4';
  if (e.hot || e.pof) return 'o3';
  return 'o2';
}

function isAuthError(err: unknown): boolean {
  return (
    err instanceof GW2ApiError &&
    (err.code === 'unauthorized' || err.code === 'forbidden')
  );
}

function OrientationPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/orientation' });
  const session = useAuthStore((s) => s.session);
  const anonymousProfile = useAuthStore((s) => s.anonymousProfile);
  const isAnonymous = session?.mode === 'anonymous';
  const apiKey = session?.apiKey;

  useEffect(() => {
    if (!session) {
      void navigate({ to: '/welcome' });
    } else if (isAnonymous && !anonymousProfile) {
      void navigate({ to: '/start' });
    }
  }, [session, isAnonymous, anonymousProfile, navigate]);

  const accountQuery = useGW2Account(isAnonymous ? undefined : apiKey);
  const charsQuery = useGW2Characters(isAnonymous ? undefined : apiKey);

  const account = useMemo(() => {
    if (isAnonymous && anonymousProfile) {
      return buildSyntheticAccountState(anonymousProfile);
    }
    if (accountQuery.data && charsQuery.data) {
      return transformGW2Account(accountQuery.data, charsQuery.data);
    }
    return null;
  }, [isAnonymous, anonymousProfile, accountQuery.data, charsQuery.data]);

  const state: OrientationState = search.state ?? pickOrientationState(account);

  if (!session) return null;
  if (isAnonymous && !anonymousProfile) return null;

  if (!isAnonymous && (accountQuery.isLoading || charsQuery.isLoading)) {
    return (
      <div className={styles.page}>
        <BrandHeader />
        <div className={styles.statusBand}>
          <p className={styles.statusText}>Loading account data…</p>
        </div>
      </div>
    );
  }

  if (!isAnonymous && (isAuthError(accountQuery.error) || isAuthError(charsQuery.error))) {
    return (
      <div className={styles.page}>
        <BrandHeader />
        <div className={styles.statusBand}>
          <p className={styles.statusText}>
            The API key did not authenticate. Orientation needs account data to choose what to show.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <BrandHeader />
      {state === 'o1' && <O1View account={account} />}
      {state === 'o2' && <O2View account={account} />}
      {state === 'o3' && <O3View account={account} />}
      {state === 'o4' && <O4View account={account} />}
      {state === 'o5' && <O5View account={account} />}
      {isAnonymous && (
        <button
          type="button"
          className={styles.switchLink}
          onClick={() => navigate({ to: '/start' })}
        >
          Switch starting point
        </button>
      )}
    </div>
  );
}

// ─── Brand header (replaces sticky bar from prototype) ──────────────
function BrandHeader() {
  return (
    <div className={styles.brand}>
      <span className={styles.brandMark}>🦉</span>
      <span className={styles.brandName}>COPPER OWL</span>
    </div>
  );
}

// ─── Layout primitives ─────────────────────────────────────────────
interface HeroProps {
  eyebrow: string;
  title: ReactNode;
  sub: ReactNode;
}

function Hero({ eyebrow, title, sub }: HeroProps) {
  return (
    <div className={styles.hero}>
      <div className={styles.heroEyebrow}>{eyebrow}</div>
      <h1 className={styles.heroTitle}>{title}</h1>
      <p className={styles.heroSub}>{sub}</p>
    </div>
  );
}

interface SectionProps {
  label: string;
  sub?: string;
  children: ReactNode;
}

function Section({ label, sub, children }: SectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionHeaderLabel}>{label}</div>
        {sub && <div className={styles.sectionHeaderSub}>{sub}</div>}
      </div>
      {children}
    </section>
  );
}

interface SourceBandProps {
  label: 'Sources' | 'Context';
  children: ReactNode;
}

function SourceBand({ label, children }: SourceBandProps) {
  return (
    <div className={styles.sourceBand}>
      <strong>{label}</strong>
      {children}
    </div>
  );
}

interface SharedContextProps {
  children: ReactNode;
}

function SharedContext({ children }: SharedContextProps) {
  return (
    <div className={styles.sharedContext}>
      <span className={styles.sharedContextGlyph}>◈</span>
      <div className={styles.sharedContextBody}>{children}</div>
    </div>
  );
}

// ─── Primary recommendation card ────────────────────────────────────
interface PrimaryCardProps {
  banner: ReactNode;
  zone: string;
  flag?: string;
  title: ReactNode;
  detail: ReactNode;
  flavor?: string;
  tags?: string[];
  source?: ReactNode;
}

function PrimaryCard({ banner, zone, flag, title, detail, flavor, tags, source }: PrimaryCardProps) {
  return (
    <>
      <article className={styles.primary}>
        <div className={styles.primaryIllustration}>
          {banner}
          <div className={styles.primaryOverlay}>
            <div className={styles.primaryZone}>{zone}</div>
            {flag && <div className={styles.primaryFlag}>{flag}</div>}
          </div>
        </div>
        <div className={styles.primaryBody}>
          <h2 className={styles.primaryTitle}>{title}</h2>
          <p className={styles.primaryDetail}>{detail}</p>
          {flavor && <p className={styles.primaryFlavor}>{flavor}</p>}
          {tags && tags.length > 0 && (
            <div className={styles.primaryMeta}>
              {tags.map((tag) => (
                <span key={tag} className={styles.primaryTag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
      {source}
    </>
  );
}

// ─── Alternative cards (alt list) ───────────────────────────────────
interface AltCardProps {
  image?: ReactNode;
  name: ReactNode;
  zone?: string;
  detail: ReactNode;
  tradeoff?: ReactNode;
}

function AltCard({ image, name, zone, detail, tradeoff }: AltCardProps) {
  return (
    <div className={styles.alt}>
      {image && <div className={styles.altImage}>{image}</div>}
      <div className={styles.altContent}>
        <div className={styles.altName}>
          {name}
          {zone && <span className={styles.altZone}>{zone}</span>}
        </div>
        <div className={styles.altDetail}>{detail}</div>
        {tradeoff && <div className={styles.altTradeoff}>{tradeoff}</div>}
      </div>
    </div>
  );
}

// ─── Choice cards (HoT vs PoF) ──────────────────────────────────────
interface ChoiceCardProps {
  banner: ReactNode;
  flag: string;
  recommended?: boolean;
  title: string;
  detail: ReactNode;
  tradeoff: ReactNode;
}

function ChoiceCard({ banner, flag, recommended, title, detail, tradeoff }: ChoiceCardProps) {
  const cardClass = recommended
    ? `${styles.choiceCard} ${styles.choiceCardRecommended}`
    : styles.choiceCard;
  return (
    <div className={cardClass}>
      <div className={styles.choiceBanner}>{banner}</div>
      <div className={styles.choiceFlag}>{flag}</div>
      <div className={styles.choiceBody}>
        <h3 className={styles.choiceTitle}>{title}</h3>
        <p className={styles.choiceDetail}>{detail}</p>
        <div className={styles.choiceTradeoff}>{tradeoff}</div>
      </div>
    </div>
  );
}

// ─── Mode cards (O4 endgame modes) ──────────────────────────────────
type ModeKind = 'openworld' | 'instanced' | 'wvw' | 'pvp';

interface ModeCardProps {
  kind: ModeKind;
  illustration: ReactNode;
  name: string;
  difficulty: string;
  detail: string;
  entryStrong: string;
  entryBody: ReactNode;
}

function ModeCard({ kind, illustration, name, difficulty, detail, entryStrong, entryBody }: ModeCardProps) {
  const kindClass =
    kind === 'openworld' ? styles.modeOpenworld :
    kind === 'instanced' ? styles.modeInstanced :
    kind === 'wvw' ? styles.modeWvw :
    styles.modePvp;
  return (
    <div className={`${styles.mode} ${kindClass}`}>
      <div className={styles.modeIllustration}>
        {illustration}
        <div className={styles.modeOverlay}>
          <div className={styles.modeName}>{name}</div>
          <div className={styles.modeDifficulty}>{difficulty}</div>
        </div>
      </div>
      <div className={styles.modeBody}>
        <p className={styles.modeDetail}>{detail}</p>
        <div className={styles.modeEntry}>
          <span className={styles.modeEntryIco}>⚑</span>
          <div className={styles.modeEntryBody}>
            <strong>{entryStrong}</strong>
            {entryBody}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Path strip ─────────────────────────────────────────────────────
type PathKey = 'ps' | 'lws1' | 'lws2' | 'hot' | 'lws3' | 'pof' | 'lws4' | 'ibs' | 'eod' | 'soto' | 'jw' | 'voe';

const PATH: ReadonlyArray<{ key: PathKey; label: string }> = [
  { key: 'ps', label: 'Personal Story' },
  { key: 'lws1', label: 'LWS1' },
  { key: 'lws2', label: 'LWS2' },
  { key: 'hot', label: 'HoT' },
  { key: 'lws3', label: 'LWS3' },
  { key: 'pof', label: 'PoF' },
  { key: 'lws4', label: 'LWS4' },
  { key: 'ibs', label: 'IBS' },
  { key: 'eod', label: 'EoD' },
  { key: 'soto', label: 'SotO' },
  { key: 'jw', label: 'JW' },
  { key: 'voe', label: 'VoE' },
];

interface PathStripProps {
  current: PathKey;
  headerLabel: string;
}

function PathStrip({ current, headerLabel }: PathStripProps) {
  const currentIdx = PATH.findIndex((n) => n.key === current);
  return (
    <div className={styles.pathStrip}>
      <div className={styles.pathStripHeader}>
        <span>The canonical path</span>
        <em>{headerLabel}</em>
      </div>
      <div className={styles.pathTrack}>
        {PATH.map((node, i) => {
          const nodeClass =
            i < currentIdx ? `${styles.pathNode} ${styles.pathNodeDone}` :
            i === currentIdx ? `${styles.pathNode} ${styles.pathNodeCurrent}` :
            styles.pathNode;
          return (
            <div key={node.key} className={nodeClass}>
              <div className={styles.pathPip} />
              <div className={styles.pathLabel}>{node.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Footer chips + nav ─────────────────────────────────────────────
interface ChipsProps {
  items: Array<{ label: string; value: string }>;
}

function Chips({ items }: ChipsProps) {
  return (
    <div className={styles.chips}>
      {items.map(({ label, value }) => (
        <div key={label} className={styles.chip}>
          <div className={styles.chipLabel}>{label}</div>
          <div className={styles.chipValue}>{value}</div>
        </div>
      ))}
    </div>
  );
}

function FooterNav() {
  return (
    <nav className={styles.fnav}>
      <a href="https://wiki.guildwars2.com/wiki/Main_Page" target="_blank" rel="noopener noreferrer">
        Wiki
      </a>
      <a href="https://wiki.guildwars2.com/wiki/Event_timers" target="_blank" rel="noopener noreferrer">
        Event timers
      </a>
    </nav>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────
function expansionChipValue(account: AccountState | null): string {
  if (!account) return 'Unknown';
  const e = account.expansions;
  const owned: string[] = [];
  if (e.hot) owned.push('HoT');
  if (e.pof) owned.push('PoF');
  if (e.eod) owned.push('EoD');
  if (e.soto) owned.push('SotO');
  if (e.jw) owned.push('JW');
  if (e.voe) owned.push('VoE');
  return owned.length === 0 ? 'None (F2P)' : owned.join(' + ');
}

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

// ─── O1: Personal Story still in progress ───────────────────────────
function O1View({ account }: { account: AccountState | null }) {
  const name = account?.name ?? 'Unknown';
  return (
    <>
      <Hero
        eyebrow="Level 80 · Personal Story in progress"
        title="The Personal Story is past the halfway point"
        sub="Hitting max level while the story is still open is the common path — many players outpace the chapter requirements. Finishing the Personal Story sets up the elder dragon arc that every expansion continues."
      />
      <PathStrip current="ps" headerLabel="Current position" />

      <Section label="Recommended next" sub="Based on standard progression at this point">
        <PrimaryCard
          banner={<PersonalStoryBanner />}
          zone="Personal Story · Order Arc"
          flag="Recommended"
          title="Chapter 5 picks up the order's first major operation"
          detail="The order initiation is complete. Chapter 5 picks up the order's first mission against the dragon's lieutenants. The Personal Story has 8 chapters total — about 4 remain. Each chapter is several solo story instances, completed at any pace."
          flavor="The final chapter ends with one of GW2's signature setpiece battles — the Battle of Fort Trinity. Worth seeing in real time, not on YouTube."
          tags={['Solo instances', '4 chapters left', 'No expansions needed']}
          source={
            <SourceBand label="Context">
              Personal Story → Living World 1 → Living World 2 → Heart of Thorns → Living World 3 → Path of Fire → Living World 4 → Icebrood Saga → End of Dragons → Secrets of the Obscure → Janthir Wilds → Visions of Eternity. Finishing the core story makes the rest cohere.{' '}
              <Ext href="https://wiki.guildwars2.com/wiki/Personal_story">Wiki: Personal Story</Ext> ·{' '}
              <Ext href="https://guildjen.com/">GuildJen new player path</Ext>
            </SourceBand>
          }
        />
      </Section>

      <Section label="When story progression isn't the priority" sub="Other things to do at level 80">
        <div className={styles.alts}>
          <AltCard
            image={<ExplorationAlt />}
            name="Continue zone exploration"
            zone="Open world"
            detail="Hearts, vistas, points of interest, and hero challenges across the core zones. World completion eventually rewards a Gift of Exploration — relevant for legendary weapon pursuits later on."
            tradeoff="No story progression, but builds account-wide mastery XP and currency."
          />
          <AltCard
            image={<DungeonAlt />}
            name="Try a dungeon"
            zone="Group content"
            detail="Ascalonian Catacombs is the standard first dungeon. 5-player instanced content, ~30–45 min. LFG is the standard way to find a group — story mode is more forgiving than explorable."
            tradeoff="Older content, smaller LFG pool than fractals, but still active."
          />
          <AltCard
            image={<DailyAlt />}
            name="Daily and weekly objectives"
            zone="Wizard's Vault"
            detail="The Wizard's Vault rewards Astral Acclaim, used to buy gear, currencies, and skins. A low-pressure way to build the habit of logging in."
          />
        </div>
      </Section>

      <Chips
        items={[
          { label: 'Account', value: name },
          { label: 'PS Progress', value: 'Chapter 4' },
          { label: 'Expansions', value: expansionChipValue(account) },
        ]}
      />
      <FooterNav />
    </>
  );
}

// ─── O2: F2P, Personal Story complete ──────────────────────────────
function O2View({ account }: { account: AccountState | null }) {
  const name = account?.name ?? 'Unknown';
  return (
    <>
      <Hero
        eyebrow="Fresh 80 · Personal Story complete · Free-to-Play"
        title="The full core game is open. Plenty of free content remains."
        sub="F2P accounts can do everything in core Tyria: open world, dungeons, fractals, PvP, WvW (with restrictions). Many players enjoy GW2 for years without an expansion. Expansions become relevant when mounts, gliding, or new zones enter the picture."
      />
      <PathStrip current="lws1" headerLabel="Current position" />

      <Section label="Recommended next" sub="Plenty of free content is genuinely worth the time">
        <PrimaryCard
          banner={<LivingWorldSeason1Banner />}
          zone="Living World Season 1"
          flag="Recommended"
          title={
            <>
              Living World Season 1 continues the story
              <span className={styles.primaryFreebadge}>Free since 2022</span>
            </>
          }
          detail="Season 1 is the next chapter in chronological order. Five episodes, all free for every account. It introduces the villain arc that continues into the expansions and sets up characters who reappear throughout the rest of the story."
          flavor="Veterans missed this the first time. The current release was built specifically as a love letter to players who skipped it back when it was a live event."
          tags={['5 episodes', 'Solo + group content']}
          source={
            <SourceBand label="Context">
              Long unavailable after the original release, then rebuilt and re-released for all accounts. Most veteran players never got to play it the first time. Episode 1 unlocks from the Story Journal and the story follows from there.{' '}
              <Ext href="https://wiki.guildwars2.com/wiki/Season_1">Wiki: Living World Season 1</Ext>
            </SourceBand>
          }
        />
      </Section>

      <Section label="Other things to try at 80" sub="All free with a core account">
        <div className={styles.alts}>
          <AltCard
            image={<WorldBossAlt />}
            name="World bosses & meta events"
            zone="Open world"
            detail="Tequatl the Sunless, Triple Trouble, the Shatterer — large-scale group events on fixed daily schedules. Each runs at a fixed spawn time; squads form in zone chat ahead of the event. Some of the most enjoyable content for new players."
            tradeoff={
              <>
                The wiki&apos;s <Ext href="https://wiki.guildwars2.com/wiki/Event_timers">Event timers</Ext> page is the community-standard schedule (the in-game chat command <code>/wiki et</code> opens it directly). The LFG window also shows boss timers under the &quot;Squads&quot; tab.
              </>
            }
          />
          <AltCard
            image={<DungeonAlt />}
            name="Dungeons — instanced 5-player content"
            zone="Group content"
            detail="Eight dungeons in total. Older than fractals but still active in LFG, especially story mode runs. Dungeon tokens drop here and buy unique armor skins."
            tradeoff="Older mechanics. Less popular than fractals, but the skins are unique."
          />
          <AltCard
            image={<FractalsAlt />}
            name="Fractals — short instanced challenges"
            zone="Group content"
            detail="5-player, ~15 min each, scaling difficulty. Tier 1 has no agony resistance requirement and is friendly to new groups. LFG is active throughout the day."
            tradeoff="F2P restriction: only scales 1–2 are available without an expansion-linked Mistlock Singularity unlock."
          />
          <AltCard
            image={<PvpAlt />}
            name="PvP — fully gear-normalized"
            zone="Structured PvP"
            detail="Unranked Conquest queues match players regardless of gear. Builds unlock through PvP play itself, not core gear progression."
          />
        </div>
      </Section>

      <Section label="When an expansion starts to matter" sub="Honest about the trade-offs">
        <div className={styles.alts}>
          <AltCard
            image={<MountAlt />}
            name="For mount access"
            zone="Any expansion"
            detail="F2P accounts get a 10-hour raptor trial at level 10 to test-drive the mount system. Any expansion (PoF, EoD, SotO, Janthir Wilds, Visions of Eternity) converts that trial to permanent raptor access account-wide, since each bundles the same content unlocks."
            tradeoff="The basic raptor is just the entry point. Springer (high jumps), skimmer (water), jackal (desert traversal), and griffon all unlock through Path of Fire content specifically. Raptor masteries (longer jumps, tail spin) also require PoF."
          />
          <AltCard
            image={<SigilAlt />}
            name="For elite specializations"
            zone="Any expansion"
            detail="Each expansion adds a new elite specialization per profession — significantly different playstyles. Reaper for Necromancer, Scrapper for Engineer, and so on."
            tradeoff="In-game gold converts to gems, which can buy expansions — an alternative for players who'd rather not spend money directly."
          />
        </div>
      </Section>

      <Chips
        items={[
          { label: 'Account', value: name },
          { label: 'PS', value: 'Complete' },
          { label: 'Expansions', value: expansionChipValue(account) },
        ]}
      />
      <FooterNav />
    </>
  );
}

// ─── O3: HoT + PoF owned, ready for first expansion ────────────────
function O3View({ account }: { account: AccountState | null }) {
  const name = account?.name ?? 'Unknown';
  return (
    <>
      <Hero
        eyebrow="Fresh 80 · Owns Heart of Thorns + Path of Fire"
        title="Time for expansions — the next leap in gameplay"
        sub={
          <>
            The PoF bundle (Heart of Thorns + Path of Fire) is unlocked. <strong>Chronological is the default — HoT first.</strong> There&apos;s also a real case for PoF first when the full mount set is the priority. Both paths converge.
          </>
        }
      />
      <PathStrip current="hot" headerLabel="Current position" />

      <Section label="The choice ahead" sub="What matters more right now picks the path">
        <SharedContext>
          The basic raptor is already unlocked. Any expansion owner gets it automatically at level 10 — the choice below is not about a first mount. It&apos;s about which storyline to play first, and how soon the rest of the <strong>mount set</strong> unlocks, since those come from Path of Fire content.
        </SharedContext>
        <div className={styles.choices}>
          <ChoiceCard
            banner={<HeartOfThornsBanner />}
            flag="Most common"
            recommended
            title="Heart of Thorns first — chronological"
            detail="Story flows continuously from core through HoT into Living World 3 into PoF. Characters appear in the order intended. HoT's verticality and tougher combat make the steeper learning curve — overcoming it is what many players remember most."
            tradeoff={
              <>
                <strong>Trade gained:</strong> story continuity, gliding mastery, harder content first (easier to scale down later).<br /><br />
                <strong>Trade-off:</strong> no PoF mounts during HoT exploration, which makes HoT&apos;s vertical zones slower to navigate. The rest of the mount set unlocks after PoF.
              </>
            }
          />
          <ChoiceCard
            banner={<PathOfFireBanner />}
            flag="Common deviation"
            title="Path of Fire first — full mount set before HoT"
            detail="PoF's story first unlocks springer (high jumps), skimmer (water traversal), and jackal (desert blink) across its zones. With the full mount set in hand, returning to HoT makes its vertical zones substantially less frustrating."
            tradeoff={
              <>
                <strong>Trade gained:</strong> the full PoF mount set early — a permanent QoL upgrade across all content.<br /><br />
                <strong>Trade-off:</strong> story continuity breaks. PoF references LWS2 and HoT events that haven&apos;t happened yet from a chronological view, including HoT&apos;s ending.
              </>
            }
          />
        </div>
        <SourceBand label="Sources">
          The chronological order comes from the official{' '}
          <Ext href="https://wiki.guildwars2.com/wiki/Living_World">wiki Living World</Ext> page and is what most players do. The PoF-first deviation is well-documented in{' '}
          <Ext href="https://guildjen.com/">GuildJen&apos;s new player guide</Ext> for players who prioritize mount access over story flow.
        </SourceBand>
      </Section>

      <Section label="Before the first expansion" sub="A gear check and an Auto-Loot detour both pay off">
        <div className={styles.alts}>
          <AltCard
            image={<ScrollAlt />}
            name="Auto-Loot — a quiet QoL upgrade"
            zone="Pact Commander mastery"
            detail="Universal QoL upgrade. Cost: 1 mastery point + mastery XP earned through play. Loot drops directly to inventory instead of needing manual pickup — saves dozens of clicks per session. Many players miss this for months."
            tradeoff="Auto-Loot is the tier 4 ability of the Pact Commander track. Without prior Core Tyria mastery XP, training all four tiers takes time — possibly several play sessions. The 'Train' button on the Pact Commander line lives in the Mastery panel (H key by default)."
          />
          <AltCard
            image={<ForgeAlt />}
            name="A gear check"
            zone="Core Tyria"
            detail="Exotic gear is the minimum for expansion content. Rare-geared characters can fill gaps cheaply via the karma vendors at Orr temples or the TP — 5–10 minutes to assess and replace."
            tradeoff="Ascended gear is ~5% stronger than Exotic — not required for HoT or PoF, but worth pursuing later for Fractals T2+."
          />
        </div>
      </Section>

      <Chips
        items={[
          { label: 'Account', value: name },
          { label: 'PS', value: 'Complete' },
          { label: 'Expansions', value: expansionChipValue(account) },
        ]}
      />
      <FooterNav />
    </>
  );
}

// ─── O4: All DLCs owned, endgame mode selection ────────────────────
function O4View({ account }: { account: AccountState | null }) {
  const name = account?.name ?? 'Unknown';
  return (
    <>
      <Hero
        eyebrow="Fresh 80 · Owns all expansions · Story complete"
        title="Every expansion owned. Here are the four ways to engage the endgame."
        sub="When the story is done (or set aside) and the hearts grind has lost its appeal, this is the map of options. Picking one mode to start is not a permanent commitment."
      />
      <PathStrip current="voe" headerLabel="Story complete" />

      <Section label="The four endgame modes" sub="Each is a separate progression — mixing them freely is the norm">
        <div className={styles.modesGrid}>
          <ModeCard
            kind="openworld"
            illustration={<OpenWorldMode />}
            name="Open World"
            difficulty="Casual"
            detail="Meta events, world bosses, zone completion, achievements. Where most players spend most of their time. Solo-friendly, any group size."
            entryStrong="This session"
            entryBody="Drizzlewood Coast (IBS) or Dragonfall (LWS4) — commander tags lead the squad; no preparation required."
          />
          <ModeCard
            kind="instanced"
            illustration={<InstancedMode />}
            name="Fractals & Raids"
            difficulty="Easy → Hard"
            detail="Instanced PvE for organized groups. Fractals are short (~15 min, 5 players). Raids are longer (~1–2 hrs per wing, 10 players). Build optimization, mechanics learning, strongest non-cosmetic rewards."
            entryStrong="This session"
            entryBody="Fractals scale 1 in LFG. Tier 1 (scales 1–25) needs no agony resistance. For raids, 'training run' groups in LFG welcome new players."
          />
          <ModeCard
            kind="wvw"
            illustration={<WvwMode />}
            name="World vs World"
            difficulty="Casual to deep"
            detail="Persistent large-scale PvP between three servers. Capture keeps, defend objectives, fight squads. Solo roaming and 50-player squads coexist on the same maps. Different progression (WvW ranks, Skirmish tickets) from PvE."
            entryStrong="This session"
            entryBody="The 'public' tagged squad on the home Borderlands is the standard entry. WvW upscales character level but not gear — Ascended hits harder than Rare. Gear matters more in smaller fights."
          />
          <ModeCard
            kind="pvp"
            illustration={<PvpMode />}
            name="Structured PvP"
            difficulty="Skill-based"
            detail="5v5 Conquest. Gear and stats fully normalized — only build choice matters. Lowest barrier to entry, highest skill ceiling. Independent reward track and rank progression."
            entryStrong="This session"
            entryBody="Unranked Conquest queue. The PvP build panel has preset builds. MetaBattle publishes current meta picks per profession."
          />
        </div>
        <SourceBand label="Context">
          This framing is the standard community answer to &quot;what is the endgame?&quot; The four modes have distinct progression tracks and don&apos;t significantly overlap.{' '}
          <Ext href="https://wiki.guildwars2.com/wiki/Endgame">Wiki: Endgame</Ext> ·{' '}
          <Ext href="https://guildjen.com/">GuildJen endgame intro</Ext>
        </SourceBand>
      </Section>

      <Section label="On finding a guild" sub="A common pain point for fresh 80s">
        <div className={styles.alts}>
          <AltCard
            image={<GuildBannerAlt />}
            name="In-game LFG → Guilds tab"
            detail="The LFG window's 'Guilds' tab lists actively recruiting guilds with their focus (PvE, WvW, social, etc.) and size, filterable by interest."
          />
          <AltCard
            image={<NoticeboardAlt />}
            name="r/Guildwars2 weekly guild thread"
            detail="Pinned on the subreddit. Recruiting guilds post their description, players post what they're looking for. Lower volume than LFG but more detailed."
          />
          <AltCard
            image={<BeaconsAlt />}
            name="Discord communities by mode"
            detail="Snow Crows Discord for raids, separate WvW Discords by region, fishing communities, RP guilds. Each mode has its own social layer."
          />
        </div>
      </Section>

      <Chips
        items={[
          { label: 'Account', value: name },
          { label: 'PS', value: 'Complete' },
          { label: 'Expansions', value: expansionChipValue(account) },
        ]}
      />
      <FooterNav />
    </>
  );
}

// ─── O5: HoT-vs-PoF decision point ─────────────────────────────────
function O5View({ account }: { account: AccountState | null }) {
  return (
    <>
      <Hero
        eyebrow="Decision point"
        title="Heart of Thorns or Path of Fire first?"
        sub="A frequently-debated choice. The default is HoT first (chronological); the deviation is PoF first (for mounts). Priorities pick the path."
      />

      <Section label="The two paths" sub="Same destination, different journey">
        <SharedContext>
          <strong>The basic raptor is already unlocked.</strong> Any expansion owner gets it automatically at level 10. The choice below is about which storyline to play first and how soon the rest of the mount set unlocks through PoF content.
        </SharedContext>
        <div className={styles.choices}>
          <ChoiceCard
            banner={<HeartOfThornsBanner />}
            flag="Most common"
            recommended
            title="Heart of Thorns first — chronological"
            detail="Story flows continuously. HoT is harder than core — denser combat, vertical zones, more group-event-driven. Many veterans say overcoming HoT's learning curve is the moment they fell in love with GW2."
            tradeoff={
              <>
                <strong>Suits:</strong> players for whom story matters and a steeper combat curve is acceptable. No PoF mounts during HoT exploration, but gliding (HoT&apos;s mastery) becomes a permanent skill afterward.
              </>
            }
          />
          <ChoiceCard
            banner={<PathOfFireBanner />}
            flag="Common deviation"
            title="Path of Fire first — full mount set before HoT"
            detail="Starting PoF's story before HoT unlocks springer, skimmer, and jackal through PoF zones, then loops back to HoT with the full mount set. Story continuity breaks, but HoT's verticality stops feeling punishing once the mount set is in hand."
            tradeoff={
              <>
                <strong>Suits:</strong> players for whom combat-difficulty fatigue is a real concern, or who want the full mount system as early as possible. PoF&apos;s story references HoT events that haven&apos;t happened yet from a chronological view — including HoT&apos;s ending.
              </>
            }
          />
        </div>
        <SourceBand label="Sources">
          Chronological is the wiki-recommended order, which most players follow. PoF-first is the documented community deviation for players prioritizing mount accessibility.{' '}
          <Ext href="https://wiki.guildwars2.com/wiki/Living_World">Wiki: Living World</Ext> ·{' '}
          <Ext href="https://guildjen.com/">GuildJen new player path</Ext>
        </SourceBand>
      </Section>

      <Chips
        items={[
          { label: 'Owned', value: expansionChipValue(account) },
          { label: 'Decision', value: 'Not yet made' },
        ]}
      />
      <FooterNav />
    </>
  );
}
