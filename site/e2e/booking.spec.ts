import { test, expect } from "@playwright/test";

const BOOKING_BASE =
  process.env.BOOKING_URL ?? "http://127.0.0.1:8787/book/";

test.describe("booking form", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BOOKING_BASE}?lang=zh`);
  });

  test("shows modular slot picker with timezone and day tabs", async ({
    page,
  }) => {
    await expect(page.locator("#slot-picker")).toBeVisible();
    await expect(page.locator("#timezone-select")).toBeVisible();
    await expect(page.locator("#day-tabs")).toBeVisible();
    await expect(page.locator(".time-chip").first()).toBeVisible();
    await expect(page.locator(".purpose-pill")).toHaveCount(2);
  });

  test("selects time chips up to five", async ({ page }) => {
    await page.locator("#slot-picker").scrollIntoViewIfNeeded();

    await page.locator("#time-grid .time-chip", { hasText: "10:00" }).click();
    await page.locator("#time-grid .time-chip", { hasText: "14:00" }).click();

    await expect(page.locator("#selected-count")).toContainText("2/5");
    await expect(page.locator("#selection-summary")).toBeVisible();
  });

  test("English locale renders booking form", async ({ page }) => {
    await page.goto(`${BOOKING_BASE}?lang=en`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Book a Consultation",
    );
    await expect(page.locator("#timezone-select")).toBeVisible();
  });
});
