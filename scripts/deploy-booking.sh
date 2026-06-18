#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${BOOKING_TARGET:-/opt/ellen-booking}"
SERVICE="${BOOKING_SERVICE:-ellen-booking.service}"

echo "==> Deploying booking service to ${TARGET}"

rsync -a --delete \
  --exclude node_modules \
  --exclude data \
  --exclude .env \
  "${ROOT}/booking/" "${TARGET}/"

cd "${TARGET}"
npm ci
npm test

echo "==> Restarting ${SERVICE}"
sudo systemctl restart "${SERVICE}"
sudo systemctl is-active --quiet "${SERVICE}"

echo "==> Booking deploy complete"
if curl -sf "http://127.0.0.1:8787/health" >/dev/null; then
  curl -sf "http://127.0.0.1:8787/health" | head -c 200
  echo
else
  echo "Warning: health check failed (service may still be starting)"
fi
