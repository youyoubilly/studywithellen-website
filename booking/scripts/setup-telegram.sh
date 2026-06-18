#!/usr/bin/env bash
# Discover Telegram chat IDs for users who have /start'ed the bot.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TOKEN_FILE="${ELLEN_TELEGRAM_TOKEN_FILE:-$ROOT/../Sophia.txt}"

if [[ ! -f "$TOKEN_FILE" ]]; then
  echo "FAIL: token file not found: $TOKEN_FILE" >&2
  exit 1
fi

TOKEN="$(tr -d '[:space:]' < "$TOKEN_FILE")"

echo "==> Recent chats that messaged @SophiaW_ebot:"
curl -fsS "https://api.telegram.org/bot${TOKEN}/getUpdates" | node -e '
const chunks = [];
process.stdin.on("data", (d) => chunks.push(d));
process.stdin.on("end", () => {
  const payload = JSON.parse(Buffer.concat(chunks).toString());
  if (!payload.ok) {
    console.error(JSON.stringify(payload, null, 2));
    process.exit(1);
  }
  const seen = new Set();
  for (const update of payload.result ?? []) {
    const chat = update.message?.chat;
    if (!chat) continue;
    const id = String(chat.id);
    if (seen.has(id)) continue;
    seen.add(id);
    const name = [chat.first_name, chat.last_name].filter(Boolean).join(" ");
    const username = chat.username ? `@${chat.username}` : "(no username)";
    console.log(`- chat_id=${id} ${username} ${name}`.trim());
  }
  if (seen.size === 0) {
    console.log("(none — open https://t.me/SophiaW_ebot and send /start first)");
  }
});
'
