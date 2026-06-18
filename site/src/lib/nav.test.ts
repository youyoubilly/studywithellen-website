import { describe, expect, it } from "vitest";
import { NAV_LINKS } from "../config/site";
import {
  HEADER_NAV,
  HERO_COPY,
  getNavHref,
  isInternalAnchor,
} from "./nav";

describe("nav helpers", () => {
  it("exports correct header nav hrefs", () => {
    expect(getNavHref("consultation")).toBe("#consultation");
    expect(getNavHref("contact")).toBe("#contact");
    expect(getNavHref("employers")).toBe("#employers");
  });

  it("header nav links point to consultation and contact", () => {
    const hrefs = HEADER_NAV.map((item) => item.href);
    expect(hrefs).toContain(NAV_LINKS.consultation);
    expect(hrefs).toContain(NAV_LINKS.contact);
  });

  it("identifies internal anchor links", () => {
    expect(isInternalAnchor("#contact")).toBe(true);
    expect(isInternalAnchor("https://example.com")).toBe(false);
  });

  it("hero copy includes IELTS headline", () => {
    expect(HERO_COPY.headline).toContain("雅思口语");
    expect(HERO_COPY.ctaPrimary).toContain("预约试课");
    expect(HERO_COPY.ctaSecondary).toContain("招聘合作");
  });

  it("hero credentials list is non-empty", () => {
    expect(HERO_COPY.credentials.length).toBeGreaterThanOrEqual(4);
  });
});
