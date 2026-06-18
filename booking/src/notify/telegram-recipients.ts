import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { AppConfig } from "../config.js";

function chatIdPath(dataDir: string): string {
  return join(dataDir, "telegram-chat-id");
}

/** Parse comma-separated chat IDs from env (deduped, trimmed). */
export function parseTelegramChatIds(raw: string): string[] {
  if (!raw.trim()) return [];
  return [
    ...new Set(
      raw
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
    ),
  ];
}

/** Resolve all notification targets: env chat IDs, optional persisted fallback. */
export function resolveTelegramChatIds(config: AppConfig): string[] {
  const fromEnv = config.telegram.chatIds.length
    ? config.telegram.chatIds
    : parseTelegramChatIds(config.telegram.chatId);

  if (fromEnv.length > 0) return fromEnv;

  const path = chatIdPath(config.dataDir);
  if (!existsSync(path)) return [];

  const persisted = readFileSync(path, "utf8").trim();
  return persisted ? [persisted] : [];
}

/** @deprecated Use resolveTelegramChatIds — returns first target for backward compat. */
export function resolveTelegramChatId(config: AppConfig): string {
  return resolveTelegramChatIds(config)[0] ?? "";
}

export function isTelegramNotifyConfigured(config: AppConfig): boolean {
  return Boolean(
    config.telegram.botToken && resolveTelegramChatIds(config).length > 0,
  );
}
