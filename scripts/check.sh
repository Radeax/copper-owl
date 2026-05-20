#!/bin/bash
# Runs the same checks CI runs. Safe to run locally at any time.
# Also used as the pre-push hook body — see scripts/setup-hooks.sh.
set -e

echo "==> typecheck"
pnpm typecheck

echo "==> lint"
pnpm lint

echo "==> test"
pnpm test:run

echo "==> build"
pnpm build

echo "==> All checks passed."
