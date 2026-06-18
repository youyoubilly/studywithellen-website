# Website — 建站指引

## 目标

单页落地页（Landing Page），服务两类访客：

1. **家长 / 学生** — 预约雅思口语、留学学术英语、商务英语试课
2. **招聘方 / 机构** — 了解履历，联系合作

## 必读文件（按顺序）

1. `site-plan.md` — 板块结构、技术选型、部署、检查清单
2. `design-brief.md` — 配色、字体、气质、组件建议
3. `copy/` — 各板块原始文案，可直接映射到 HTML section

## 板块 → 文案文件映射

| 页面 Section ID | 文案文件 |
|-----------------|----------|
| `<head>` meta | `copy/01-meta-seo.md` |
| `#hero` | `copy/02-hero.md` |
| `#audience` | `copy/03-audience.md` |
| `#services` | `copy/04-services.md` |
| `#why` | `copy/05-why-ellen.md` |
| `#background` | `copy/06-background.md` |
| `#employers` | `copy/07-employers.md` |
| `#faq` | `copy/08-faq.md` |
| `#contact` | `copy/09-contact-cta.md` |

## 待准备素材

见 `assets/README.md`

## 上线最低标准

- [ ] 手机端布局正常
- [ ] 微信内打开 3 秒内看到主标题 + 加微信 CTA
- [ ] 微信二维码可长按识别
- [ ] 页面加载 < 2s（无大图、无重动画）
- [ ] meta title / description 已填
