import { describe, expect, it } from "vitest";
import { createApp } from "../src/server.js";
import { resetDbForTests } from "../src/db.js";
import { resetRateLimits } from "../src/rate-limit.js";
import { mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { AppConfig } from "../src/config.js";
import { loadSchedule } from "../src/config.js";

function testConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    port: 8787,
    dataDir: mkdtempSync(join(tmpdir(), "ellen-booking-")),
    schedule: loadSchedule(),
    telegram: { botToken: "", chatId: "", chatIds: [] },
    bookingAgentToken: "test-agent-token",
    telegramInboxEnabled: false,
    ...overrides,
  };
}

describe("booking API", () => {
  it("creates booking requests via JSON", async () => {
    resetDbForTests();
    resetRateLimits();
    const app = createApp(testConfig());
    const slotsRes = await app.request("/book/api/slots");
    const { slots } = (await slotsRes.json()) as {
      slots: Array<{ id: string }>;
    };

    const response = await app.request("/book/api/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.0.1",
      },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        purpose: "trial",
        preferredSlots: [slots[0]!.id],
        locale: "en",
      }),
    });

    expect(response.status).toBe(201);
    const payload = (await response.json()) as { id: string; status: string };
    expect(payload.status).toBe("pending");
    expect(payload.id).toMatch(/^[a-f0-9-]{8,}$/i);
  });

  it("stores clientTimezone when provided", async () => {
    resetDbForTests();
    resetRateLimits();
    const app = createApp(testConfig());
    const slotsRes = await app.request("/book/api/slots");
    const { slots } = (await slotsRes.json()) as {
      slots: Array<{ id: string }>;
    };

    const response = await app.request("/book/api/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.0.3",
      },
      body: JSON.stringify({
        name: "TZ User",
        email: "tz@example.com",
        purpose: "trial",
        preferredSlots: [slots[0]!.id],
        locale: "en",
        clientTimezone: "Europe/London",
      }),
    });

    expect(response.status).toBe(201);

    const recent = await app.request("/book/api/requests/recent", {
      headers: { "X-Booking-Agent-Token": "test-agent-token" },
    });
    const body = (await recent.json()) as {
      requests: Array<{ clientTimezone: string | null }>;
    };
    expect(body.requests[0]?.clientTimezone).toBe("Europe/London");
  });

  it("lists recent requests for authorized agent", async () => {
    resetDbForTests();
    resetRateLimits();
    const config = testConfig();
    const app = createApp(config);
    const slotsRes = await app.request("/book/api/slots");
    const { slots } = (await slotsRes.json()) as {
      slots: Array<{ id: string }>;
    };

    await app.request("/book/api/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.0.2",
      },
      body: JSON.stringify({
        name: "Ellen Test",
        email: "ellen@example.com",
        purpose: "trial",
        preferredSlots: [slots[0]!.id],
        locale: "zh",
      }),
    });

    const unauthorized = await app.request("/book/api/requests/recent");
    expect(unauthorized.status).toBe(401);

    const recent = await app.request("/book/api/requests/recent", {
      headers: { "X-Booking-Agent-Token": "test-agent-token" },
    });
    expect(recent.status).toBe(200);
    const body = (await recent.json()) as {
      requests: Array<{ name: string }>;
    };
    expect(body.requests[0]?.name).toBe("Ellen Test");
  });

  it("redirects HTML form posts with validation errors", async () => {
    resetDbForTests();
    resetRateLimits();
    const app = createApp(testConfig());

    const response = await app.request("/book/api/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-forwarded-for": "10.0.0.4",
      },
      body: new URLSearchParams({
        name: "No Contact",
        purpose: "trial",
        locale: "en",
        preferredSlots: "2026-06-22T10:00:00+08:00",
      }).toString(),
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/book/?lang=en&error=validation");
  });
});
