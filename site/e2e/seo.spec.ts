import { test, expect } from "@playwright/test";

test.describe("SEO & social sharing", () => {
  test("Chinese page has complete meta and JSON-LD", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /天河区/,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /index, follow/,
    );
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      "content",
      "Ellen Wang English Studio",
    );
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      "content",
      /Ellen Wang/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      "content",
      /og-share\.jpg$/,
    );

    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);
    const schema = JSON.parse((await jsonLd.textContent()) ?? "{}");
    expect(schema["@graph"].some((n: { "@type": string }) => n["@type"] === "ProfessionalService")).toBe(
      true,
    );
  });

  test("English page has locale-specific OG and canonical", async ({ page }) => {
    await page.goto("/en/");

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/en\/$/,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      "content",
      "en_GB",
    );
    await expect(
      page.locator('meta[property="og:locale:alternate"]'),
    ).toHaveAttribute("content", "zh_CN");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      /\/en\/$/,
    );
  });

  test("robots.txt allows crawling and references sitemap", async ({
    request,
  }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("Allow: /");
    expect(body).toContain("Sitemap:");
  });

  test("sitemap.xml lists both locales with hreflang", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("<loc>");
    expect(body).toContain("/en/");
    expect(body).toContain('hreflang="zh-CN"');
    expect(body).toContain('hreflang="en"');
  });
});
