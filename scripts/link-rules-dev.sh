#!/bin/bash
# Local development helper: symlinks the private rules package into
# node_modules so the runtime dynamic import resolves during dev.
# CI does not run this — CI uses placeholder rules via the runtime fallback.
#
# Usage: bash scripts/link-rules-dev.sh
# Run once after pnpm install when both repos are checked out side-by-side.

set -e

RULES_REPO="../copper-owl-rules"

if [ ! -d "$RULES_REPO" ]; then
  echo "Rules repo not found at $RULES_REPO"
  echo "This script is only useful when copper-owl-rules is checked out as a sibling."
  echo "Skipping — engine will run with placeholder rules via the runtime fallback."
  exit 0
fi

mkdir -p node_modules/@copper-owl

if [ -L "node_modules/@copper-owl/rules" ] || [ -e "node_modules/@copper-owl/rules" ]; then
  rm -rf node_modules/@copper-owl/rules
fi

ln -s "../../$RULES_REPO" node_modules/@copper-owl/rules
echo "Linked $RULES_REPO -> node_modules/@copper-owl/rules"
