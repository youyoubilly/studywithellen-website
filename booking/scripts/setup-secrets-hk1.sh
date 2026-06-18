#!/usr/bin/env bash
# Deploy Ellen booking service secrets to HK1 (token never committed).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TOKEN_FILE="${ELLEN_TELEGRAM_TOKEN_FILE:-$ROOT/../Sophia.txt}"
REMOTE="${ELLEN_DEPLOY_HOST:-hk1}"
ENV_FILE="/etc/ellen-booking.env"

if [[ ! -f "$TOKEN_FILE" ]]; then
  echo "FAIL: token file not found: $TOKEN_FILE" >&2
  exit 1
fi

TOKEN="$(tr -d '[:space:]' < "$TOKEN_FILE")"
CHAT_IDS="${TELEGRAM_CHAT_IDS:-${TELEGRAM_CHAT_ID:-}}"
BOOKING_AGENT_TOKEN="${BOOKING_AGENT_TOKEN:-}"

if [[ -z "$TOKEN" ]]; then
  echo "FAIL: empty token in $TOKEN_FILE" >&2
  exit 1
fi

TMP="$(mktemp)"
chmod 600 "$TMP"
{
  echo "TELEGRAM_BOT_TOKEN=$TOKEN"
  echo "TELEGRAM_CHAT_IDS=$CHAT_IDS"
  echo "TELEGRAM_CHAT_ID=$CHAT_IDS"
  echo "BOOKING_AGENT_TOKEN=$BOOKING_AGENT_TOKEN"
  echo "TELEGRAM_INBOX_ENABLED=false"
  echo "BOOKING_DATA_DIR=/var/lib/ellen-booking"
  echo "PORT=8787"
  echo "TZ=Asia/Shanghai"
} > "$TMP"

scp "$TMP" "$REMOTE:/tmp/ellen-booking.env"
rm -f "$TMP"

ssh "$REMOTE" "sudo install -m 600 -o root -g bbot /tmp/ellen-booking.env '$ENV_FILE' && rm -f /tmp/ellen-booking.env"
echo "==> Secrets installed at $ENV_FILE on $REMOTE"
echo "    TELEGRAM_INBOX_ENABLED=false (SophiaW agent-workspace owns Telegram polling)"
