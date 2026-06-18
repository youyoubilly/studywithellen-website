import { describe, expect, it } from "vitest";
import {
  dateKeyInZone,
  formatTimezoneOffset,
  localDateTimeInZoneToIso,
} from "../src/timezone.js";

describe("timezone helpers", () => {
  it("formats Asia/Shanghai offset as +08:00", () => {
    const date = new Date("2026-06-11T12:00:00+08:00");
    expect(formatTimezoneOffset(date, "Asia/Shanghai")).toBe("+08:00");
  });

  it("builds ISO for local wall time in Shanghai", () => {
    expect(localDateTimeInZoneToIso("2026-06-11", 10, 0, "Asia/Shanghai")).toBe(
      "2026-06-11T10:00:00+08:00",
    );
  });

  it("maps instant to date key in user timezone", () => {
    const iso = "2026-06-11T22:00:00+08:00";
    expect(dateKeyInZone(iso, "Asia/Shanghai")).toBe("2026-06-11");
    expect(dateKeyInZone(iso, "America/New_York")).toBe("2026-06-11");
  });
});

describe("user-date grouping", () => {
  it("groups slots by local calendar date", () => {
    const slots = [
      { id: "2026-06-11T10:00:00+08:00", startIso: "2026-06-11T10:00:00+08:00" },
      { id: "2026-06-22T10:00:00+08:00", startIso: "2026-06-22T10:00:00+08:00" },
    ];

    const groups = new Map<string, string[]>();
    for (const slot of slots) {
      const key = dateKeyInZone(slot.startIso, "Asia/Shanghai");
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(slot.id);
    }

    expect(groups.get("2026-06-11")).toEqual(["2026-06-11T10:00:00+08:00"]);
    expect(groups.get("2026-06-22")).toEqual(["2026-06-22T10:00:00+08:00"]);
  });
});
