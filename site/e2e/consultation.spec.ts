import { test, expect } from "@playwright/test";
import { BOOKING_URL, CONTACT } from "../src/config/site";

test.describe("consultation & contact", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("consultation section has three contact cards", async ({ page }) => {
    const section = page.locator("#consultation");
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", { level: 3 })).toHaveCount(3);
    await expect(section.getByText("微信咨询")).toBeVisible();
    await expect(section.getByText("邮件联系")).toBeVisible();
    await expect(section.getByText("在线预约")).toBeVisible();
  });

  test("wechat card links to contact section", async ({ page }) => {
    await page
      .locator("#consultation")
      .getByRole("link", { name: "查看微信二维码" })
      .click();
    await expect(page.locator("#contact")).toBeInViewport();
  });

  test("email card uses mailto with correct address", async ({ page }) => {
    const emailLink = page
      .locator("#consultation")
      .getByRole("link", { name: "发送邮件" });
    await expect(emailLink).toHaveAttribute("href", new RegExp(`mailto:${CONTACT.email}`));
  });

  test("booking card links to self-hosted form", async ({ page }) => {
    const bookingLink = page
      .locator("#consultation")
      .getByRole("link", { name: "提交预约申请" });
    await expect(bookingLink).toHaveAttribute("href", BOOKING_URL);
    await expect(bookingLink).not.toHaveAttribute("target", "_blank");
  });

  test("contact section shows WeChat ID", async ({ page }) => {
    const section = page.locator("#contact");
    await expect(section).toBeVisible();
    await expect(section.getByText(CONTACT.wechatId, { exact: true })).toBeVisible();
    await expect(section.getByText("广州天河区")).toBeVisible();
  });

  test("contact section mailto link works", async ({ page }) => {
    const mailLink = page.locator("#contact").getByRole("link", {
      name: CONTACT.email,
    });
    await expect(mailLink).toHaveAttribute("href", new RegExp(`mailto:${CONTACT.email}`));
  });

  test("mobile sticky bar links to consultation", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 1280) >= 768, "Mobile only");
    const sticky = page.getByRole("navigation", { name: "快捷预约" });
    await expect(sticky).toBeVisible();
    await sticky.getByRole("link").click();
    await expect(page.locator("#consultation")).toBeInViewport();
  });

  test("header consultation link scrolls to section", async ({ page }) => {
    await page
      .getByRole("navigation", { name: "主要操作" })
      .getByRole("link", { name: /预约/ })
      .click();
    await expect(page.locator("#consultation")).toBeInViewport();
  });

  test("header wechat link scrolls to contact", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 1280) < 768, "WeChat nav hidden on mobile");
    await page
      .getByRole("navigation", { name: "主要操作" })
      .getByRole("link", { name: "微信咨询" })
      .click();
    await expect(page.locator("#contact")).toBeInViewport();
  });

  test("consultation cards have adequate tap targets on mobile", async ({
    page,
    viewport,
  }) => {
    test.skip((viewport?.width ?? 1280) >= 768, "Mobile only");
    const links = page.locator("#consultation article").getByRole("link");
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      await link.scrollIntoViewIfNeeded();
      const minHeight = await link.evaluate((el) =>
        parseFloat(window.getComputedStyle(el).minHeight),
      );
      expect(minHeight).toBeGreaterThanOrEqual(44);
    }
  });
});
