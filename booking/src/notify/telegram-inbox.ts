import type { AppConfig } from "../config.js";
import { sendTelegramMessage } from "./telegram.js";

const WELCOME_EN =
  "Hi! This is the Ellen Wang English Studio booking notification bot.\n\nYou are connected. New booking requests will be sent here.\n\nBook online: http://hk1.youyoubilly.com:8080/book/";

/**
 * Legacy Telegram inbox poller — disabled by default when SophiaW agent-workspace
 * owns getUpdates on the same @SophiaW_ebot token. Set TELEGRAM_INBOX_ENABLED=true
 * only for standalone booking mode (no agent-workspace poller).
 */
export function startTelegramInbox(config: AppConfig): void {
  const token = config.telegram.botToken;
  if (!token) return;

  let running = false;

  const tick = async () => {
    if (running) return;
    running = true;
    try {
      const { existsSync, readFileSync, writeFileSync } = await import(
        "node:fs"
      );
      const { join } = await import("node:path");
      const offsetPath = join(config.dataDir, "telegram-update-offset");
      const chatIdPath = join(config.dataDir, "telegram-chat-id");

      const readOffset = (): number => {
        if (!existsSync(offsetPath)) return 0;
        const value = Number(readFileSync(offsetPath, "utf8").trim());
        return Number.isFinite(value) ? value : 0;
      };

      const offset = readOffset();
      const response = await fetch(
        `https://api.telegram.org/bot${token}/getUpdates?timeout=0&offset=${offset}`,
      );
      const payload = (await response.json()) as {
        ok: boolean;
        result?: Array<{
          update_id: number;
          message?: {
            text?: string;
            chat: { id: number };
          };
        }>;
      };

      if (!payload.ok || !payload.result?.length) return;

      let nextOffset = offset;
      for (const update of payload.result) {
        nextOffset = update.update_id + 1;
        const text = update.message?.text?.trim();
        const chatId = update.message?.chat.id;
        if (!chatId || !text) continue;

        if (text === "/start" || text.startsWith("/start ")) {
          writeFileSync(chatIdPath, String(chatId), "utf8");
          await sendTelegramMessage(token, String(chatId), WELCOME_EN);
        }
      }

      if (nextOffset > offset) {
        writeFileSync(offsetPath, String(nextOffset), "utf8");
      }
    } catch (error) {
      console.error(
        "telegram inbox poll failed:",
        error instanceof Error ? error.message : error,
      );
    } finally {
      running = false;
    }
  };

  void tick();
  setInterval(() => void tick(), 15_000);
}
