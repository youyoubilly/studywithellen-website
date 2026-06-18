import { describe, expect, it } from "vitest";
import { bookingRequestSchema } from "../src/validation.js";

describe("bookingRequestSchema", () => {
  it("requires email or phone", () => {
    const result = bookingRequestSchema.safeParse({
      name: "Test User",
      purpose: "trial",
      preferredSlots: ["2026-06-11T10:00:00+08:00"],
      locale: "zh",
    });
    expect(result.success).toBe(false);
  });

  it("accepts email-only submissions", () => {
    const result = bookingRequestSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      purpose: "trial",
      preferredSlots: ["2026-06-11T10:00:00+08:00"],
      locale: "en",
    });
    expect(result.success).toBe(true);
  });

  it("rejects honeypot submissions", () => {
    const result = bookingRequestSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      purpose: "trial",
      preferredSlots: ["2026-06-11T10:00:00+08:00"],
      locale: "zh",
      website: "spam",
    });
    expect(result.success).toBe(false);
  });
});
