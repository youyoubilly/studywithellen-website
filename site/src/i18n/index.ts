import { buildSiteUrl } from "../config/site";
import { enContent } from "./en";
import type { Locale, PageContent } from "./types";
import { zhContent } from "./zh";

export type { Locale, PageContent } from "./types";

export const DEFAULT_LOCALE: Locale = "zh";
export const LOCALES: readonly Locale[] = ["zh", "en"] as const;

/** Section IDs used for anchor navigation and E2E tests */
export const SECTION_IDS = [
  "hero",
  "audience",
  "services",
  "why",
  "background",
  "employers",
  "faq",
  "consultation",
  "contact",
] as const;

export function getSectionId(id: (typeof SECTION_IDS)[number]): string {
  return id;
}

const CONTENT: Record<Locale, PageContent> = {
  zh: zhContent,
  en: enContent,
};

export function getPageContent(locale: Locale): PageContent {
  return CONTENT[locale];
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "zh" ? "en" : "zh";
}

export function getLocalePath(locale: Locale): string {
  return locale === "en" ? "/en/" : "/";
}

export function getCanonicalUrl(locale: Locale): string {
  return locale === "en" ? buildSiteUrl("/en/") : buildSiteUrl("/");
}

export function getHreflangAlternates(): { hreflang: string; href: string }[] {
  return [
    { hreflang: "zh-CN", href: buildSiteUrl("/") },
    { hreflang: "en", href: buildSiteUrl("/en/") },
    { hreflang: "x-default", href: buildSiteUrl("/") },
  ];
}

export function resolveLocaleFromUrl(pathname: string): Locale {
  return pathname.startsWith("/en") ? "en" : "zh";
}
