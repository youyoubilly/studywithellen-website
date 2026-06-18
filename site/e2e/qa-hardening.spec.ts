import { test, expect } from "@playwright/test";
import { SECTION_IDS } from "../src/lib/content";
import { buildSiteUrl } from "../src/config/site";

test.describe("QA hardening — structure & links", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("all section anchors exist on page", async ({ page }) => {
    for (const id of SECTION_IDS) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test("internal anchor links resolve to existing sections", async ({ page }) => {
    const hrefs = await page.locator('a[href^="#"]').evaluateAll((links) =>
      links
        .map((a) => a.getAttribute("href"))
        .filter((href): href is string => !!href && href !== "#"),
    );
    const unique = [...new Set(hrefs)];

    for (const href of unique) {
      await expect(page.locator(href)).toHaveCount(1);
    }
  });

  test("external http(s) links use noopener noreferrer", async ({ page }) => {
    const siteOrigin = new URL(buildSiteUrl()).origin;
    const externals = page.locator('a[href^="http"]');
    const count = await externals.count();

    for (let i = 0; i < count; i++) {
      const link = externals.nth(i);
      const href = await link.getAttribute("href");
      if (!href || href.startsWith(siteOrigin)) continue;

      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener/);
      await expect(link).toHaveAttribute("rel", /noreferrer/);
    }
  });

  test("document has zh-CN lang and canonical URL", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      buildSiteUrl("/"),
    );
  });

  test("page has exactly one h1", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });

  test("built page ships without client script tags", async ({ page }) => {
    await expect(
      page.locator('script:not([type="application/ld+json"])'),
    ).toHaveCount(0);
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
      1,
    );
  });
});

test.describe("QA hardening — content checklist", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("FAQ clarifies non-primary-school focus", async ({ page }) => {
    await expect(page.locator("#faq")).toContainText("非本工作室方向");
    await expect(page.locator("#faq")).toContainText("小学生");
  });

  test("why section mentions mature teaching style", async ({ page }) => {
    await expect(page.locator("#why")).toContainText("非低龄");
  });

  test("employers block is English with credentials", async ({ page }) => {
    const employers = page.locator("#employers");
    await expect(employers).toContainText("CELTA");
    await expect(employers).toContainText("For Employers");
    await expect(employers).toContainText("DELTA");
  });

  test("background timeline includes key institutions", async ({ page }) => {
    const background = page.locator("#background");
    await expect(background).toContainText("广州理工");
    await expect(background).toContainText("启德");
  });

  test("services highlights IELTS as featured offering", async ({ page }) => {
    const services = page.locator("#services");
    await expect(services).toContainText("雅思口语专项");
    await expect(services.getByText("热门")).toBeVisible();
  });
});
