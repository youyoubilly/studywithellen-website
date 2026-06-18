# Ellen Wang English Studio — Handoff

Public landing page for Ellen’s IELTS / academic / business English teaching studio.

## Live site

| Locale | URL |
|--------|-----|
| 中文（默认） | **http://hk1.youyoubilly.com:8080/** |
| English (employers / HR) | **http://hk1.youyoubilly.com:8080/en/** |

Share URLs in WeChat — include **`:8080`** until HTTPS on a custom domain is set up.

For international school recruiters, share the **`/en/`** link directly.

---

## For Ellen (next steps)

| Task | Where | Notes |
|------|-------|-------|
| Replace Google Calendar link | `site/src/config/site.ts` → `CALENDAR_BOOKING_URL` | Create Google Appointment Schedule |
| Add WeChat QR | `website/assets/wechat-qr-ellen_inGZ.png` → run deploy | Work ID: **Ellen_inGZ** — auto-wires on sync |
| Upgrade portrait (optional) | Replace `website/assets/ellen-portrait.jpg` | CV photo live; professional ≥800px shoot recommended |
| Add custom OG (optional) | `website/assets/og-share.jpg` | Overrides auto-generated share card |
| Share site | WeChat / parents / schools | Ask clients to note **试课** or **招聘** when adding WeChat |
| Share English page | Schools / HR | Send **`/en/`** link for full English experience |

**Done (Stage 11):** Hero portrait + OG share card wired via `scripts/sync-ellen-assets.sh`.

After assets or copy changes, ask Billy to redeploy (see below).

---

## For Billy (maintain & redeploy)

```bash
cd hk1/Ellen-English-Studio/site

# Edit copy in src/i18n/zh.ts and src/i18n/en.ts (source: website/copy/)
# Edit images: drop files in website/assets/ then ../scripts/sync-ellen-assets.sh
# Edit config in src/config/site.ts

../scripts/deploy-hk1.sh    # QA gate + rsync + smoke
../scripts/smoke-prod.sh    # Quick prod check only
```

First-time server setup (already done 2026-06-10):

```bash
../scripts/setup-hk1.sh
```

Full delivery verification (local QA + prod E2E + Lighthouse):

```bash
../scripts/verify-delivery.sh
```

### Rollback

If a deploy breaks the site:

```bash
# On HK1 — restore previous index (if you kept a backup)
ssh hk1 'ls -la /var/www/ellen/'

# Or redeploy last known-good build from your machine
cd hk1/Ellen-English-Studio/site
git checkout <good-commit>   # if using git
npm ci && ../scripts/deploy-hk1.sh
```

Emergency nginx disable (site only):

```bash
ssh hk1 'sudo rm /etc/nginx/sites-enabled/ellen && sudo nginx -t && sudo systemctl reload nginx'
```

Re-enable:

```bash
ssh hk1 'sudo ln -sf /etc/nginx/sites-available/ellen /etc/nginx/sites-enabled/ellen && sudo nginx -t && sudo systemctl reload nginx'
```

---

## Architecture

| Path | Role |
|------|------|
| `site/` | Astro 6 + Tailwind 4 app |
| `site/src/config/site.ts` | URL, contact, SEO, calendar |
| `site/src/i18n/zh.ts` / `en.ts` | Page copy (Chinese + English) |
| `site/src/lib/content.ts` | Chinese re-exports (legacy/tests) |
| `ops/nginx-ellen.conf` | HK1 nginx vhost |
| `/var/www/ellen/` on HK1 | Production static files |

Stack: static HTML/CSS only — no server-side code, no client JavaScript bundles.

---

## Stage 11 verification (2026-06-10)

| Check | Result |
|-------|--------|
| Ellen portrait on Hero | CV extract → WebP, live on `/` and `/en/` |
| OG share card | Auto-generated 1200×630 with portrait |
| Asset sync | `scripts/sync-ellen-assets.sh` on build/deploy |
| WeChat QR | Still placeholder — awaiting `wechat-qr-ellen_inGZ.png` |
| Google Calendar | Still placeholder URL |

---

## Stage 10 verification (2026-06-10)

| Check | Result |
|-------|--------|
| Local `npm run qa` | 48 unit + 225 E2E passed |
| Prod smoke (`smoke-prod.sh`) | `/` + `/en/` HTTP 200, security headers OK |
| English copy gates | `en.copy.test.ts` — no stray Chinese UI strings |
| Lighthouse mobile `/en/` | Perf **98**, A11y **96**, SEO **92**, BP **78**† |

Share **`/en/`** with international school HR; Chinese clients use **`/`**.

---

## Stage 7 verification (2026-06-10)

| Check | Result |
|-------|--------|
| Local `npm run qa` | 30 unit + 152 E2E passed |
| Prod smoke (`smoke-prod.sh`) | HTTP 200, security headers OK |
| Prod E2E all viewports | 152 passed |
| Lighthouse mobile (prod) | Perf **99**, A11y **96**, SEO **92**, BP **78**† |
| Browser vision QA | Hero, consultation, contact, employers OK at 375 / 768 / 1280 |
| Interactive CTAs | Header 预约咨询 → `#consultation`, 微信咨询 → `#contact` |
| DNS | `hk1.youyoubilly.com` → `43.240.13.141` |
| HK1 services | nginx + fail2ban active; UFW `8080/tcp` open |
| Coexistence | SS `:9450`, HAProxy `:9453–9455` unchanged |

† Best Practices **78** on production is expected on **HTTP-only** (Lighthouse flags missing HTTPS). Resolves when certbot/HTTPS is added.

---

## Future: HTTPS & Ellen’s domain

1. Point Ellen’s domain A record to HK1 (`43.240.13.141`)
2. Update `SITE_HOST` in `site.ts` + redeploy
3. `certbot` nginx plugin for `:443`
4. Optional: redirect `http://hk1.youyoubilly.com:8080` → new HTTPS URL

Optional interim: certbot for `hk1.youyoubilly.com` on `:443`.

---

## Docs

- [`site/AGENTS.md`](site/AGENTS.md) — agent handbook
- [`site/CHANGELOG.md`](site/CHANGELOG.md) — release history
- [`ops-log.md`](ops-log.md) — server ops log
- [`website/design-brief.md`](website/design-brief.md) — visual spec
- [`website/assets/README.md`](website/assets/README.md) — asset checklist
