# ADR 0005: Cloudflare Pages for web hosting

**Status:** Accepted
**Date:** May 2026
**Decision-makers:** Solo (Radeax)

## Context

Copper Owl's web build is a static SPA with PWA support. Three hosting options compared:

- **Vercel** — purpose-built for Next.js; auto-deploys from GitHub; widely used. Free tier caps bandwidth at 100GB/month.
- **Netlify** — comparable to Vercel; reduced its free build minutes to 100/month in 2025. Free tier caps bandwidth at 100GB/month.
- **Cloudflare Pages** — Cloudflare's static hosting; uses their global edge network. Free tier offers unlimited bandwidth (no monthly cap, no overage charges).

For a free non-commercial fan tool, the risk profile is real: a GW2 patch drop, a streamer mentioning Copper Owl, or a Reddit post going briefly viral could push monthly traffic well past 100GB. On Vercel or Netlify, this triggers either a soft cap (free tier suspended for the rest of the month) or unexpected bills. On Cloudflare, no consequence — traffic just gets served.

## Decision

Host the web build on **Cloudflare Pages**. Connect the public `copper-owl` GitHub repo for automatic deploys on push to `main`; preview deployments on every PR.

Build command: `pnpm install && pnpm build`
Output directory: `dist/`
Node version: 22

For production builds that need the private `@copper-owl/rules` package, configure GitHub Packages registry authentication via Cloudflare Pages environment variables (set `NPM_TOKEN` to a PAT with `read:packages` scope).

## Consequences

**Accepted trade-offs:**

- Cloudflare Pages' DX for serverless functions and edge middleware is slightly more involved than Vercel's. Not relevant for Copper Owl (no backend in v1).
- Vercel has marginally better DX for Next.js specifically; Copper Owl uses Vite, so the Next.js advantage doesn't apply.

**Benefits gained:**

- No surprise bills under any traffic scenario.
- 300+ edge locations with sub-50ms TTFB globally (faster than Vercel in independent benchmarks).
- Native GitHub integration with PR previews at `https://copper-owl-pr-<n>.pages.dev`.
- Generous build minutes; unlikely to hit the limit at Copper Owl's scale.

**Future migration path:**

If Copper Owl ever needs a backend (push notifications for reset-imminent windows, cross-device sync, shared leaderboards), **Cloudflare Workers** is the natural next step. Same vendor, same dashboard, same billing relationship. Workers free tier: 100k requests/day. No reason to introduce AWS or another cloud vendor for this project.

## References

- Cloudflare Pages: https://pages.cloudflare.com
- Free-tier comparison (2025): public reviews and bandwidth calculations
- Decision discussion: Claude.ai chat thread, May 2026
