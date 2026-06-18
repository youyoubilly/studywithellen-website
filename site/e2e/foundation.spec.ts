import { test, expect } from "@playwright/test";

test.describe("foundation page", () => {
  test("loads with Ellen Wang title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Ellen Wang/);
  });

  test("shows studio name in main heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#hero")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "雅思口语",
    );
  });

  test("has canonical meta description", async ({ page }) => {
    await page.goto("/");
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /CELTA/);
  });
});
