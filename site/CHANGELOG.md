# Changelog

All notable changes to the Ellen Wang English Studio website.

## [1.8.0] — 2026-06-19 — Booking UX & timezone

### Added

- `booking/` service in repo — modular slot picker (date tabs + clickable time blocks)
- Timezone dropdown with auto-detect; dates grouped by user's local calendar
- `clientTimezone` stored on requests; Telegram shows CST + client local time
- `scripts/deploy-booking.sh` for HK1 booking service deploy

### Changed

- Booking form brand colors aligned with design brief (`#1E3A5F` / `#B8860B`)
- Purpose selector uses pill buttons; noscript fallback keeps checkbox list

## [1.7.0] — 2026-06-10 — Self-hosted booking

### Added

- Self-hosted booking request form at `/book/` (proxied to `hk1/ellen-booking` service)
- Telegram notifications for new booking requests

### Changed

- Consultation “在线预约” card links to internal booking form instead of Google Calendar placeholder
- Nginx CSP updated — removed `calendar.google.com` from `frame-src`

## [1.6.0] — 2026-06-10 — SEO & social sharing

### Added

- Twitter/X `summary_large_image` cards with image alt text
- Open Graph enhancements — `og:site_name`, `og:locale:alternate`, `og:image:alt`, `og:image:secure_url`
- JSON-LD structured data — `WebSite`, `WebPage`, `ProfessionalService` (bilingual)
- Dynamic `robots.txt` and `sitemap.xml` with hreflang cross-links
- `meta robots` (max-image-preview), `theme-color`, `author`
- E2E `seo.spec.ts` and unit tests for SEO helpers

### Changed

- Canonical URLs normalized with trailing slashes (`/` and `/en/`)
- Meta descriptions and OG copy tuned for Tianhe District keywords
- Astro `site` config set for absolute URL generation

## [1.5.0] — 2026-06-10 — Estonian Blue theme

### Changed

- Site theme colors updated to **Estonian Blue** (`#0072CE`) — primary, accent, CTA buttons, footer, section markers, shadows, and employers tint
- OG share card gradient and typography colors aligned with new palette

## [1.4.1] — 2026-06-10 — Visual polish

### Changed

- Header responsive layout — full brand name on mobile, shorter CTA labels, WeChat nav hidden below `md` (contact section + sticky bar cover mobile)
- Hero — hide redundant EN subhead on small screens; portrait `object-position`; slightly larger mobile avatar ring
- Section headings — bilingual `titleEn` hidden on mobile; global `text-wrap: balance` on headings
- Contact — cleaner WeChat QR placeholder (ID + icon instead of dashed grid)
- Footer — email wraps on narrow viewports
- Mobile sticky bar — shorter label on phones; Services featured card lift only at `xl`
- Global — `scroll-padding-top` tuned; `overflow-x: hidden` on body

### Tests

- E2E layout/consultation specs updated for responsive header nav

## [1.4.0] — 2026-06-10 — Stage 11

### Added

- Ellen portrait from CV → `website/assets/ellen-portrait.jpg` → Hero (WebP + JPG)
- `scripts/sync-ellen-assets.sh` — portrait processing, OG card generation, QR sync
- Auto-generated OG share card (1200×630) with Ellen photo + brand copy
- `getHeroImage()` / `hasWechatQr()` — portrait-first with stock fallback

### Changed

- Hero uses Ellen portrait; stock desk image retired from hero (kept as fallback file)
- Mobile header shows circular portrait when available
- Contact renders real QR PNG when `website/assets/wechat-qr-ellen_inGZ.png` is present
- `npm run build` / deploy run `assets:sync` first

### Still pending (Ellen)

- WeChat work QR PNG (`wechat-qr-ellen_inGZ.png`)
- Google Calendar appointment URL in `site.ts`
- Optional: higher-res professional portrait to replace CV extract

## [1.3.0] — 2026-06-10 — Stage 10

### Changed

- English copy review — recruiter-facing tone across `/en/` (Hero, Audience, Services, FAQ, etc.)
- EN Hero secondary CTA: **View credentials** → `#background`
- Consultation card icons locale-aware (`WX` on English page)
- `smoke-prod.sh` and `verify-delivery.sh` — bilingual smoke + Lighthouse on `/` and `/en/`

### Added

- `src/i18n/en.copy.test.ts` — English copy quality gates
- Extended `e2e/i18n.spec.ts` — EN section parity, no Chinese UI leak, credentials CTA

## [1.2.0] — 2026-06-10 — Stage 9

### Added

- Bilingual routing: `/` (zh-CN) and `/en/` (English)
- `src/i18n/` content layer — `zh.ts`, `en.ts`, shared types
- `LangSwitch.astro` in header (path-based, no client JS)
- `HomePage.astro` shared shell for both locales
- `hreflang` alternates + per-locale canonical URLs
- Unit tests `i18n.test.ts`; E2E `i18n.spec.ts`

### Changed

- All section components accept `locale` prop and read copy from i18n
- `BaseLayout` — dynamic `lang`, SEO, and alternate links
- `content.ts` / `nav.ts` — re-export Chinese locale for backward compatibility

## [1.1.0] — 2026-06-10 — Stage 8

### Added

- Stock photography (Unsplash, ~668KB total): Hero, Services ×3, Why ambient bg, OG share
- `src/config/images.ts` + `Image.astro` — lazy load, alt text, credits registry
- E2E `images.spec.ts`; unit tests `images.test.ts`
- `og:image` meta for WeChat/social previews

### Changed

- `Hero.astro` — mobile banner + desktop figure with gradient overlay（过渡配图标注）
- `Services.astro` — 16:9 card header images
- `WhyEllen.astro` — subtle campus background texture

## [1.0.0] — 2026-06-10 — Stage 7 (public launch)

### Delivered

- **Live:** http://hk1.youyoubilly.com:8080
- [`HANDOFF.md`](../HANDOFF.md) — Ellen/Billy checklist, rollback, future HTTPS
- [`hk1/README.md`](../../README.md) — HK1 port 8080 documentation
- `scripts/verify-delivery.sh` — full local + prod verification gate

### Stage 7 verification

- Local QA: 30 unit, 152 E2E passed
- Production: 152 E2E passed (375 / 768 / 1280)
- Lighthouse mobile: Performance 99, Accessibility 96, SEO 92 (Best Practices 78 — HTTP-only)
- Browser vision QA on production: hero, consultation, contact, employers
- Security headers confirmed on production

### Known placeholders (v1.0)

- Hero portrait, WeChat QR, Google Calendar URL, OG share image

## [0.6.0] — 2026-06-10 — Stage 6

### Added

- `scripts/setup-hk1.sh` — one-time HK1 provisioning (nginx, fail2ban, UFW 8080, vhost)
- `scripts/smoke-prod.sh` — post-deploy curl smoke (HTTP 200, security headers, body checks)
- Deploy runs production smoke after nginx reload

### Deployed

- **Live:** [http://hk1.youyoubilly.com:8080](http://hk1.youyoubilly.com:8080)
- HK1: nginx on `:8080`, docroot `/var/www/ellen`, fail2ban enabled
- Pre-flight: `/var/log/btmp` truncated, journal vacuumed (~1G freed)

### Verified

- DNS → `43.240.13.141`
- Security headers on production (CSP, X-Frame-Options, etc.)
- 24 prod E2E tests passed (`BASE_URL=http://hk1.youyoubilly.com:8080`)

## [0.5.0] — 2026-06-10 — Stage 5

### Added

- `ops/nginx-ellen.conf` — HK1 vhost on `:8080` with security headers (Stage 6 deploy)
- `scripts/verify-nginx-security.sh` — validates required nginx headers before deploy
- E2E `qa-hardening.spec.ts` — section anchors, link safety, content checklist, no client JS
- Unit tests: `build-output.test.ts`, `nginx-security.test.ts`
- `npm run qa` — full pre-deploy gate; `npm run verify:nginx`, `npm run test:qa`

### Verified

- `npm audit --audit-level=high` — clean (moderate dev-only advisories in `@astrojs/check` chain)
- Static build: zero `.js` bundles, no `<script>` in `index.html`
- Lighthouse mobile (Stage 4): Performance 100, Accessibility 96, Best Practices 100

## [0.4.0] — 2026-06-10 — Stage 4

### Added

- Design utilities in `global.css`: `section-pad`, `container-page`, `card-base`, `card-hover`, shadow tokens, scroll-padding for sticky header
- `SectionHeading.astro` — gold accent bar, optional English subtitle, alignment prop
- E2E `visual-polish.spec.ts` — mobile above-the-fold checks, accent markers, employers background
- `npm run test:visual` and `npm run lighthouse` scripts

### Changed

- Hero mobile layout: text-first (compact EW row); full portrait on desktop only
- Header: backdrop blur and subtle shadow
- Mobile sticky bar: safe-area inset, larger tap target
- All sections migrated to shared spacing/card utilities; FAQ hover on summary; employers left gold border accent
- Consultation & Contact headings use `SectionHeading`

### Tests

- 24 unit tests, 119 E2E passed (10 skipped on non-mobile viewport)
- Lighthouse mobile: Performance 100, Accessibility 96, Best Practices 100

## [0.3.0] — 2026-06-10 — Stage 3

### Added

- `Consultation.astro` — `#consultation` with WeChat / Email / Google Calendar cards
- `Contact.astro` — `#contact` with QR placeholder, WeChat ID, mailto, location
- `MobileStickyBar.astro` — fixed bottom CTA on mobile (预约咨询)
- `buildMailtoUrl()` and `EXTERNAL_LINK` helpers in `site.ts`
- E2E `consultation.spec.ts` — CTA links, mailto, calendar, sticky bar, tap targets

### Changed

- Hero/header CTAs now scroll to full consultation & contact sections
- Removed sr-only anchor stubs from Employers section

### Tests

- 24 unit tests, 110 E2E passed (4 skipped on non-mobile)

## [0.2.0] — 2026-06-10 — Stage 2

### Added

- `src/lib/content.ts` — all section copy from `website/copy/`
- `Audience.astro` — 3 audience segments (students, parents, professionals)
- `Services.astro` — 3 course cards; IELTS featured with 热门 badge
- `WhyEllen.astro` — 6 differentiator cards including 非低龄
- `Background.astro` — timeline (启德 · 广州理工) + education + certs
- `Employers.astro` — English recruiter block on `#F0F4F8` background
- `FAQ.astro` — accordion; first 2 items open by default
- E2E `sections.spec.ts` — section IDs, FAQ expand, IELTS prominence

### Tests

- 21 unit tests, 78 E2E tests — all passing

## [0.1.0] — 2026-06-10 — Stage 1

### Added

- Design tokens in `global.css` (navy, gold, warm white, serif/sans stacks)
- `Header.astro` — sticky nav with 预约咨询 + 微信咨询 CTAs
- `Footer.astro` — copyright, contact line, anchor stubs for later sections
- `Hero.astro` — IELTS headline, credentials ribbon, dual CTAs, EW portrait placeholder
- `Button.astro` — reusable primary/secondary pill buttons
- `src/lib/nav.ts` — nav helpers + hero copy constants
- E2E `layout.spec.ts` — header, hero, footer, responsive overflow (mobile/tablet/desktop)

### Tests

- 12 unit tests, 33 E2E tests — all passing

## [0.0.1] — 2026-06-10 — Stage 0

### Added

- Astro 6 + Tailwind 4 project scaffold
- `src/config/site.ts` — URL, contact, SEO, calendar placeholder
- Vitest unit tests for site config
- Playwright E2E foundation tests (mobile / tablet / desktop)
- `BaseLayout.astro` with meta/OG tags
- Design tokens in `global.css` (navy, gold, warm white)
- Deploy script stub: `../scripts/deploy-hk1.sh`

### Target URL

- `http://hk1.youyoubilly.com:8080`
