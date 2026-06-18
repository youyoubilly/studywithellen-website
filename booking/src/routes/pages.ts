import { Hono } from "hono";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { AppConfig } from "../config.js";
import { generateAvailableSlots } from "../slots.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const CSS = readFileSync(join(ROOT, "public", "book.css"), "utf8");

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function resolveLocale(
  langParam: string | undefined,
  acceptLanguage: string | undefined,
): "zh" | "en" {
  if (langParam === "en" || langParam === "zh") return langParam;
  if (acceptLanguage?.toLowerCase().startsWith("en")) return "en";
  return "zh";
}

function copy(locale: "zh" | "en") {
  if (locale === "en") {
    return {
      title: "Book a Consultation Request",
      intro:
        "Submit your preferred times — this is an application only. Ellen will contact you to confirm the final slot.",
      name: "Name",
      email: "Email",
      phone: "Phone",
      contactHint: "Provide at least email or phone.",
      purpose: "Purpose",
      trial: "Trial lesson",
      recruitment: "Recruitment",
      slots: "Preferred times (choose up to 5)",
      timezoneLabel: "Your timezone",
      timezoneHint:
        "Dates group by your local calendar. Ellen's studio is in Guangzhou (China Standard Time).",
      selectedCount: "{n}/{max} selected",
      noSlotsForDay: "No slots on this day.",
      selectAtLeastOne: "Please choose at least one time.",
      note: "Notes (optional)",
      submit: "Submit request",
      submitting: "Submitting…",
      errorValidation:
        "Please check your details — name, email or phone, and at least one time slot are required.",
      errorRateLimited: "Too many requests. Please wait a few minutes and try again.",
      errorInvalidSlot: "One or more time slots are no longer available. Please choose again.",
      back: "Back to Ellen Wang English Studio",
      successTitle: "Request received",
      successBody:
        "Thank you. Ellen will contact you within 1–2 business days to confirm your consultation time.",
      requestId: "Reference",
    };
  }

  return {
    title: "在线提交预约申请",
    intro:
      "请选择您方便的时间段并留下联系方式。这是预约申请，不是即时确认；Ellen 会人工联系您确认最终时间。",
    name: "姓名",
    email: "邮箱",
    phone: "电话",
    contactHint: "邮箱或电话至少填写一项。",
    purpose: "预约类型",
    trial: "试课",
    recruitment: "招聘",
    slots: "偏好时段（最多选 5 个）",
    timezoneLabel: "您的时区",
    timezoneHint:
      "日期按您所选时区的本地日历分组。Ellen 工作室位于广州（中国标准时间）。",
    selectedCount: "已选 {n}/{max}",
    noSlotsForDay: "该日暂无可用时段。",
    selectAtLeastOne: "请至少选择一个时段。",
    note: "备注（可选）",
    submit: "提交申请",
    submitting: "提交中…",
    errorValidation: "请检查填写内容：姓名、邮箱或电话、以及至少一个时段均为必填。",
    errorRateLimited: "提交过于频繁，请稍后再试。",
    errorInvalidSlot: "所选时段已失效，请重新选择。",
    back: "返回 Ellen Wang English Studio",
    successTitle: "申请已提交",
    successBody: "感谢提交。Ellen 将在 1–2 个工作日内通过您留下的联系方式确认最终时间。",
    requestId: "参考编号",
  };
}

function renderLayout(
  locale: "zh" | "en",
  title: string,
  body: string,
  withScript = false,
): string {
  const scriptTag = withScript
    ? `<script src="/book/book.js" defer></script>`
    : "";

  return `<!doctype html>
<html lang="${locale === "en" ? "en" : "zh-CN"}" class="no-js">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>${escapeHtml(title)} · Ellen Wang English Studio</title>
  <style>${CSS}</style>
</head>
<body>
  <div class="wrap">
    <header class="header">
      <a class="brand" href="${locale === "en" ? "/en/" : "/"}">Ellen Wang English Studio</a>
      <div class="lang-switch">
        <a href="?lang=zh" class="${locale === "zh" ? "active" : ""}">中文</a>
        <a href="?lang=en" class="${locale === "en" ? "active" : ""}">EN</a>
      </div>
    </header>
    ${body}
  </div>
  ${scriptTag}
</body>
</html>`;
}

function renderFallbackSlotOptions(
  slots: ReturnType<typeof generateAvailableSlots>,
  locale: "zh" | "en",
): string {
  return slots
    .map(
      (slot) =>
        `<label class="slot-option"><input type="checkbox" name="preferredSlots" value="${escapeHtml(slot.id)}" /> <span>${escapeHtml(locale === "en" ? slot.labelEn : slot.label)}</span></label>`,
    )
    .join("");
}

function errorMessage(
  locale: "zh" | "en",
  code: string | undefined,
  text: ReturnType<typeof copy>,
): string {
  if (code === "validation") return text.errorValidation;
  if (code === "rate_limited") return text.errorRateLimited;
  if (code === "invalid_slot") return text.errorInvalidSlot;
  return "";
}

export function createPageRoutes(config: AppConfig) {
  const pages = new Hono();

  pages.get("/", (c) => {
    const locale = resolveLocale(
      c.req.query("lang"),
      c.req.header("accept-language"),
    );
    const text = copy(locale);
    const slots = generateAvailableSlots(config.schedule);
    const fallbackOptions = renderFallbackSlotOptions(slots, locale);
    const formError = errorMessage(
      locale,
      c.req.query("error"),
      text,
    );

    const bookingConfig = JSON.stringify({
      locale,
      slots,
      studioTimezone: config.schedule.timezone,
      maxPreferences: config.schedule.maxPreferences,
      copy: {
        selectedCount: text.selectedCount,
        noSlotsForDay: text.noSlotsForDay,
        selectAtLeastOne: text.selectAtLeastOne,
        contactRequired:
          locale === "en"
            ? "Provide at least email or phone."
            : "邮箱或电话至少填写一项。",
      },
    }).replace(/</g, "\\u003c");

    const body = `
      <main class="card">
        <p class="eyebrow">${locale === "en" ? "Consultation request" : "预约咨询申请"}</p>
        <h1>${escapeHtml(text.title)}</h1>
        <p class="intro">${escapeHtml(text.intro)}</p>
        ${formError ? `<p class="form-error" role="alert">${escapeHtml(formError)}</p>` : ""}
        <form method="post" action="/book/api/requests" class="form" id="booking-form" novalidate>
          <script type="application/json" id="booking-config">${bookingConfig}</script>
          <input type="hidden" name="locale" value="${locale}" />
          <input type="hidden" name="clientTimezone" id="client-timezone-input" value="" />
          <input type="hidden" name="purpose" id="purpose-input" value="trial" />
          <p id="form-client-error" class="form-error" role="alert" hidden></p>
          <label class="hp" aria-hidden="true"><span>Website</span><input type="text" name="website" tabindex="-1" autocomplete="off" /></label>
          <label><span>${escapeHtml(text.name)}</span><input required name="name" maxlength="80" /></label>
          <label><span>${escapeHtml(text.email)}</span><input type="email" name="email" maxlength="120" /></label>
          <label><span>${escapeHtml(text.phone)}</span><input name="phone" maxlength="20" /></label>
          <p class="hint">${escapeHtml(text.contactHint)}</p>
          <div class="purpose-field">
            <span class="field-label">${escapeHtml(text.purpose)}</span>
            <div class="purpose-pills" role="group" aria-label="${escapeHtml(text.purpose)}">
              <button type="button" class="purpose-pill" data-value="trial" aria-pressed="true">${escapeHtml(text.trial)}</button>
              <button type="button" class="purpose-pill" data-value="recruitment" aria-pressed="false">${escapeHtml(text.recruitment)}</button>
            </div>
          </div>
          <div class="slot-section js-only" id="slot-picker">
            <div class="slot-section-header">
              <span class="field-label">${escapeHtml(text.slots)}</span>
              <span class="selected-count" id="selected-count">0/${config.schedule.maxPreferences}</span>
            </div>
            <div class="timezone-bar">
              <label for="timezone-select"><span>${escapeHtml(text.timezoneLabel)}</span></label>
              <select id="timezone-select" name="timezoneDisplay"></select>
              <p class="hint">${escapeHtml(text.timezoneHint)}</p>
            </div>
            <div class="day-tabs" id="day-tabs" role="tablist" aria-label="${escapeHtml(text.slots)}"></div>
            <div class="time-grid" id="time-grid"></div>
            <div class="selection-summary" id="selection-summary" hidden>
              <span class="field-label">${locale === "en" ? "Your selections" : "已选时段"}</span>
              <ul></ul>
            </div>
            <div class="hidden-inputs" id="slot-hidden-inputs" aria-hidden="true"></div>
          </div>
          <noscript>
            <fieldset class="noscript-fallback">
              <legend>${escapeHtml(text.slots)}</legend>
              <div class="slot-grid-fallback">${fallbackOptions}</div>
            </fieldset>
          </noscript>
          <label><span>${escapeHtml(text.note)}</span><textarea name="note" rows="3" maxlength="500"></textarea></label>
          <button type="submit" class="btn-primary" id="submit-btn">${escapeHtml(text.submit)}</button>
        </form>
      </main>`;

    return c.html(renderLayout(locale, text.title, body, true));
  });

  pages.get("/success", (c) => {
    const locale = resolveLocale(
      c.req.query("lang"),
      c.req.header("accept-language"),
    );
    const text = copy(locale);
    const id = escapeHtml(c.req.query("id") ?? "");

    const body = `
      <main class="card success">
        <h1>${escapeHtml(text.successTitle)}</h1>
        <p>${escapeHtml(text.successBody)}</p>
        ${id ? `<p class="ref">${escapeHtml(text.requestId)}: <strong>#${id}</strong></p>` : ""}
        <a class="btn-secondary" href="${locale === "en" ? "/en/#consultation" : "/#consultation"}">${escapeHtml(text.back)}</a>
      </main>`;

    return c.html(renderLayout(locale, text.successTitle, body));
  });

  return pages;
}
