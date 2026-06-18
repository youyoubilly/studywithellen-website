import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./config.js";
import { initDb } from "./db.js";
import { startTelegramInbox } from "./notify/telegram-inbox.js";
import {
  isTelegramNotifyConfigured,
} from "./notify/telegram-recipients.js";
import { createApiRoutes } from "./routes/api.js";
import { createPageRoutes } from "./routes/pages.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BOOK_JS = readFileSync(join(ROOT, "public", "book.js"), "utf8");

export function createApp(config = loadConfig()) {
  const database = initDb(config);
  const app = new Hono({ strict: false });

  app.get("/health", (c) =>
    c.json({
      status: "ok",
      service: "ellen-booking",
      telegramConfigured: isTelegramNotifyConfigured(config),
      telegramInboxEnabled: config.telegramInboxEnabled,
    }),
  );

  const book = new Hono({ strict: false });
  book.get("/book.js", (c) =>
    c.body(BOOK_JS, 200, {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    }),
  );
  book.route("/api", createApiRoutes(config, database));
  book.route("/", createPageRoutes(config));
  app.route("/book", book);

  return app;
}

export function startServer(config = loadConfig()) {
  const app = createApp(config);

  if (config.telegramInboxEnabled) {
    console.warn(
      "telegram inbox polling enabled — disable TELEGRAM_INBOX_ENABLED when SophiaW agent-workspace polls the same token",
    );
    startTelegramInbox(config);
  }

  serve({ fetch: app.fetch, port: config.port }, (info) => {
    console.log(`ellen-booking listening on http://127.0.0.1:${info.port}`);
  });
  return app;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer();
}
