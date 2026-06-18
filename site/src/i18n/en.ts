import { NAV_LINKS } from "../config/site";
import type { PageContent } from "./types";

/** Stage 10 — recruiter-facing English copy (reviewed against website/copy/). */
export const enContent: PageContent = {
  seo: {
    title:
      "Ellen Wang | IELTS Speaking · Academic English · Business English | Guangzhou",
    description:
      "British EAL teacher, CELTA/DELTA/CertIBET. Former GIST & EIC educator. IELTS speaking, academic English & business English in Tianhe District, Guangzhou.",
    keywords: [
      "IELTS speaking tutor Guangzhou",
      "study abroad academic English",
      "business English coach",
      "international school English teacher",
      "EAL teacher Guangzhou",
      "Tianhe District English tutor",
    ],
    ogTitle: "Ellen Wang — IELTS Speaking & Academic English | Guangzhou",
    ogDescription:
      "CELTA/DELTA-qualified EAL teacher · IELTS speaking · academic & business English · Tianhe District, Guangzhou",
    ogImageAlt:
      "Ellen Wang English Studio — IELTS Speaking & Academic English in Guangzhou",
    lang: "en",
    ogLocale: "en_GB",
  },

  hero: {
    eyebrow: "Academic English · Guangzhou",
    headline: "IELTS Speaking · Academic English · Business English",
    subheadline:
      "British EAL teacher in Guangzhou — IELTS speaking, pre-university academic English, and business English in tailored 1-to-1 and small-group sessions.",
    credibility:
      "Former English lecturer, Guangzhou Institute of Science and Technology (2021–2025) · EIC Education academic English · CELTA · DELTA M1 · CertIBET · Bath PGCiE (in progress)",
    credentials: ["CELTA", "DELTA M1", "CertIBET", "Bath PGCiE"],
    ctaPrimary: "Book a trial · WeChat",
    ctaSecondary: "View credentials",
    ctaSecondaryHref: "#background",
    locationShort: "English Studio · Tianhe District, Guangzhou",
    credentialsAriaLabel: "Professional credentials",
  },

  header: {
    homeAriaLabel: "Ellen Wang English Studio — back to top",
    navAriaLabel: "Primary actions",
    nav: [
      {
        label: "Book consultation",
        mobileLabel: "Book",
        href: NAV_LINKS.consultation,
        variant: "primary",
      },
      {
        label: "WeChat",
        href: NAV_LINKS.contact,
        variant: "secondary",
        hideBelow: "md",
      },
    ],
    langSwitch: {
      label: "中文",
      href: "/",
      ariaLabel: "Switch to Chinese",
    },
  },

  audience: {
    title: "Who This Is For",
    segments: [
      {
        title: "Senior high school students & parents",
        items: [
          "Bilingual and international school students planning undergraduate study abroad",
          "Need IELTS speaking support, academic writing, and classroom presentation skills",
          "Seeking an experienced academic English teacher — not young-learner play-based classes",
        ],
      },
      {
        title: "University students & pre-university learners",
        items: [
          "Foundation-year and early undergraduate academic English support",
          "Presentations, essays, and seminar discussion skills",
        ],
      },
      {
        title: "Working professionals",
        items: [
          "Business English for multinationals, startups, and management roles",
          "Meetings, reports, emails, and negotiation scenarios",
        ],
      },
    ],
  },

  services: {
    title: "Programmes",
    subtitle:
      "IELTS speaking and study-abroad academic English — tailored 1-to-1 or small-group sessions",
    suitableLabel: "Best for:",
    items: [
      {
        id: "ielts",
        featured: true,
        badge: "Popular",
        title: "IELTS Speaking",
        format: "1-to-1 or 1-to-2 · 50–60 minutes",
        bullets: [
          "Full mock tests with question-by-question feedback",
          "Topic development, fluency, and logical structuring",
          "Pronunciation and answer-format refinement",
        ],
        suitable: "Target band 6.5–7.5+; candidates with a weak speaking score",
      },
      {
        id: "academic",
        featured: false,
        title: "Study Abroad Academic English",
        format: "6–8 sessions per themed module",
        bullets: [
          "Essay structure and academic writing",
          "Presentations and viva-style speaking",
          "Seminar discussion and academic oral skills",
        ],
        suitable:
          "Years 10–12, foundation students, and admitted students preparing before departure",
      },
      {
        id: "business",
        featured: false,
        title: "Business English",
        format: "Tailored 1-to-1 or small groups of 2–4",
        bullets: [
          "Meetings · emails · presentations · negotiation",
          "Industry- and role-specific scenarios",
        ],
        suitable: "CertIBET-certified business English · Lancaster business background",
      },
    ],
  },

  whyEllen: {
    title: "Why Ellen",
    points: [
      {
        title: "University teaching experience",
        body: "Four years full-time Oral English, Business English, and intercultural communication with 18–27-year-olds at Guangzhou Institute of Science and Technology",
      },
      {
        title: "Pre-university experience",
        body: "EIC Education — academic English for 16–24-year-olds (Australia pathway): writing, presentations, and full assessment cycle",
      },
      {
        title: "Speaking specialism",
        body: "Long-term IELTS Speaking private tuition; large-group and 1-to-1 Oral English at GIST",
      },
      {
        title: "Professional qualifications",
        body: "CELTA · DELTA Module 1 · CertIBET · PGCiE (University of Bath, in progress)",
      },
      {
        title: "Teaching approach",
        body: "Mature, goal-oriented, and exam/academic focused — not young-learner gamified classes",
      },
      {
        title: "Legal status",
        body: "Chinese Permanent Residence — eligible to teach English professionally in China",
      },
    ],
  },

  background: {
    title: "Teaching Background",
    subtitle:
      "University and pre-university experience in Guangzhou — structured for recruiters reviewing credentials quickly",
    timelineLabel: "Work experience",
    educationLabel: "Education",
    certificationsLabel: "Certifications",
    timeline: [
      {
        period: "2023–present",
        org: "Freelance",
        detail: "IELTS Speaking · Business English · Academic skills",
      },
      {
        period: "2025",
        org: "EIC Education",
        detail: "Academic English for 16–24-year-olds (Australia pathway)",
      },
      {
        period: "2021–2025",
        org: "Guangzhou Institute of Science and Technology",
        detail: "University Oral / Business / Intercultural English",
      },
      {
        period: "2013–2015",
        org: "Classic Mandarin",
        detail: "1-to-1 youth and adult teaching (early career)",
        muted: true,
      },
    ],
    education: [
      "PGCiE — University of Bath, UK (2025–2026, in progress)",
      "BSc Business Studies — Lancaster University, UK",
      "BA International Business Administration — Estonian Business School",
    ],
    certifications:
      "CELTA · DELTA (Module 1) · CertIBET (Business English Teaching) · IELTS Speaking",
  },

  employers: {
    title: "For Employers",
    paragraphs: [
      "Ellen Wang is a CELTA- and DELTA-qualified EAL teacher with 6+ years of experience in university and pre-university settings. She has taught oral English, business English, intercultural communication, and academic English (essay writing, presentations) at Guangzhou Institute of Science and Technology and EIC Education.",
    ],
    specialismsLabel: "Specialisms:",
    specialisms:
      "IELTS Speaking · Study abroad academic English · Business English · Curriculum design · Speaking-intensive programmes",
    availableLabel: "Available for:",
    available:
      "Full-time or part-time teaching roles, contract-based business English programmes, and speaking/coaching projects.",
    credentialsLabel: "Credentials:",
    credentials:
      "CELTA · DELTA Module 1 · CertIBET · PGCiE (University of Bath, in progress) · Chinese Permanent Residence",
    contactLabel: "Contact:",
    contactNote: '(note "Recruitment" when adding on WeChat)',
    ctaEmail: "ellen.mj.a@gmail.com",
    ctaWechat: "Ellen_inGZ",
    emailButton: "Email Ellen",
  },

  faq: {
    title: "FAQ",
    items: [
      {
        question: "Do you teach primary school children?",
        answer:
          "The studio focuses on senior high school students, university learners, and working adults. Young-learner, play-based classes are not offered.",
        openByDefault: true,
      },
      {
        question: "Online or in person?",
        answer:
          "Both. In-person sessions in Tianhe, Guangzhou; online for students elsewhere in China or overseas.",
        openByDefault: true,
      },
      {
        question: "How does a trial lesson work?",
        answer:
          "Contact via WeChat to arrange a 30–50 minute assessment. Ellen reviews your level and goals before recommending a programme.",
        openByDefault: false,
      },
      {
        question: "How is this different from large institution classes?",
        answer:
          "1-to-1 or small groups tailored to your goals — speaking and academic expression first, not factory-style large classes.",
        openByDefault: false,
      },
      {
        question: "Can I combine business English and IELTS?",
        answer:
          "Best planned as separate modules. Message on WeChat with your goals and Ellen will suggest the right programme.",
        openByDefault: false,
      },
    ],
  },

  consultation: {
    title: "Book a Consultation",
    subtitle:
      "A 30–50 minute trial assessment to understand your English level and goals — then a tailored programme proposal",
    cards: [
      {
        id: "calendar",
        title: "Book Online",
        description:
          "Submit a booking request with your preferred time — Ellen will confirm shortly",
        actionLabel: "Submit booking request",
        href: "calendar",
        internal: true,
      },
      {
        id: "wechat",
        title: "WeChat",
        description: 'Add on WeChat and note "Trial" or "Recruitment"',
        actionLabel: "View WeChat QR",
        href: "#contact",
        internal: true,
      },
      {
        id: "email",
        title: "Email",
        description: "For employers or clients who prefer written contact",
        actionLabel: "Send email",
        href: "mailto",
        internal: false,
      },
    ],
    footerHint: "Not sure which option? We recommend",
    footerLinkLabel: "WeChat first",
    footerHintSuffix: " — fastest reply.",
  },

  contact: {
    title: "Book a Trial",
    name: "Ellen Wang",
    tagline: "Academic English · IELTS Speaking · Business English",
    location: "Tianhe District, Guangzhou",
    wechatLabel: "WeChat",
    wechatNote: "Scan to add",
    emailLabel: "Email",
    instruction: 'When adding on WeChat, note: "Trial" or "Recruitment"',
    qrPlaceholder: "WeChat QR · coming soon",
    qrAriaLabel: "WeChat QR code placeholder",
    emailTrialButton: "Email to book a trial",
    otherContactButton: "Other contact options",
  },

  footer: {
    tagline: "Guangzhou",
    copyright: "Ellen Wang English Studio · Guangzhou",
  },

  stickyBar: {
    ariaLabel: "Quick booking",
    label: "Book consultation · Trial / Recruitment",
    mobileLabel: "Book consultation",
  },

  images: {
    hero: {
      portraitAlt: "Ellen Wang — IELTS and academic English teacher",
      stockAlt: "Academic English study setting — desk and notes (placeholder image)",
      stockCaption: "Placeholder image · portrait to be updated",
    },
    services: {
      ielts: { alt: "One-to-one English speaking practice" },
      academic: { alt: "University library academic study scene" },
      business: { alt: "Professional business meeting in English" },
    },
    why: { alt: "Campus study atmosphere (background)" },
  },

  mailto: {
    trial: "Trial lesson · Ellen Wang English Studio",
    employer: "Recruitment inquiry · Ellen Wang English Studio",
    inquiry: "English Studio Inquiry",
  },
};
