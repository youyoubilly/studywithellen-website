#!/usr/bin/env bash
# Build and deploy Ellen Wang English Studio to HK1.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE_DIR="$ROOT/site"
REMOTE="${ELLEN_DEPLOY_HOST:-hk1}"
REMOTE_DIR="${ELLEN_REMOTE_DIR:-/var/www/ellen}"
SITE_PORT="${ELLEN_SITE_PORT:-8080}"

echo "==> Syncing Ellen assets ..."
bash "$ROOT/scripts/sync-ellen-assets.sh"

echo "==> Building site..."
cd "$SITE_DIR"
npm ci
npm run qa

echo "==> Syncing dist/ to $REMOTE:$REMOTE_DIR ..."
ssh "$REMOTE" "sudo mkdir -p '$REMOTE_DIR' && sudo chown -R bbot:www-data '$REMOTE_DIR' && sudo chmod -R g+w '$REMOTE_DIR'"
rsync -avz --delete "$SITE_DIR/dist/" "$REMOTE:$REMOTE_DIR/"

echo "==> Reloading nginx on $REMOTE ..."
ssh "$REMOTE" 'sudo nginx -t && sudo systemctl reload nginx'

echo "==> Running production smoke checks ..."
bash "$ROOT/scripts/smoke-prod.sh"

echo "==> Live at http://hk1.youyoubilly.com:${SITE_PORT}"
