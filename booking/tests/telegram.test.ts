import { describe, expect, it } from "vitest";
import { formatBookingNotification } from "../src/notify/telegram.js";
import type { BookingRequestRow } from "../src/db.js";

describe("formatBookingNotification", () => {
  it("includes request details and preferred slots", () => {
    const row: BookingRequestRow = {
      id: "abc12345",
      created_at: "2026-06-10T10:00:00.000Z",
      name: "Billy Wang",
      email: "billy@example.com",
      phone: null,
      purpose: "trial",
      preferred_slots: JSON.stringify(["2026-06-11T10:00:00+08:00"]),
      note: "IELTS speaking",
      locale: "zh",
      client_ip: "127.0.0.1",
      client_timezone: "America/New_York",
      status: "pending",
    };

    const message = formatBookingNotification(row, [
      {
        id: "2026-06-11T10:00:00+08:00",
        label: "6月11日 10:00–11:00",
        labelEn: "2026-06-11 10:00–11:00",
        startIso: "2026-06-11T10:00:00+08:00",
        endIso: "2026-06-11T11:00:00+08:00",
      },
    ]);

    expect(message).toContain("#abc12345");
    expect(message).toContain("Billy Wang");
    expect(message).toContain("2026-06-11 10:00–11:00");
    expect(message).toContain("Client timezone: America/New_York");
    expect(message).toContain("confirm the final time");
  });
});
