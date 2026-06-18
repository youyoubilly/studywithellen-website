# 落地页整体方案

## 1. 页面类型

**单页滚动落地页（One-page Landing）** — 不做多页站。所有信息一屏屏滚到底，底部强 CTA。

## 2. 访客与转化路径

```
家长/学生 ──→ 看服务 & 履历 ──→ 扫码/点按钮 ──→ 微信 Ellen_inGZ（备注「试课」）
招聘方     ──→ 看 Employers 段 ──→ 邮件 / 微信（备注「招聘」）
```

## 3. 板块结构（从上到下）

| # | Section | 目的 |
|---|---------|------|
| 0 | 固定顶栏 | Logo/名字 + 「加微信」按钮始终可见 |
| 1 | Hero | 一句话定位 + 信任背书 + 双 CTA |
| 2 | Audience | 三类服务对象（家长一眼对号入座） |
| 3 | Services | 三门课：雅思口语 / 留学学术英语 / 商务英语 |
| 4 | Why Ellen | 差异化卖点（非少儿、口语强、理工+启德） |
| 5 | Background | 时间线履历 |
| 6 | Employers | 英文招聘向短段（可折叠或独立浅色底区块） |
| 7 | FAQ | 过滤少儿需求、说明线上线下 |
| 8 | Contact | 大二维码 + 邮箱 + 地址（天河/汇景） |
| 9 | Footer | 版权 |

**Testimonials** — 第一版可省略或留占位「学员反馈即将更新」；有案例后再加。

## 4. 技术选型建议

| 方案 | 适合 | 说明 |
|------|------|------|
| **A. 纯静态 HTML/CSS** | 最快、完全可控 | 单 `index.html` + `styles.css`，扔 Vercel/Cloudflare Pages |
| **B. Astro / Next.js 静态导出** | 你想用 Cursor 组件化 | `output: 'export'` 或 Astro static；仍是一页 |
| **C. Carrd / Framer** | 零代码极速 | 文案从 `copy/` 粘贴；后期可迁到自建 |

**推荐：** 方案 A 或 B。你是开发者，用 Cursor 搭静态站性价比最高。

## 5. 必备技术要点

- **Mobile-first** — 375px 宽度先调好
- **微信内置浏览器** — 测 iOS/Android 微信打开
- **无外链重依赖** — 字体用系统栈或单一 web font
- **图片** — WebP，头像 < 200KB，二维码 PNG 清晰即可
- **HTTPS** — 微信分享链接需要
- **favicon** — 简单 EW 字母或头像裁切

## 6. 域名 & 部署

**域名候选（需自行查询注册）：**
- ellenwang-english.com
- ellenwangGZ.com
- ellen-english.cn

**部署：**
- Vercel / Cloudflare Pages / 腾讯云静态托管
- 第一期可用 `*.vercel.app` 子域先上线，后绑自定义域

**环境变量：** 无（纯静态，无后端）

## 7. SEO & 分享

- Title / Description / Keywords → `copy/01-meta-seo.md`
- Open Graph：`og:title`, `og:description`, `og:image`（用 Ellen 专业照）
- 微信分享卡片：依赖 og:image，准备 1200×630 分享图

## 8. 双 CTA 实现

**Hero 两个按钮：**
1. 主按钮（实心）：「预约试课 · 添加微信」→ 滚动到 `#contact` 或 `weixin://` 不适用，统一滚到底扫码
2. 次按钮（描边）：「招聘合作」→ 滚动到 `#employers`

**顶栏固定按钮：** 「微信咨询」→ `#contact`

## 9. 建站检查清单

### 内容
- [ ] 所有 `copy/` 板块已上页
- [ ] 明确写「主攻高中及以上，非少儿英语」
- [ ] 微信二维码为工作号 Ellen_inGZ
- [ ] 邮箱 ellen.mj.a@gmail.com

### 体验
- [ ] 顶栏固定 CTA
- [ ] 手机单栏阅读舒适
- [ ] 对比度够（见 design-brief）
- [ ] 点击区域够大（44px+）

### 发布
- [ ] 自定义域或临时域可访问
- [ ] 微信内打开正常
- [ ] og 分享图正确

## 10. 与社媒联动

- 网站 URL 写入：微信签名、小红书简介、视频号主页
- 新好友备注引导：「网站 / 小红书 / 朋友推荐」
- 各渠道统一同一链接，便于统计（后期可加 UTM）

## 11. 第一版不做

- 在线预约系统 / 支付
- 博客 / 资讯站
- 中英双语整站切换（仅 Employers 段英文即可）
- 学员登录 / LMS
