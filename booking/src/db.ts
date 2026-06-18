import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { AppConfig } from "./config.js";

export interface BookingRequestRow {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  phone: string | null;
  purpose: string;
  preferred_slots: string;
  note: string | null;
  locale: string;
  client_ip: string | null;
  client_timezone: string | null;
  status: string;
}

export interface CreateBookingInput {
  name: string;
  email?: string;
  phone?: string;
  purpose: "trial" | "recruitment";
  preferredSlots: string[];
  note?: string;
  locale: string;
  clientIp?: string;
  clientTimezone?: string;
}

let db: DatabaseSync | null = null;

export function initDb(config: AppConfig): DatabaseSync {
  if (db) return db;

  mkdirSync(config.dataDir, { recursive: true });
  const dbPath = join(config.dataDir, "bookings.db");
  db = new DatabaseSync(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS booking_requests (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      purpose TEXT NOT NULL,
      preferred_slots TEXT NOT NULL,
      note TEXT,
      locale TEXT NOT NULL,
      client_ip TEXT,
      status TEXT NOT NULL DEFAULT 'pending'
    );
    CREATE INDEX IF NOT EXISTS idx_booking_created_at ON booking_requests(created_at);
  `);

  const columns = db
    .prepare(`PRAGMA table_info(booking_requests)`)
    .all() as Array<{ name: string }>;
  if (!columns.some((col) => col.name === "client_timezone")) {
    db.exec(`ALTER TABLE booking_requests ADD COLUMN client_timezone TEXT`);
  }

  return db;
}

export function createBookingRequest(
  database: DatabaseSync,
  input: CreateBookingInput,
): BookingRequestRow {
  const id = crypto.randomUUID().slice(0, 8);
  const createdAt = new Date().toISOString();

  database
    .prepare(
      `INSERT INTO booking_requests
      (id, created_at, name, email, phone, purpose, preferred_slots, note, locale, client_ip, client_timezone, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    )
    .run(
      id,
      createdAt,
      input.name,
      input.email ?? null,
      input.phone ?? null,
      input.purpose,
      JSON.stringify(input.preferredSlots),
      input.note ?? null,
      input.locale,
      input.clientIp ?? null,
      input.clientTimezone ?? null,
    );

  return getBookingRequest(database, id)!;
}

export function getBookingRequest(
  database: DatabaseSync,
  id: string,
): BookingRequestRow | null {
  return (
    (database
      .prepare(`SELECT * FROM booking_requests WHERE id = ?`)
      .get(id) as BookingRequestRow | undefined) ?? null
  );
}

export function listRecentBookingRequests(
  database: DatabaseSync,
  limit = 10,
): BookingRequestRow[] {
  return database
    .prepare(
      `SELECT * FROM booking_requests ORDER BY created_at DESC LIMIT ?`,
    )
    .all(limit) as unknown as BookingRequestRow[];
}

export function resetDbForTests(): void {
  db = null;
}
