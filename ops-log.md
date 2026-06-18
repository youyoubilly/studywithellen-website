# Ellen English Studio — Ops Log

> HK1 deployment and server changes. Append only.

## 2026-06-19 — Booking link & submit fixes (v1.8.1)

- `BOOKING_URL` → `/book/`; `SITE_URL` → `https://studywithellen.com`
- Booking form: purpose hidden input, client validation, server error redirects
- Deploy: `deploy-booking.sh` + `astro build` → `/var/www/ellen/`

## 2026-06-19 — Booking UX & timezone (v1.8.0)

- Migrated `ellen-booking` into repo at `booking/`
- Modular slot picker: date tabs, clickable time blocks, timezone dropdown
- `clientTimezone` on requests; Telegram dual-timezone lines
- Deploy: `scripts/deploy-booking.sh` → `/opt/ellen-booking`, restart `ellen-booking.service`
- Booking unit tests: 20 passed; live `/book/` on port 8787

## 2026-06-10 — Stage 11 Ellen assets (v1.4.0)

- Hero: Ellen portrait from CV (`website/assets/ellen-portrait.jpg`) → WebP, stock desk retired
- OG: auto-generated share card with portrait + brand text
- Asset pipeline: `scripts/sync-ellen-assets.sh` (runs on build/deploy)
- WeChat QR + Calendar URL still pending Ellen-provided files
- Deployed to http://hk1.youyoubilly.com:8080

## 2026-06-10 — Stage 10 EN copy + bilingual QA (v1.3.0)

- English copy review on `/en/` — recruiter tone, View credentials CTA
- Bilingual smoke + prod E2E + Lighthouse on `/` and `/en/`
- Deployed to http://hk1.youyoubilly.com:8080/en/

## 2026-06-10 — Stage 9 i18n (v1.2.0)

- Bilingual routes: `/` (zh-CN) + `/en/` (English)
- `src/i18n/` content layer, `LangSwitch`, `hreflang` alternates
- Deployed to http://hk1.youyoubilly.com:8080 and http://hk1.youyoubilly.com:8080/en/
- QA: 43 unit + 194 E2E passed locally; prod smoke OK

## 2026-06-10 — Stage 8 visual images (v1.1.0)

- Unsplash stock: Hero, Services ×3, Why bg, OG share (~668KB)
- Deployed to http://hk1.youyoubilly.com:8080

## 2026-06-10 — Stage 7 public launch (v1.0.0)

- Full delivery verification: local QA + 152 prod E2E + Lighthouse + browser vision QA
- [`HANDOFF.md`](HANDOFF.md) + [`hk1/README.md`](../README.md) published
- Rollback steps documented in HANDOFF.md
- **Public URL:** http://hk1.youyoubilly.com:8080

## 2026-06-10 — Stage 6 HK1 deploy (LIVE)

- **URL:** http://hk1.youyoubilly.com:8080
- Pre-flight: truncated `/var/log/btmp` (890M→2K), `journalctl --vacuum-size=500M` (~1G freed)
- Installed: nginx, fail2ban (sshd jail), rsync
- UFW: added `8080/tcp` (Ellen English Studio)
- nginx vhost: `/etc/nginx/sites-available/ellen` → docroot `/var/www/ellen`
- Deploy: `rsync site/dist/` via `scripts/deploy-hk1.sh`
- Smoke: HTTP 200 + security headers; 24 prod E2E passed

## 2026-06-10 — Stage 5 QA hardening

- `ops/nginx-ellen.conf` + `scripts/verify-nginx-security.sh`
- E2E `qa-hardening.spec.ts` (anchors, external link rel, content checklist)
- `npm run qa` pre-deploy gate; build verified static-only (no client JS)
- npm audit high: clean; 152 E2E passed (30 unit tests)

## 2026-06-10 — Stage 4 visual polish

- Shared design utilities (`section-pad`, `container-page`, card shadows/hover)
- `SectionHeading` component with gold accent bar
- Hero mobile fix: headline + CTAs above fold (text-first layout)
- Header blur/shadow; sticky bar safe-area padding
- E2E `visual-polish.spec.ts`; Lighthouse mobile: perf 100 / a11y 96 / BP 100
- 119 E2E tests passing

## 2026-06-10 — Stage 3 consultation & contact

- `#consultation` — 3 booking paths (WeChat → #contact, email, Google Calendar placeholder)
- `#contact` — QR placeholder, Ellen_inGZ, ellen.mj.a@gmail.com, 汇景新城
- Mobile sticky bar: 预约咨询
- 110 E2E tests passing

## 2026-06-10 — Stage 2 content sections

- Audience, Services (IELTS featured), Why Ellen, Background, Employers, FAQ
- Content driven by `site/src/lib/content.ts` mapped from `website/copy/`
- 78 Playwright E2E tests passing

## 2026-06-10 — Stage 1 layout shell

- Header (sticky), Hero (#hero), Footer with design-brief tokens
- Nav targets: `#consultation`, `#contact`, `#employers` (stub sections in footer)
- 33 Playwright E2E tests passing across 375 / 768 / 1280 viewports

## 2026-06-10 — Stage 0 foundation

- Created Astro project at `site/` (Tailwind, Vitest, Playwright)
- Public URL target: `http://hk1.youyoubilly.com:8080`
- nginx vhost + UFW: **pending** (Stage 6)
