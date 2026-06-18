import { describe, expect, it } from "vitest";
import { createApp } from "../src/server.js";
import { resetDbForTests } from "../src/db.js";
import { mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { AppConfig } from "../src/config.js";
import { loadSchedule } from "../src/config.js";

function testConfig(): AppConfig {
  return {
    port: 8787,
    dataDir: mkdtempSync(join(tmpdir(), "ellen-booking-pages-")),
    schedule: loadSchedule(),
    telegram: { botToken: "", chatId: "", chatIds: [] },
    bookingAgentToken: "",
    telegramInboxEnabled: false,
  };
}

describe("booking pages", () => {
  it("renders modular slot picker markup", async () => {
    resetDbForTests();
    const app = createApp(testConfig());
    const res = await app.request("/book/?lang=zh");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('id="slot-picker"');
    expect(html).toContain('id="day-tabs"');
    expect(html).toContain('id="time-grid"');
    expect(html).toContain('id="timezone-select"');
    expect(html).toContain("/book/book.js");
  });

  it("serves book.js static asset", async () => {
    resetDbForTests();
    const app = createApp(testConfig());
    const res = await app.request("/book/book.js");
    expect(res.status).toBe(200);
    const js = await res.text();
    expect(js).toContain("groupSlotsByUserDate");
  });
});
