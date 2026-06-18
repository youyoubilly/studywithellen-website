/** Format IANA timezone offset as +HH:MM for a given instant. */
export function formatTimezoneOffset(
  date: Date,
  timeZone: string,
): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    timeZoneName: "longOffset",
  }).formatToParts(date);

  const raw = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  if (raw === "GMT") return "+00:00";

  const match = raw.match(/^GMT([+-])(\d{1,2})(?::(\d{2}))?$/);
  if (!match) return "+00:00";

  const sign = match[1];
  const hours = match[2]!.padStart(2, "0");
  const minutes = (match[3] ?? "00").padStart(2, "0");
  return `${sign}${hours}:${minutes}`;
}

/** Build ISO 8601 string for a wall-clock time in the given IANA timezone. */
export function localDateTimeInZoneToIso(
  dateKey: string,
  hour: number,
  minute: number,
  timeZone: string,
): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const [year, month, day] = dateKey.split("-").map(Number);
  let utcMs = Date.UTC(year, month - 1, day, hour, minute);

  for (let i = 0; i < 6; i++) {
    const instant = new Date(utcMs);
    const formatted = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(instant);

    const part = (type: Intl.DateTimeFormatPartTypes) =>
      Number(formatted.find((p) => p.type === type)?.value ?? "0");

    const fy = part("year");
    const fm = part("month");
    const fd = part("day");
    let fh = part("hour");
    if (fh === 24) fh = 0;
    const fmin = part("minute");

    if (fy === year && fm === month && fd === day && fh === hour && fmin === minute) {
      const offset = formatTimezoneOffset(instant, timeZone);
      return `${dateKey}T${pad(hour)}:${pad(minute)}:00${offset}`;
    }

    utcMs +=
      ((hour - fh) * 60 + (minute - fmin) + (day - fd) * 1440) * 60_000;
  }

  const offset = formatTimezoneOffset(new Date(utcMs), timeZone);
  return `${dateKey}T${pad(hour)}:${pad(minute)}:00${offset}`;
}

export function formatTimeInZone(
  iso: string,
  timeZone: string,
  locale: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export function formatDateInZone(
  iso: string,
  timeZone: string,
  locale: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

export function dateKeyInZone(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}
