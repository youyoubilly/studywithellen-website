import { NAV_LINKS } from "../config/site";
import type { PageContent } from "./types";

export const zhContent: PageContent = {
  seo: {
    title: "Ellen Wang | 雅思口语 · 留学学术英语 · 商务英语 | 广州天河",
    description:
      "英式学术英语教师，CELTA/DELTA/CertIBET。原广州理工、启德学术英语教师。专注高中生留学预备、雅思口语、职场商务英语。广州天河区。",
    keywords: [
      "广州雅思口语",
      "留学学术英语",
      "商务英语私教",
      "国际学校英语",
      "天河区英语教师",
      "IELTS speaking tutor Guangzhou",
    ],
    ogTitle: "Ellen Wang — IELTS Speaking & Academic English | Guangzhou",
    ogDescription:
      "CELTA/DELTA 认证学术英语教师 · 雅思口语 · 留学学术英语 · 商务英语 · 广州天河区",
    ogImageAlt:
      "Ellen Wang 学术英语工作室 — 雅思口语与留学学术英语 · 广州天河区",
    lang: "zh-CN",
    ogLocale: "zh_CN",
  },

  hero: {
    eyebrow: "Academic English · Guangzhou",
    headline: "雅思口语 · 留学学术英语 · 商务英语",
    subheadline:
      "帮助高中生与准留学生提升口语、写作与演讲能力 — 为出国留学和学术成功做准备",
    subheadlineSecondary:
      "IELTS Speaking · Study Abroad Academic English · Business English — Guangzhou",
    credibility:
      "广州理工学院英语讲师（2021–2025）· 启德教育学术英语教师 · CELTA · DELTA M1 · CertIBET · 巴斯大学 PGCiE 在读",
    credentials: ["CELTA", "DELTA M1", "CertIBET", "Bath PGCiE"],
    ctaPrimary: "预约试课 · 添加微信",
    ctaSecondary: "招聘合作 · For Employers",
    ctaSecondaryHref: NAV_LINKS.employers,
    locationShort: "English Studio · 广州天河区",
    credentialsAriaLabel: "专业资质",
  },

  header: {
    homeAriaLabel: "Ellen Wang English Studio — 返回顶部",
    navAriaLabel: "主要操作",
    nav: [
      {
        label: "预约咨询",
        mobileLabel: "预约",
        href: NAV_LINKS.consultation,
        variant: "primary",
      },
      {
        label: "微信咨询",
        href: NAV_LINKS.contact,
        variant: "secondary",
        hideBelow: "md",
      },
    ],
    langSwitch: {
      label: "EN",
      href: "/en/",
      ariaLabel: "Switch to English",
    },
  },

  audience: {
    title: "适合谁",
    segments: [
      {
        title: "高中生 & 家长",
        items: [
          "双语 / 国际学校学生，计划本科出国留学",
          "需要雅思口语突破、学术写作、课堂演讲能力",
          "希望找有经验的学术英语老师，而非少儿趣味英语",
        ],
      },
      {
        title: "大学生 & 准留学生",
        items: [
          "大学预科、本科低年级学术英语支持",
          "Presentation、essay、discussion skills",
        ],
      },
      {
        title: "职场人士",
        items: [
          "外企 / 创业 / 管理层商务英语口语",
          "Meeting、汇报、邮件、谈判场景英语",
        ],
      },
    ],
  },

  services: {
    title: "课程服务",
    subtitle: "专注雅思口语与留学学术英语，按目标定制 1 对 1 或小班课程",
    suitableLabel: "适合：",
    items: [
      {
        id: "ielts",
        featured: true,
        badge: "热门",
        title: "雅思口语专项",
        subtitle: "IELTS Speaking",
        format: "1 对 1 或 1 对 2 · 50–60 分钟",
        bullets: [
          "全真模考 + 逐题纠错",
          "话题拓展 + 流利度与逻辑训练",
          "发音与答题结构优化",
        ],
        suitable: "目标 6.5–7.5+ 的考生；口语单项薄弱者",
      },
      {
        id: "academic",
        featured: false,
        title: "留学学术英语",
        subtitle: "Study Abroad Academic English",
        format: "6–8 次课为一个主题模块",
        bullets: [
          "Essay 结构与学术写作",
          "Presentation 与答辩表达",
          "课堂讨论与学术口语",
        ],
        suitable: "高一至高三、大学预科、已录取需提前适应的学生",
      },
      {
        id: "business",
        featured: false,
        title: "商务英语",
        subtitle: "Business English",
        format: "定制 1 对 1 或 2–4 人小班",
        bullets: [
          "Meeting · Email · Presentation · Negotiation",
          "按行业与岗位定制场景",
        ],
        suitable: "CertIBET 商务英语教学认证 · Lancaster 商科背景",
      },
    ],
  },

  whyEllen: {
    title: "为什么选择 Ellen",
    points: [
      {
        title: "学术场景经验",
        body: "广州理工 18–27 岁大学生 Oral English、Business English、跨文化沟通 — 4 年全职教学",
      },
      {
        title: "留学预备经验",
        body: "启德教育 16–24 岁澳洲留学学术英语 — 写作、演讲、评估全流程",
      },
      {
        title: "口语专项优势",
        body: "IELTS Speaking 长期私教；理工 Oral English 大班 + 1 对 1 均有覆盖",
      },
      {
        title: "专业资质",
        body: "CELTA · DELTA Module 1 · CertIBET · PGCiE（University of Bath，在读）",
      },
      {
        title: "教学风格",
        body: "成熟、目标导向、针对学术与考试需求 — 非低龄游戏化课堂",
      },
      {
        title: "合法从业",
        body: "中国永久居留，可在华合法从事英语教学",
      },
    ],
  },

  background: {
    title: "教学背景",
    subtitle: "广州高校与留学预备机构教学经验，适合学校招聘方快速了解履历",
    timelineLabel: "工作经历",
    educationLabel: "学历",
    certificationsLabel: "证书",
    timeline: [
      {
        period: "2023–至今",
        org: "Freelance",
        detail: "雅思口语 · 商务英语 · 学术技能",
      },
      {
        period: "2025",
        org: "启德教育 EIC",
        detail: "16–24 岁留学学术英语（澳洲方向）",
      },
      {
        period: "2021–2025",
        org: "广州理工学院",
        detail: "大学 Oral / Business / 跨文化英语",
      },
      {
        period: "2013–2015",
        org: "Classic Mandarin",
        detail: "青少年与成人 1 对 1（早期经历）",
        muted: true,
      },
    ],
    education: [
      "PGCiE — University of Bath, UK（2025–2026，在读）",
      "BSc Business Studies — Lancaster University, UK",
      "BA International Business Administration — Estonian Business School",
    ],
    certifications:
      "CELTA · DELTA (Module 1) · CertIBET (Business English Teaching) · IELTS Speaking",
  },

  employers: {
    title: "For Employers · 招聘合作",
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
    contactNote: "（备注「招聘」）",
    ctaEmail: "ellen.mj.a@gmail.com",
    ctaWechat: "Ellen_inGZ",
    emailButton: "邮件联系",
  },

  faq: {
    title: "常见问题",
    items: [
      {
        question: "教小学生吗？",
        answer:
          "主攻高中生、大学生及职场成人。低龄趣味英语非本工作室方向。",
        openByDefault: true,
      },
      {
        question: "线上还是线下？",
        answer: "均可。广州天河可线下；异地学生可线上授课。",
        openByDefault: true,
      },
      {
        question: "试课怎么安排？",
        answer:
          "微信联系后安排 30–50 分钟测评，了解水平与目标后给出学习建议。",
        openByDefault: false,
      },
      {
        question: "和机构大班课有什么区别？",
        answer:
          "1 对 1 或小班，按学生目标定制；口语与学术表达为重点，非流水线大班。",
        openByDefault: false,
      },
      {
        question: "商务英语和雅思可以一起学吗？",
        answer:
          "建议分开规划。可先微信说明目标，再安排对应课程模块。",
        openByDefault: false,
      },
    ],
  },

  consultation: {
    title: "预约咨询",
    titleSecondary: "Book a Consultation",
    subtitle:
      "30–50 分钟试课测评，了解您的英语水平与学习目标，再定制课程方案",
    cards: [
      {
        id: "calendar",
        title: "在线预约",
        titleSecondary: "Book Online",
        description: "在线提交预约申请，选择希望咨询的时段，Ellen 会尽快确认",
        actionLabel: "提交预约申请",
        href: "calendar",
        internal: true,
      },
      {
        id: "wechat",
        title: "微信咨询",
        titleSecondary: "WeChat",
        description: "添加工作微信，备注「试课」或「招聘」",
        actionLabel: "查看微信二维码",
        href: "#contact",
        internal: true,
      },
      {
        id: "email",
        title: "邮件联系",
        titleSecondary: "Email",
        description: "适合招聘方或希望书面沟通的客户",
        actionLabel: "发送邮件",
        href: "mailto",
        internal: false,
      },
    ],
    footerHint: "不确定选哪种方式？推荐先",
    footerLinkLabel: "添加微信",
    footerHintSuffix: "，回复最快。",
  },

  contact: {
    title: "预约试课",
    name: "Ellen Wang",
    tagline: "Academic English · IELTS Speaking · Business English",
    location: "广州天河区",
    wechatLabel: "WeChat",
    wechatNote: "扫码添加",
    emailLabel: "Email",
    instruction: "添加微信时请备注：试课 或 招聘",
    qrPlaceholder: "微信二维码 · 待更新",
    qrAriaLabel: "WeChat 二维码占位",
    emailTrialButton: "邮件预约试课",
    otherContactButton: "查看其他联系方式",
  },

  footer: {
    tagline: "Guangzhou",
    copyright: "Ellen Wang English Studio · Guangzhou",
  },

  stickyBar: {
    ariaLabel: "快捷预约",
    label: "预约咨询 · 试课 / 招聘",
    mobileLabel: "预约咨询",
  },

  images: {
    hero: {
      portraitAlt: "Ellen Wang — 雅思与学术英语教师",
      stockAlt: "学术英语学习环境 — 书桌与笔记（过渡配图）",
      stockCaption: "过渡配图 · 真人照待更新",
    },
    services: {
      ielts: { alt: "一对一英语口语练习场景" },
      academic: { alt: "大学图书馆学术学习场景" },
      business: { alt: "商务会议英语沟通场景" },
    },
    why: { alt: "大学校园学习氛围（背景）" },
  },

  mailto: {
    trial: "试课 · Ellen Wang English Studio",
    employer: "试课咨询 · Ellen Wang English Studio",
    inquiry: "English Studio Inquiry",
  },
};
