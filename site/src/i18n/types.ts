/** Shared page content schema for zh / en locales. */

export type Locale = "zh" | "en";

export interface NavItem {
  label: string;
  mobileLabel?: string;
  href: string;
  variant: "primary" | "secondary" | "ghost";
  /** Hide link below this breakpoint (e.g. "md" hides on phone). */
  hideBelow?: "md";
}

export interface SeoContent {
  title: string;
  description: string;
  keywords: readonly string[];
  ogTitle: string;
  ogDescription: string;
  ogImageAlt: string;
  lang: string;
  ogLocale: string;
}

export interface HeroContent {
  eyebrow: string;
  headline: string;
  subheadline: string;
  subheadlineSecondary?: string;
  credibility: string;
  credentials: readonly string[];
  ctaPrimary: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
  locationShort: string;
  credentialsAriaLabel: string;
}

export interface HeaderContent {
  homeAriaLabel: string;
  navAriaLabel: string;
  nav: readonly NavItem[];
  langSwitch: {
    label: string;
    href: string;
    ariaLabel: string;
  };
}

export interface AudienceContent {
  title: string;
  segments: readonly {
    title: string;
    items: readonly string[];
  }[];
}

export interface ServiceItem {
  id: string;
  featured: boolean;
  badge?: string;
  title: string;
  subtitle?: string;
  format: string;
  bullets: readonly string[];
  suitable: string;
}

export interface ServicesContent {
  title: string;
  subtitle: string;
  suitableLabel: string;
  items: readonly ServiceItem[];
}

export interface WhyEllenContent {
  title: string;
  points: readonly { title: string; body: string }[];
}

export interface BackgroundContent {
  title: string;
  subtitle: string;
  timelineLabel: string;
  educationLabel: string;
  certificationsLabel: string;
  timeline: readonly {
    period: string;
    org: string;
    detail: string;
    muted?: boolean;
  }[];
  education: readonly string[];
  certifications: string;
}

export interface EmployersContent {
  title: string;
  paragraphs: readonly string[];
  specialismsLabel: string;
  specialisms: string;
  availableLabel: string;
  available: string;
  credentialsLabel: string;
  credentials: string;
  contactLabel: string;
  contactNote: string;
  ctaEmail: string;
  ctaWechat: string;
  emailButton: string;
}

export interface FAQContent {
  title: string;
  items: readonly {
    question: string;
    answer: string;
    openByDefault?: boolean;
  }[];
}

export interface ConsultationContent {
  title: string;
  titleSecondary?: string;
  subtitle: string;
  cards: readonly {
    id: string;
    title: string;
    titleSecondary?: string;
    description: string;
    actionLabel: string;
    href: string;
    internal: boolean;
  }[];
  footerHint: string;
  footerLinkLabel: string;
  footerHintSuffix: string;
}

export interface ContactContent {
  title: string;
  name: string;
  tagline: string;
  location: string;
  wechatLabel: string;
  wechatNote: string;
  emailLabel: string;
  instruction: string;
  qrPlaceholder: string;
  qrAriaLabel: string;
  emailTrialButton: string;
  otherContactButton: string;
}

export interface FooterContent {
  tagline: string;
  copyright: string;
}

export interface StickyBarContent {
  ariaLabel: string;
  label: string;
  mobileLabel?: string;
}

export interface ImagesCopy {
  hero: {
    portraitAlt: string;
    stockAlt: string;
    stockCaption: string;
  };
  services: Record<string, { alt: string }>;
  why: { alt: string };
}

export interface PageContent {
  seo: SeoContent;
  hero: HeroContent;
  header: HeaderContent;
  audience: AudienceContent;
  services: ServicesContent;
  whyEllen: WhyEllenContent;
  background: BackgroundContent;
  employers: EmployersContent;
  faq: FAQContent;
  consultation: ConsultationContent;
  contact: ContactContent;
  footer: FooterContent;
  stickyBar: StickyBarContent;
  images: ImagesCopy;
  mailto: {
    trial: string;
    employer: string;
    inquiry: string;
  };
}
