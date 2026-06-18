import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  getTelegramUpdates,
  sendTelegramMessage,
} from "../src/notify/telegram.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokenFile =
  process.env.ELLEN_TELEGRAM_TOKEN_FILE ?? join(ROOT, "..", "Sophia.txt");

function loadToken(): string {
  if (process.env.TELEGRAM_BOT_TOKEN) return process.env.TELEGRAM_BOT_TOKEN;
  return readFileSync(tokenFile, "utf8").trim();
}

async function main() {
  const token = loadToken();
  let chatId = process.env.TELEGRAM_CHAT_ID ?? "";

  if (!chatId) {
    const chats = await getTelegramUpdates(token);
    if (chats.length === 0) {
      console.error(
        "No chat_id found. Open the bot in Telegram and send /start, then retry.",
      );
      process.exit(1);
    }
    chatId = chats.at(-1)!.chatId;
    console.log(
      `Using chat_id=${chatId} (${chats.at(-1)?.username ?? chats.at(-1)?.firstName ?? "unknown"})`,
    );
  }

  const message =
    process.env.PING_MESSAGE ??
    "✅ Ellen booking service connected. Telegram notifications are working.";

  const result = await sendTelegramMessage(token, chatId, message);
  if (!result.ok) {
    console.error(`Telegram ping failed: ${result.error}`);
    process.exit(1);
  }

  console.log("Telegram ping sent successfully.");
  console.log(`chat_id=${chatId}`);
}

main();
