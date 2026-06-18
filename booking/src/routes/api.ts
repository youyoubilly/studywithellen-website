import { Hono } from "hono";
import type { AppConfig } from "../config.js";
import { createBookingRequest, listRecentBookingRequests } from "../db.js";
import {
  formatBookingNotification,
  sendTelegramToAll,
} from "../notify/telegram.js";
import {
  isTelegramNotifyConfigured,
  resolveTelegramChatIds,
} from "../notify/telegram-recipients.js";
import { checkRateLimit } from "../rate-limit.js";
import { generateAvailableSlots, isValidSlotId } from "../slots.js";
import { bookingRequestSchema } from "../validation.js";

function getClientIp(headerValue: string | undefined): string {
  if (!headerValue) return "unknown";
  return headerValue.split(",")[0]?.trim() || "unknown";
}

function resolveFormLocale(value: unknown): "zh" | "en" {
  return value === "en" ? "en" : "zh";
}

function redirectFormError(
  c: { redirect: (location: string, status: 303) => Response },
  locale: "zh" | "en",
  error: "validation" | "rate_limited" | "invalid_slot",
): Response {
  return c.redirect(`/book/?lang=${locale}&error=${error}`, 303);
}

function isAgentAuthorized(
  config: AppConfig,
  headerToken: string | undefined,
): boolean {
  if (!config.bookingAgentToken) return false;
  return headerToken === config.bookingAgentToken;
}

export function createApiRoutes(
  config: AppConfig,
  database: ReturnType<typeof import("../db.js").initDb>,
) {
  const api = new Hono();

  api.get("/slots", (c) => {
    const slots = generateAvailableSlots(config.schedule);
    const { timezone, start, end, workdays } = config.schedule;
    return c.json({
      slots,
      studioTimezone: timezone,
      studioHours: { start, end, workdays },
      maxPreferences: config.schedule.maxPreferences,
    });
  });

  api.get("/requests/recent", (c) => {
    if (!isAgentAuthorized(config, c.req.header("x-booking-agent-token"))) {
      return c.json({ error: "unauthorized" }, 401);
    }

    const limit = Math.min(
      50,
      Math.max(1, Number(c.req.query("limit") ?? 10)),
    );
    const rows = listRecentBookingRequests(database, limit);
    return c.json({
      requests: rows.map((row) => ({
        id: row.id,
        createdAt: row.created_at,
        name: row.name,
        email: row.email,
        phone: row.phone,
        purpose: row.purpose,
        preferredSlots: JSON.parse(row.preferred_slots) as string[],
        note: row.note,
        locale: row.locale,
        clientTimezone: row.client_timezone,
        status: row.status,
      })),
    });
  });

  api.post("/requests", async (c) => {
    const contentType = c.req.header("content-type") ?? "";
    let body: Record<string, unknown>;

    if (contentType.includes("application/json")) {
      body = await c.req.json();
    } else {
      const form = await c.req.parseBody();
      body = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        purpose: form.purpose,
        note: form.note,
        locale: form.locale,
        website: form.website,
        clientTimezone: form.clientTimezone,
        preferredSlots: form.preferredSlots,
      };

      if (typeof body.preferredSlots === "string") {
        body.preferredSlots = [body.preferredSlots];
      } else if (Array.isArray(body.preferredSlots)) {
        body.preferredSlots = body.preferredSlots;
      } else {
        body.preferredSlots = [];
      }
    }

    const parsed = bookingRequestSchema.safeParse(body);
    const formLocale = resolveFormLocale(body.locale);
    const wantsJson = contentType.includes("application/json");

    if (!parsed.success) {
      if (wantsJson) {
        return c.json(
          { error: "validation_failed", details: parsed.error.flatten() },
          400,
        );
      }
      return redirectFormError(c, formLocale, "validation");
    }

    const clientIp = getClientIp(
      c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip"),
    );

    if (!checkRateLimit(clientIp)) {
      if (wantsJson) {
        return c.json({ error: "rate_limited" }, 429);
      }
      return redirectFormError(c, parsed.data.locale, "rate_limited");
    }

    const slots = generateAvailableSlots(config.schedule);
    const invalidSlot = parsed.data.preferredSlots.find(
      (slotId) => !isValidSlotId(config.schedule, slotId),
    );

    if (invalidSlot) {
      if (wantsJson) {
        return c.json({ error: "invalid_slot", slotId: invalidSlot }, 400);
      }
      return redirectFormError(c, parsed.data.locale, "invalid_slot");
    }

    const row = createBookingRequest(database, {
      name: parsed.data.name,
      email: parsed.data.email || undefined,
      phone: parsed.data.phone || undefined,
      purpose: parsed.data.purpose,
      preferredSlots: parsed.data.preferredSlots,
      note: parsed.data.note || undefined,
      locale: parsed.data.locale,
      clientIp,
      clientTimezone: parsed.data.clientTimezone?.trim() || undefined,
    });

    let telegramWarning: string | undefined;
    const chatIds = resolveTelegramChatIds(config);
    if (config.telegram.botToken && isTelegramNotifyConfigured(config)) {
      const message = formatBookingNotification(row, slots);
      const result = await sendTelegramToAll(
        config.telegram.botToken,
        chatIds,
        message,
      );
      if (!result.ok) {
        telegramWarning = result.error;
      } else if (result.error) {
        telegramWarning = result.error;
      }
    }

    const wantsJsonResponse = contentType.includes("application/json");
    if (wantsJsonResponse) {
      return c.json(
        {
          id: row.id,
          status: row.status,
          telegramWarning,
        },
        201,
      );
    }

    const locale = parsed.data.locale;
    const successUrl = `/book/success?id=${row.id}&lang=${locale}`;
    return c.redirect(successUrl, 303);
  });

  return api;
}

export type { BookingRequestRow } from "../db.js";
