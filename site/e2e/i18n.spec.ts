import { test, expect } from "@playwright/test";
import { SECTION_IDS } from "../src/lib/content";

test.describe("i18n — English locale", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/", { waitUntil: "domcontentloaded" });
  });

  test("loads with English title", async ({ page }) => {
    await expect(page).toHaveTitle(/IELTS Speaking/);
  });

  test("html lang is en", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("hero h1 is in English", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "IELTS Speaking",
    );
  });

  test("hero secondary CTA links to teaching background", async ({ page }) => {
    const cta = page.locator("#hero").getByRole("link", {
      name: "View credentials",
    });
    await expect(cta).toHaveAttribute("href", "#background");
  });

  test("language switch links to Chinese home", async ({ page }) => {
    const switchLink = page.getByRole("link", { name: "Switch to Chinese" });
    await expect(switchLink).toHaveAttribute("href", "/");
    await switchLink.click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "雅思口语",
    );
  });

  test("includes hreflang alternates", async ({ page }) => {
    await expect(
      page.locator('link[rel="alternate"][hreflang="zh-CN"]'),
    ).toHaveAttribute("href", /\/$/);
    await expect(
      page.locator('link[rel="alternate"][hreflang="en"]'),
    ).toHaveAttribute("href", /\/en\/?$/);
    await expect(
      page.locator('link[rel="alternate"][hreflang="x-default"]'),
    ).toHaveCount(1);
  });

  test("canonical points to /en/", async ({ page }) => {
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/en\/$/,
    );
  });

  test("FAQ uses English copy", async ({ page }) => {
    await expect(page.locator("#faq")).toContainText(
      "Do you teach primary school children?",
    );
    await expect(page.locator("#faq")).not.toContainText("非本工作室方向");
  });

  test("employers section is fully English UI", async ({ page }) => {
    const employers = page.locator("#employers");
    await expect(employers).toContainText("For Employers");
    await expect(employers).toContainText("Email Ellen");
  });

  test("page avoids Chinese UI strings except location note", async ({
    page,
  }) => {
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toContain("预约试课");
    expect(bodyText).not.toContain("常见问题");
    expect(bodyText).not.toContain("非本工作室");
    expect(bodyText).toContain("Tianhe District, Guangzhou");
  });

  test("hero image uses English alt text", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 1280) >= 768, "Mobile hero image only");
    const heroImg = page.locator("#hero img").first();
    await expect(heroImg).toHaveAttribute("alt", /Ellen Wang/i);
  });

  for (const sectionId of SECTION_IDS) {
    test(`#${sectionId} section exists on English page`, async ({ page }) => {
      await expect(page.locator(`#${sectionId}`)).toHaveCount(1);
    });
  }
});

test.describe("i18n — Chinese locale switch", () => {
  test("Chinese page links to English", async ({ page }) => {
    await page.goto("/");
    const switchLink = page.getByRole("link", { name: "Switch to English" });
    await expect(switchLink).toHaveAttribute("href", "/en/");
    await switchLink.click();
    await expect(page).toHaveURL(/\/en\/?$/);
  });

  test("Chinese page has zh-CN lang and hreflang", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
    await expect(
      page.locator('link[rel="alternate"][hreflang="en"]'),
    ).toHaveAttribute("href", /\/en/);
  });
});
