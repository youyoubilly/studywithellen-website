import { IMAGES } from "../config/images";
import { CONTACT, SITE_NAME, SITE_URL, buildSiteUrl } from "../config/site";
import type { Locale } from "../i18n";
import { getCanonicalUrl, getHreflangAlternates, getPageContent } from "../i18n";

const THEME_COLOR = "#0072ce";

export function getOgImageUrl(): string {
  return buildSiteUrl(IMAGES.og);
}

export function getThemeColor(): string {
  return THEME_COLOR;
}

export function getOgLocaleAlternate(locale: Locale): string {
  return locale === "zh" ? "en_GB" : "zh_CN";
}

export function buildStructuredData(locale: Locale): Record<string, unknown> {
  const { seo } = getPageContent(locale);
  const pageUrl = getCanonicalUrl(locale);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${buildSiteUrl("/")}#website`,
        url: buildSiteUrl("/"),
        name: SITE_NAME,
        inLanguage: [seo.lang, locale === "zh" ? "en" : "zh-CN"],
        publisher: { "@id": `${pageUrl}#business` },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: seo.title,
        description: seo.description,
        isPartOf: { "@id": `${buildSiteUrl("/")}#website` },
        inLanguage: seo.lang,
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: getOgImageUrl(),
          width: 1200,
          height: 630,
        },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${pageUrl}#business`,
        name: SITE_NAME,
        url: pageUrl,
        image: getOgImageUrl(),
        description: seo.description,
        email: CONTACT.email,
        areaServed: {
          "@type": "City",
          name: "Guangzhou",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: locale === "zh" ? "天河区" : "Tianhe District",
          addressRegion: locale === "zh" ? "广东省" : "Guangdong",
          addressCountry: "CN",
        },
        founder: {
          "@type": "Person",
          name: "Ellen Wang",
          email: CONTACT.email,
          jobTitle: "EAL Teacher",
        },
        knowsAbout: [
          "IELTS Speaking",
          "Academic English",
          "Business English",
          "Study Abroad English",
        ],
      },
    ],
  };
}

export function buildSitemapXml(): string {
  const alternates = getHreflangAlternates();
  const lastmod = new Date().toISOString().slice(0, 10);

  const urls = [
    { loc: buildSiteUrl("/"), priority: "1.0" },
    { loc: buildSiteUrl("/en/"), priority: "0.9" },
  ];

  const urlEntries = urls
    .map(({ loc, priority }) => {
      const altLinks = alternates
        .map(
          (alt) =>
            `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`,
        )
        .join("\n");

      return `  <url>
    <loc>${loc}</loc>
${altLinks}
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>
`;
}

export function buildRobotsTxt(): string {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}
