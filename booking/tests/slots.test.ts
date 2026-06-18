import { describe, expect, it } from "vitest";
import { loadSchedule } from "../src/config.js";
import {
  generateAvailableSlots,
  isValidSlotId,
} from "../src/slots.js";

describe("generateAvailableSlots", () => {
  const schedule = loadSchedule();

  it("excludes today and includes only configured workdays", () => {
    const now = new Date("2026-06-10T08:00:00+08:00"); // Tuesday
    const slots = generateAvailableSlots(schedule, now);
    expect(slots.length).toBeGreaterThan(0);
    expect(slots.every((slot) => !slot.id.includes("2026-06-10"))).toBe(true);
    expect(slots.every((slot) => slot.id.endsWith("+08:00"))).toBe(true);
  });

  it("limits horizon to 7 days from tomorrow", () => {
    const now = new Date("2026-06-10T08:00:00+08:00");
    const slots = generateAvailableSlots(schedule, now);
    const dates = new Set(slots.map((slot) => slot.startIso.slice(0, 10)));
    expect(dates.size).toBeLessThanOrEqual(5);
    expect(Array.from(dates).every((date) => date <= "2026-06-17")).toBe(true);
  });

  it("validates slot ids against generated set", () => {
    const now = new Date("2026-06-10T08:00:00+08:00");
    const slots = generateAvailableSlots(schedule, now);
    expect(isValidSlotId(schedule, slots[0]!.id, now)).toBe(true);
    expect(isValidSlotId(schedule, "2026-06-10T10:00:00+08:00", now)).toBe(
      false,
    );
  });
});
