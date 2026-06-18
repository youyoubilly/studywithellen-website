import { test, expect } from "@playwright/test";

test.describe("layout shell", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("header is visible and sticky at top", async ({ page }) => {
    const header = page.locator("header");
    await expect(header).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(header).toBeVisible();
  });

  test("header has consultation and wechat nav links", async ({
    page,
    viewport,
  }) => {
    const nav = page.getByRole("navigation", { name: "主要操作" });
    const consultLink = nav.getByRole("link", { name: /预约/ });
    await expect(consultLink).toHaveAttribute("href", "#consultation");

    const isMobile = (viewport?.width ?? 1280) < 768;
    const wechatLink = page.locator('header nav a[href="#contact"]');
    await expect(wechatLink).toHaveCount(1);

    if (!isMobile) {
      await expect(
        nav.getByRole("link", { name: "微信咨询" }),
      ).toHaveAttribute("href", "#contact");
    }
  });

  test("hero section is present with IELTS headline", async ({ page }) => {
    const hero = page.locator("#hero");
    await expect(hero).toBeVisible();
    await expect(hero.getByRole("heading", { level: 1 })).toContainText(
      "雅思口语",
    );
  });

  test("hero primary CTA links to consultation", async ({ page }) => {
    await expect(
      page.locator("#hero").getByRole("link", { name: "预约试课 · 添加微信" }),
    ).toHaveAttribute("href", "#consultation");
  });

  test("hero secondary CTA links to employers", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /招聘合作/ }),
    ).toHaveAttribute("href", "#employers");
  });

  test("footer is visible at page bottom", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("Ellen Wang English Studio");
    await expect(footer).toContainText("Guangzhou");
  });

  test("page uses flex layout with footer after main", async ({ page }) => {
    const mainBottom = await page.locator("main").evaluate((el) => {
      return el.getBoundingClientRect().bottom;
    });
    const footerTop = await page.locator("footer").evaluate((el) => {
      return el.getBoundingClientRect().top;
    });
    expect(footerTop).toBeGreaterThanOrEqual(mainBottom - 2);
  });

  test("no horizontal overflow on viewport", async ({ page }) => {
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(overflow).toBe(false);
  });
});
