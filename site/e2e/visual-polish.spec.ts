import { test, expect } from "@playwright/test";

test.describe("visual polish — mobile above the fold", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("hero headline visible on mobile load", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 1280) >= 768, "Mobile only");
    await expect(page.locator("#hero h1")).toBeInViewport();
  });

  test("hero primary CTA visible on mobile load", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 1280) >= 768, "Mobile only");
    const cta = page
      .locator("#hero")
      .getByRole("link", { name: "预约试课 · 添加微信" });
    await expect(cta).toBeInViewport();
  });

  test("mobile sticky consultation bar visible", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 1280) >= 768, "Mobile only");
    await expect(
      page.getByRole("navigation", { name: "快捷预约" }),
    ).toBeInViewport();
  });

  test("section headings have accent marker", async ({ page }) => {
    await expect(page.locator("#audience .bg-accent").first()).toBeVisible();
  });

  test("employers block has distinct background", async ({ page }) => {
    const employers = page.locator("#employers");
    await expect(employers).toBeVisible();
    const bg = await employers.evaluate((el) =>
      getComputedStyle(el).backgroundColor,
    );
    expect(bg).not.toBe("rgb(255, 255, 255)");
  });
});
