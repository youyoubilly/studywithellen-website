import { describe, expect, it } from "vitest";
import {
  parseTelegramChatIds,
  resolveTelegramChatIds,
} from "../src/notify/telegram-recipients.js";
import type { AppConfig } from "../src/config.js";
import { mkdtempSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("parseTelegramChatIds", () => {
  it("parses comma-separated ids and dedupes", () => {
    expect(parseTelegramChatIds("123, 456 ,123")).toEqual(["123", "456"]);
  });

  it("returns empty for blank input", () => {
    expect(parseTelegramChatIds("  ")).toEqual([]);
  });
});

describe("resolveTelegramChatIds", () => {
  it("prefers chatIds array from config", () => {
    const config: AppConfig = {
      port: 8787,
      dataDir: "/tmp",
      schedule: {} as AppConfig["schedule"],
      telegram: {
        botToken: "x",
        chatId: "",
        chatIds: ["111", "222"],
      },
      bookingAgentToken: "",
      telegramInboxEnabled: false,
    };
    expect(resolveTelegramChatIds(config)).toEqual(["111", "222"]);
  });

  it("falls back to persisted chat id file", () => {
    const dataDir = mkdtempSync(join(tmpdir(), "ellen-recipients-"));
    writeFileSync(join(dataDir, "telegram-chat-id"), "999888777", "utf8");

    const config: AppConfig = {
      port: 8787,
      dataDir,
      schedule: {} as AppConfig["schedule"],
      telegram: { botToken: "x", chatId: "", chatIds: [] },
      bookingAgentToken: "",
      telegramInboxEnabled: false,
    };
    expect(resolveTelegramChatIds(config)).toEqual(["999888777"]);
  });
});
