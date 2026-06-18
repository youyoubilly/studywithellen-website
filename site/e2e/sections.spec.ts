import { test, expect } from "@playwright/test";
import { SECTION_IDS } from "../src/lib/content";

test.describe("content sections", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  for (const sectionId of SECTION_IDS) {
    test(`#${sectionId} section exists`, async ({ page }) => {
      await expect(page.locator(`#${sectionId}`)).toHaveCount(1);
    });
  }

  test("services section highlights IELTS card", async ({ page }) => {
    const ieltsCard = page.locator("#services").getByText("雅思口语专项");
    await expect(ieltsCard).toBeVisible();
    await expect(page.locator("#services").getByText("热门")).toBeVisible();
  });

  test("employers section contains English recruiter copy", async ({ page }) => {
    const employers = page.locator("#employers");
    await expect(employers).toContainText("CELTA- and DELTA-qualified");
    await expect(employers).toContainText("Specialisms");
  });

  test("background timeline shows 启德 and 广州理工", async ({ page }) => {
    const background = page.locator("#background");
    await expect(background).toContainText("启德教育");
    await expect(background).toContainText("广州理工学院");
  });

  test("FAQ accordion expands on click", async ({ page }) => {
    const closedItem = page
      .locator("#faq details")
      .filter({ hasText: "试课怎么安排" });
    await expect(closedItem).not.toHaveAttribute("open");
    await closedItem.locator("summary").click();
    await expect(closedItem).toHaveAttribute("open");
    await expect(closedItem).toContainText("30–50 分钟");
  });

  test("FAQ default open items are visible", async ({ page }) => {
    const primarySchool = page
      .locator("#faq details")
      .filter({ hasText: "教小学生吗" });
    await expect(primarySchool).toHaveAttribute("open");
    await expect(primarySchool).toContainText("非本工作室方向");
  });

  test("why section includes CELTA credentials", async ({ page }) => {
    await expect(page.locator("#why")).toContainText("CELTA");
    await expect(page.locator("#why")).toContainText("合法从业");
  });

  test("audience section has three segments", async ({ page }) => {
    const audience = page.locator("#audience");
    await expect(audience.getByRole("heading", { level: 3 })).toHaveCount(3);
  });

  test("no horizontal overflow with full page content", async ({ page }) => {
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(overflow).toBe(false);
  });
});
