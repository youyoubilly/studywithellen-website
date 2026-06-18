/** Page copy — Chinese locale re-exports for backward compatibility. */

import { SECTION_IDS, getSectionId } from "../i18n";
import { zhContent } from "../i18n/zh";

export { SECTION_IDS, getSectionId };

export const AUDIENCE = zhContent.audience;

export const SERVICES = {
  title: zhContent.services.title,
  items: zhContent.services.items.map(({ subtitle, ...item }) => ({
    ...item,
    titleEn: subtitle ?? "",
  })),
} as const;

export const WHY_ELLEN = zhContent.whyEllen;

export const BACKGROUND = {
  title: zhContent.background.title,
  timeline: zhContent.background.timeline,
  education: zhContent.background.education,
  certifications: zhContent.background.certifications,
} as const;

export const EMPLOYERS = {
  title: zhContent.employers.title,
  paragraphs: zhContent.employers.paragraphs,
  specialisms: zhContent.employers.specialisms,
  available: zhContent.employers.available,
  credentials: zhContent.employers.credentials,
  ctaEmail: zhContent.employers.ctaEmail,
  ctaWechat: zhContent.employers.ctaWechat,
} as const;

export const FAQ = zhContent.faq;

export const CONSULTATION = {
  title: zhContent.consultation.title,
  titleEn: zhContent.consultation.titleSecondary ?? "",
  subtitle: zhContent.consultation.subtitle,
  cards: zhContent.consultation.cards.map(({ titleSecondary, ...card }) => ({
    ...card,
    titleEn: titleSecondary ?? "",
  })),
} as const;

export const CONTACT_SECTION = {
  title: zhContent.contact.title,
  name: zhContent.contact.name,
  tagline: zhContent.contact.tagline,
  location: zhContent.contact.location,
  wechatLabel: zhContent.contact.wechatLabel,
  wechatNote: zhContent.contact.wechatNote,
  emailLabel: zhContent.contact.emailLabel,
  instruction: zhContent.contact.instruction,
  qrPlaceholder: zhContent.contact.qrPlaceholder,
} as const;
