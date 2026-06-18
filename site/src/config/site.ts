/** Site-wide configuration — single source of truth for URLs, contact, SEO. */

export const SITE_HOST = "hk1.youyoubilly.com";
export const SITE_PORT = 8080;
export const SITE_URL = `http://${SITE_HOST}:${SITE_PORT}`;

export const SITE_NAME = "Ellen Wang English Studio";

export const CONTACT = {
  wechatId: "Ellen_inGZ",
  email: "ellen.mj.a@gmail.com",
  location: "广州天河区",
} as const;

export const SEO = {
  title: "Ellen Wang | 雅思口语 · 留学学术英语 · 商务英语 | 广州天河",
  description:
    "英式学术英语教师，CELTA/DELTA/CertIBET。原广州理工、启德学术英语教师。专注高中生留学预备、雅思口语、职场商务英语。广州天河区。",
  keywords: [
    "广州雅思口语",
    "留学学术英语",
    "商务英语私教",
    "国际学校英语",
    "天河英语教师",
    "IELTS speaking tutor Guangzhou",
  ],
  ogTitle: "Ellen Wang — IELTS Speaking & Academic English | Guangzhou",
  ogDescription:
    "CELTA/DELTA 认证学术英语教师 · 雅思口语 · 留学学术英语 · 商务英语 · 广州天河区",
  locale: "zh_CN",
  lang: "zh-CN",
} as const;

export const NAV_LINKS = {
  consultation: "#consultation",
  contact: "#contact",
  employers: "#employers",
} as const;

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function buildSiteUrl(path = ""): string {
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${SITE_URL}${normalized}`;
}

/** Self-hosted booking request form (see hk1/ellen-booking). */
export const BOOKING_URL = buildSiteUrl("/book/");
/** @deprecated Use BOOKING_URL */
export const CALENDAR_BOOKING_URL = BOOKING_URL;

export function buildMailtoUrl(
  email: string,
  subject = "English Studio Inquiry",
): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

export const EXTERNAL_LINK = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
