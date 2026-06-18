import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { parseTelegramChatIds } from "./notify/telegram-recipients.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export interface ScheduleConfig {
  timezone: string;
  workdays: number[];
  start: string;
  end: string;
  slotMinutes: number;
  horizonDays: number;
  maxPreferences: number;
}

export interface AppConfig {
  port: number;
  dataDir: string;
  schedule: ScheduleConfig;
  telegram: {
    botToken: string;
    chatId: string;
    chatIds: string[];
  };
  bookingAgentToken: string;
  telegramInboxEnabled: boolean;
}

const defaultSchedule: ScheduleConfig = {
  timezone: "Asia/Shanghai",
  workdays: [1, 2, 3, 4, 5],
  start: "10:00",
  end: "18:00",
  slotMinutes: 60,
  horizonDays: 7,
  maxPreferences: 5,
};

export function loadSchedule(configPath?: string): ScheduleConfig {
  const path = configPath ?? join(ROOT, "config", "schedule.yaml");
  const raw = parse(readFileSync(path, "utf8")) as Partial<ScheduleConfig>;
  return { ...defaultSchedule, ...raw };
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const chatIdRaw = env.TELEGRAM_CHAT_ID ?? "";
  const chatIdsRaw = env.TELEGRAM_CHAT_IDS ?? chatIdRaw;

  return {
    port: Number(env.PORT ?? 8787),
    dataDir: env.BOOKING_DATA_DIR ?? join(ROOT, "data"),
    schedule: loadSchedule(env.SCHEDULE_PATH),
    telegram: {
      botToken: env.TELEGRAM_BOT_TOKEN ?? "",
      chatId: chatIdRaw,
      chatIds: parseTelegramChatIds(chatIdsRaw),
    },
    bookingAgentToken: env.BOOKING_AGENT_TOKEN ?? "",
    telegramInboxEnabled: env.TELEGRAM_INBOX_ENABLED === "true",
  };
}

export function isTelegramConfigured(config: AppConfig): boolean {
  return Boolean(
    config.telegram.botToken &&
      (config.telegram.chatIds.length > 0 || config.telegram.chatId),
  );
}
