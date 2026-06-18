import type { ScheduleConfig } from "./config.js";
import { localDateTimeInZoneToIso } from "./timezone.js";

export interface TimeSlot {
  id: string;
  label: string;
  labelEn: string;
  startIso: string;
  endIso: string;
}

function parseTime(value: string): { hour: number; minute: number } {
  const [hour, minute] = value.split(":").map(Number);
  return { hour, minute };
}

function formatDateKey(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getWeekday(date: Date, timeZone: string): number {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  }).format(date);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[weekday] ?? 0;
}

function formatSlotLabel(
  dateKey: string,
  hour: number,
  minute: number,
  slotMinutes: number,
  locale: "zh" | "en",
): { label: string; labelEn: string } {
  const endHour = hour + Math.floor((minute + slotMinutes) / 60);
  const endMinute = (minute + slotMinutes) % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const range = `${pad(hour)}:${pad(minute)}–${pad(endHour)}:${pad(endMinute)}`;

  if (locale === "zh") {
    const [, month, day] = dateKey.split("-");
    return {
      label: `${Number(month)}月${Number(day)}日 ${range}`,
      labelEn: `${dateKey} ${range}`,
    };
  }

  return {
    label: `${dateKey} ${range}`,
    labelEn: `${dateKey} ${range}`,
  };
}

function buildSlotIso(
  dateKey: string,
  hour: number,
  minute: number,
  timeZone: string,
): string {
  return localDateTimeInZoneToIso(dateKey, hour, minute, timeZone);
}

export function generateAvailableSlots(
  schedule: ScheduleConfig,
  now: Date = new Date(),
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const { timezone, workdays, start, end, slotMinutes, horizonDays } = schedule;
  const { hour: startHour, minute: startMinute } = parseTime(start);
  const { hour: endHour, minute: endMinute } = parseTime(end);

  for (let offset = 1; offset <= horizonDays; offset++) {
    const day = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000);
    const dateKey = formatDateKey(day, timezone);
    const weekday = getWeekday(day, timezone);

    if (!workdays.includes(weekday)) continue;

    let hour = startHour;
    let minute = startMinute;

    while (hour < endHour || (hour === endHour && minute < endMinute)) {
      const nextMinute = minute + slotMinutes;
      const slotEndHour = hour + Math.floor(nextMinute / 60);
      const slotEndMinute = nextMinute % 60;

      if (
        slotEndHour > endHour ||
        (slotEndHour === endHour && slotEndMinute > endMinute)
      ) {
        break;
      }

      const startIso = buildSlotIso(dateKey, hour, minute, timezone);
      const endIso = buildSlotIso(dateKey, slotEndHour, slotEndMinute, timezone);
      const zhLabels = formatSlotLabel(
        dateKey,
        hour,
        minute,
        slotMinutes,
        "zh",
      );

      slots.push({
        id: startIso,
        label: zhLabels.label,
        labelEn: zhLabels.labelEn,
        startIso,
        endIso,
      });

      hour = slotEndHour;
      minute = slotEndMinute;
    }
  }

  return slots;
}

export function isValidSlotId(
  schedule: ScheduleConfig,
  slotId: string,
  now: Date = new Date(),
): boolean {
  return generateAvailableSlots(schedule, now).some((slot) => slot.id === slotId);
}
