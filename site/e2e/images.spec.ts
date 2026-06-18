import { test, expect } from "@playwright/test";

test.describe("Stage 11 — Ellen assets", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("hero displays Ellen portrait on mobile header", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 1280) >= 768, "Mobile only");
    const heroImg = page.locator("#hero img").first();
    await expect(heroImg).toBeVisible();
    await expect(heroImg).toHaveAttribute("src", /ellen-portrait\.webp/);
    await expect(heroImg).toHaveAttribute("alt", /Ellen Wang/);
  });

  test("hero displays Ellen portrait on desktop", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 1280) < 768, "Desktop only");
    const heroImg = page.locator("#hero figure img");
    await expect(heroImg).toBeVisible();
    await expect(heroImg).toHaveAttribute("src", /ellen-portrait\.webp/);
  });

  test("hero no longer shows stock placeholder caption", async ({ page }) => {
    await expect(page.locator("#hero")).not.toContainText("过渡配图");
  });

  test("each service card has a header image", async ({ page }) => {
    const cards = page.locator("#services article");
    await expect(cards).toHaveCount(3);

    for (let i = 0; i < 3; i++) {
      const img = cards.nth(i).locator("img").first();
      await expect(img).toBeVisible();
      await expect(img).toHaveAttribute("src", /\/images\/services\//);
    }
  });

  test("page includes og:image meta with Ellen share card", async ({ page }) => {
    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute("content", /\/images\/og\/og-share\.jpg/);
  });
});
