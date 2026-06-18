# Assets — 素材清单

建站前请在本目录放入以下文件（命名建议如下）。

## 网站当前状态（Stage 11）

| 素材 | 状态 |
|------|------|
| Hero 肖像 | **已上线** — 自 CV 提取 → `ellen-portrait.jpg`；建议 Ellen 后续换专业半身照 ≥800px |
| OG 分享图 | **已生成** — 由肖像自动生成；可放 `og-share.jpg` 覆盖 |
| 微信二维码 | **待 Ellen 提供** — `wechat-qr-ellen_inGZ.png` |
| Google Calendar | 占位 URL in `site/src/config/site.ts` |
| Services ×3 / Why 背景 | 仍用 Stage 8 Stock（可保留） |

同步命令：`bash scripts/sync-ellen-assets.sh`（build/deploy 时自动运行）

## 必需

| 文件名建议 | 用途 | 规格 |
|------------|------|------|
| `ellen-portrait.jpg` | Hero 头像 | ≥800px，专业半身照，浅背景 |
| `wechat-qr-ellen_inGZ.png` | Contact 扫码 | ≥430×430，工作号二维码 |
| `og-share.jpg` | 微信/社交分享卡片（可选覆盖） | 1200×630 |

## 推荐

| 文件名建议 | 用途 |
|------------|------|
| `cert-celta.jpg` | 证书展示（可打码编号） |
| `cert-delta.jpg` | 同上 |
| `cert-certibet.jpg` | 同上 |
| `favicon.ico` | 站点图标 32×32 |

## 可选

| 文件名建议 | 用途 |
|------------|------|
| `logo-ew.svg` | 顶栏简单字母标 |
| `hero-bg.jpg` | 若需极淡背景纹理 |

## 已有参考

- CV 原件：`../reference/Ellen_Wang_CV.pdf`（Stage 11 已从中提取肖像）

## 拍摄备注（给 Billy）

- 头像与网站、微信、小红书统一同一套图
- 避免生活照、滤镜过重、杂乱背景
- 二维码定期核对是否为工作号 Ellen_inGZ
