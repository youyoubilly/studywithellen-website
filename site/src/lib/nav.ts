import { NAV_LINKS } from "../config/site";
import { zhContent } from "../i18n/zh";

export interface NavItem {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "ghost";
}

export const HEADER_NAV: NavItem[] = [...zhContent.header.nav];

export const HERO_COPY = {
  headline: zhContent.hero.headline,
  subheadlineCn: zhContent.hero.subheadline,
  subheadlineEn: zhContent.hero.subheadlineSecondary ?? "",
  credibility: zhContent.hero.credibility,
  credentials: zhContent.hero.credentials,
  ctaPrimary: zhContent.hero.ctaPrimary,
  ctaSecondary: zhContent.hero.ctaSecondary,
} as const;

export function isInternalAnchor(href: string): boolean {
  return href.startsWith("#");
}

export function getNavHref(id: keyof typeof NAV_LINKS): string {
  return NAV_LINKS[id];
}
