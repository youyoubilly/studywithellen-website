# Ellen Wang English Studio — 专题项目

Billy 为妻子 Ellen 打造的个人品牌落地页 + 社媒入口。供 Cursor IDE 建站使用。

**GitHub:** [youyoubilly/studywithellen-website](https://github.com/youyoubilly/studywithellen-website)  
**Cursor agent:** SophiaW — see `.cursor/rules/` and `site/AGENTS.md`

**定位：** 雅思口语 · 留学学术英语 · 商务英语  
**受众：** 未来雇主；双语/国际学校高中生家长（留学方向）  
**转化口：** 微信 `Ellen_inGZ` · ellen.mj.a@gmail.com

---

## 文件夹结构

```
ellen-wang-english-studio/
├── README.md                 ← 本文件（项目总览）
├── website/                  ← 建站专用
│   ├── README.md             ← 建站快速指引
│   ├── site-plan.md          ← 整体方案：架构、技术、板块、部署
│   ├── design-brief.md       ← 视觉与 UX 建议
│   ├── copy/                 ← 原始文案（按板块拆分，可直接贴进 HTML/组件）
│   │   ├── 01-meta-seo.md
│   │   ├── 02-hero.md
│   │   ├── 03-audience.md
│   │   ├── 04-services.md
│   │   ├── 05-why-ellen.md
│   │   ├── 06-background.md
│   │   ├── 07-employers.md
│   │   ├── 08-faq.md
│   │   ├── 09-contact-cta.md
│   │   └── FULL-page-copy.md ← 合并版（单文件查阅）
│   └── assets/
│       └── README.md         ← 待准备图片/素材清单
├── social-media/             ← 微信、小红书、视频号（建站后可并行）
│   ├── README.md
│   ├── wechat-packaging.md
│   ├── xiaohongshu.md
│   └── video-scripts.md
└── reference/                ← 背景资料
    ├── positioning.md        ← 定位与策略摘要
    ├── cv-summary.md         ← 履历结构化摘要
    ├── target-audience.md    ← 目标用户画像
    └── Ellen_Wang_CV.pdf     ← 原始 CV
```

---

## Cursor IDE 建站建议

1. 先读 `website/site-plan.md` + `website/design-brief.md`
2. 按 `website/copy/` 各文件顺序组装单页
3. `website/assets/` 补齐头像、微信二维码、证书照（见清单）
4. 上线后对照 `social-media/` 做微信与小红书包装

**技术方向（见 site-plan）：** 静态单页优先 — HTML/CSS 或 Next.js/Astro 均可；手机端 + 微信内打开为第一优先级。

---

## 更新记录

| 日期 | 说明 |
|------|------|
| 2026-06-10 | NovaWang 建立专题夹，拆分文案与建站方案 |
