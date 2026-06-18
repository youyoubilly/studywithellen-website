# Ellen Booking Service

Self-hosted consultation booking form for Ellen Wang English Studio.

- **URL:** `/book/` (proxied from nginx to port 8787)
- **Stack:** Hono + Node 22 + SQLite

## Commands

```bash
cd booking
npm run dev      # http://127.0.0.1:8787/book/
npm test
npm run typecheck
```

## Deploy (HK1)

```bash
../scripts/deploy-booking.sh
```

Syncs to `/opt/ellen-booking`, runs tests, restarts `ellen-booking.service`.

## Config

- Schedule: `config/schedule.yaml` (timezone, workdays, hours, horizon)
- Secrets: `/etc/ellen-booking.env` (Telegram, agent token)
