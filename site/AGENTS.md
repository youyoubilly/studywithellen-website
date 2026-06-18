# AGENTS.md — Ellen Wang English Studio Website

Agent handbook for long-run development of this static site.

## Project layout

```
hk1/Ellen-English-Studio/
├── site/                 ← Astro app (work here)
│   ├── src/config/site.ts   ← URLs, contact, SEO, calendar URL
│   ├── src/components/      ← Section components (Stage 1+)
│   ├── src/layouts/         ← BaseLayout.astro
│   ├── e2e/                 ← Playwright tests
│   └── CHANGELOG.md
├── website/copy/         ← Source copy (markdown)
├── website/design-brief.md
├── ops/nginx-ellen.conf  ← HK1 nginx vhost (Stage 6)
├── scripts/deploy-hk1.sh
├── HANDOFF.md            ← Ellen/Billy launch checklist
└── ops-log.md
```

## Commands

```bash
cd hk1/Ellen-English-Studio/site

npm run dev          # Local dev → http://127.0.0.1:4321
npm run build        # Static output → dist/
npm run preview      # Preview production build
npm test             # Vitest unit tests
npm run test:e2e     # Playwright (starts dev server)
npm run check        # astro check (types)
npm audit --audit-level=high
npm run verify:nginx # ops/nginx-ellen.conf security headers
npm run verify:delivery # Full Stage 7 gate (local QA + prod E2E + Lighthouse)
```

Deploy (Stage 6+):

```bash
# First time on a fresh HK1:
../scripts/setup-hk1.sh

# Build, QA gate, rsync, smoke:
npm run qa           # Run full gate before deploy
../scripts/deploy-hk1.sh

# Prod smoke only:
../scripts/smoke-prod.sh
```

## Public URL

- **Production:** `http://hk1.youyoubilly.com:8080`
- Config: `src/config/site.ts` → `SITE_HOST`, `SITE_PORT`, `SITE_URL`

## Stage gates

Before marking a stage complete:

1. `npm test` — all unit tests pass
2. `npm run build` — zero errors
3. `npm run check` — no type errors
4. UI changes → `npm run test:e2e` + **Cursor browser** visual QA at 375 / 768 / 1280px
5. Update `CHANGELOG.md`; deploys also update `../ops-log.md`

## Visual QA (Cursor browser)

1. `npm run dev`
2. `browser_navigate` → `http://127.0.0.1:4321`
3. CDP viewport: 375×812, 768×1024, 1280×800
4. `browser_snapshot` + `browser_take_screenshot`
5. Fix spacing/typography/CTAs; re-verify

## Design tokens

From `../website/design-brief.md`:

| Token | Value |
|-------|-------|
| Primary | `#1E3A5F` |
| Accent | `#B8860B` |
| Background | `#FAFAF8` |
| Employers bg | `#F0F4F8` |

## Config to update later

| Key | File | When |
|-----|------|------|
| `CALENDAR_BOOKING_URL` | `site.ts` | Ellen creates Google Calendar appointments |
| Portrait / QR | `public/` or `website/assets/` | When photos ready |
| `SITE_HOST` / domain | `site.ts` + nginx | Ellen's own domain |

## Security

- Static site only — no server-side forms or secrets in repo
- External links: `rel="noopener noreferrer"`
- nginx security headers on HK1 (Stage 6) — see `../ops/nginx-ellen.conf`
- Never commit `.env` with credentials

## Audiences

1. **IELTS students / parents** — hero, services, consultation CTAs
2. **School employers** — `#employers`, `#background` timeline

Copy source: `../website/copy/`
