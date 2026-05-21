#!/bin/bash
# One-time setup: installs a pre-push git hook that runs the check suite.
# Run once per clone: bash scripts/setup-hooks.sh
set -e

HOOK=".git/hooks/pre-push"
cat > "$HOOK" <<'HOOK_BODY'
#!/bin/bash
# Pre-push hook — installed by scripts/setup-hooks.sh
exec bash scripts/check.sh
HOOK_BODY

chmod +x "$HOOK"
echo "Installed pre-push hook at $HOOK"
echo "It will run scripts/check.sh before every git push."
echo "To bypass once: git push --no-verify"
