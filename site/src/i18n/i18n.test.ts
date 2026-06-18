import { describe, expect, it } from "vitest";
import {
  LOCALES,
  getAlternateLocale,
  getCanonicalUrl,
  getLocalePath,
  getPageContent,
  getSectionId,
  SECTION_IDS,
} from "./index";
import { buildSiteUrl } from "../config/site";

describe("i18n", () => {
  it("exports both locales", () => {
    expect(LOCALES).toEqual(["zh", "en"]);
  });

  it("maps locale paths", () => {
    expect(getLocalePath("zh")).toBe("/");
    expect(getLocalePath("en")).toBe("/en/");
  });

  it("returns alternate locale", () => {
    expect(getAlternateLocale("zh")).toBe("en");
    expect(getAlternateLocale("en")).toBe("zh");
  });

  it("builds canonical URLs per locale", () => {
    expect(getCanonicalUrl("zh")).toBe(buildSiteUrl("/"));
    expect(getCanonicalUrl("en")).toBe(buildSiteUrl("/en/"));
  });

  it("zh and en content share section structure", () => {
    for (const locale of LOCALES) {
      const content = getPageContent(locale);
      expect(content.services.items).toHaveLength(3);
      expect(content.faq.items).toHaveLength(5);
      expect(content.consultation.cards).toHaveLength(3);
    }
  });

  it("English FAQ excludes young-learner focus", () => {
    const { faq } = getPageContent("en");
    expect(faq.items[0].answer).toMatch(/young-learner/i);
    expect(faq.items[0].answer).not.toContain("非本工作室");
  });

  it("Chinese FAQ keeps original positioning", () => {
    const { faq } = getPageContent("zh");
    expect(faq.items[0].answer).toContain("非本工作室方向");
  });

  it("English services lead with IELTS Speaking", () => {
    const ielts = getPageContent("en").services.items.find(
      (s) => s.id === "ielts",
    );
    expect(ielts?.featured).toBe(true);
    expect(ielts?.title).toBe("IELTS Speaking");
  });

  it("section IDs unchanged for E2E anchors", () => {
    expect(SECTION_IDS).toContain("employers");
    expect(getSectionId("contact")).toBe("contact");
  });
});
