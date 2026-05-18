# Security Policy

Copper Owl is a free, non-commercial fan project maintained by a small number of contributors. We take security seriously regardless of scale.

## Reporting a vulnerability

**Please do not file public issues for security vulnerabilities.** Public issues are visible to everyone, including potential bad actors, before a fix lands.

Instead, use GitHub's private security advisory feature:

1. Go to the **Security** tab of this repository
2. Click **Report a vulnerability**
3. Fill in the details — what you found, how to reproduce, what the impact could be

This sends an encrypted report visible only to repository maintainers. We'll respond as soon as practical, typically within a few days. If a vulnerability is confirmed, a fix and coordinated disclosure timeline follow.

## Scope

In scope:

- The Copper Owl engine (this repository)
- The web application served from this repository
- The Tauri desktop and mobile applications built from this repository

Out of scope (report to the relevant party):

- The Guild Wars 2 API itself — report to ArenaNet
- The gw2.me OAuth service — report to [gw2.me](https://gw2.me/) maintainers
- Vulnerabilities in third-party dependencies — report upstream; we patch our usage once a fix is available

## What counts as a vulnerability

In scope:

- Unauthorized access to API keys or OAuth tokens stored by Copper Owl
- Cross-site scripting (XSS) on any surface
- Insecure handling of the GW2 API key during the auth flow
- Any path that lets an attacker influence what's rendered or stored for another user
- Privilege escalation or filesystem access bypass in the Tauri native shell

Not vulnerabilities (file as a regular issue instead):

- The recommendation engine producing inaccurate or off-tone advice
- UI rendering issues, layout bugs, or accessibility issues
- Build, deploy, or dependency-management problems

## Acknowledgment

If you report a confirmed in-scope vulnerability, we'll credit you in the release notes for the fix unless you'd rather stay anonymous. Thank you for keeping users safe.