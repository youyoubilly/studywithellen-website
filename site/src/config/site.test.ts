import { describe, expect, it } from "vitest";
import {
  BOOKING_URL,
  CONTACT,
  NAV_LINKS,
  SEO,
  SITE_HOST,
  SITE_PORT,
  SITE_URL,
  buildSiteUrl,
  buildMailtoUrl,
  isValidEmail,
} from "./site";

describe("site config", () => {
  it("exports correct public URL", () => {
    expect(SITE_HOST).toBe("hk1.youyoubilly.com");
    expect(SITE_PORT).toBe(8080);
    expect(SITE_URL).toBe("http://hk1.youyoubilly.com:8080");
  });

  it("exports valid contact info", () => {
    expect(CONTACT.wechatId).toBe("Ellen_inGZ");
    expect(isValidEmail(CONTACT.email)).toBe(true);
    expect(CONTACT.location).toBeTruthy();
  });

  it("exports self-hosted booking URL", () => {
    expect(BOOKING_URL).toBe(`${SITE_URL}/book/`);
  });

  it("exports SEO metadata", () => {
    expect(SEO.title).toContain("Ellen Wang");
    expect(SEO.description.length).toBeGreaterThan(20);
    expect(SEO.keywords.length).toBeGreaterThan(0);
    expect(SEO.lang).toBe("zh-CN");
  });

  it("exports nav anchor links", () => {
    expect(NAV_LINKS.consultation).toBe("#consultation");
    expect(NAV_LINKS.contact).toBe("#contact");
    expect(NAV_LINKS.employers).toBe("#employers");
  });

  it("buildSiteUrl joins paths correctly", () => {
    expect(buildSiteUrl()).toBe(SITE_URL);
    expect(buildSiteUrl("/about")).toBe(`${SITE_URL}/about`);
  });

  it("buildMailtoUrl encodes subject", () => {
    const url = buildMailtoUrl(CONTACT.email, "试课咨询");
    expect(url).toContain(`mailto:${CONTACT.email}`);
    expect(url).toContain("subject=");
  });

  it("isValidEmail rejects invalid addresses", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});
