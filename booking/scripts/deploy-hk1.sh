#!/usr/bin/env bash
# Build, deploy, and restart Ellen booking service on HK1.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE="${ELLEN_DEPLOY_HOST:-hk1}"
REMOTE_DIR="${ELLEN_BOOKING_DIR:-/opt/ellen-booking}"
SITE_PORT="${ELLEN_SITE_PORT:-8080}"

echo "==> Installing dependencies and running tests ..."
cd "$ROOT"
npm ci
npm test
npm run typecheck

echo "==> Ensuring secrets on $REMOTE ..."
bash "$ROOT/scripts/setup-secrets-hk1.sh"

echo "==> Syncing service to $REMOTE:$REMOTE_DIR ..."
ssh "$REMOTE" "sudo mkdir -p '$REMOTE_DIR' /var/lib/ellen-booking && sudo chown -R bbot:bbot '$REMOTE_DIR' /var/lib/ellen-booking"
rsync -avz \
  --exclude node_modules \
  --exclude data \
  --exclude .env \
  "$ROOT/" "$REMOTE:$REMOTE_DIR/"

echo "==> Installing production deps on $REMOTE ..."
ssh "$REMOTE" 'source ~/.nvm/nvm.sh && cd "'"$REMOTE_DIR"'" && npm ci --omit=dev'

echo "==> Installing systemd unit ..."
scp "$ROOT/ops/ellen-booking.service" "$REMOTE:/tmp/ellen-booking.service"
ssh "$REMOTE" "sudo mv /tmp/ellen-booking.service /etc/systemd/system/ellen-booking.service && sudo systemctl daemon-reload && sudo systemctl enable ellen-booking && sudo systemctl restart ellen-booking"

echo "==> Updating nginx vhost for /book/ proxy ..."
ELLEN_ROOT="$(cd "$ROOT/../Ellen-English-Studio" && pwd)"
scp "$ELLEN_ROOT/ops/nginx-ellen.conf" "$REMOTE:/tmp/nginx-ellen.conf"
ssh "$REMOTE" "sudo mv /tmp/nginx-ellen.conf /etc/nginx/sites-available/ellen && sudo nginx -t && sudo systemctl reload nginx"

echo "==> Health checks ..."
ssh "$REMOTE" "curl -fsS http://127.0.0.1:8787/health"
curl -fsS "http://hk1.youyoubilly.com:${SITE_PORT}/book/"
curl -fsSI "http://hk1.youyoubilly.com:${SITE_PORT}/book/" | head -5

echo "==> Booking service live at http://hk1.youyoubilly.com:${SITE_PORT}/book/"
