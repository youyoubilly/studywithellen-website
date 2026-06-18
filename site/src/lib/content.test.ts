import { describe, expect, it } from "vitest";
import {
  AUDIENCE,
  BACKGROUND,
  CONSULTATION,
  CONTACT_SECTION,
  EMPLOYERS,
  FAQ,
  SECTION_IDS,
  SERVICES,
  WHY_ELLEN,
  getSectionId,
} from "./content";

describe("page content", () => {
  it("exports all required section IDs", () => {
    expect(SECTION_IDS).toContain("hero");
    expect(SECTION_IDS).toContain("audience");
    expect(SECTION_IDS).toContain("services");
    expect(SECTION_IDS).toContain("employers");
    expect(SECTION_IDS).toContain("faq");
  });

  it("getSectionId returns anchor id", () => {
    expect(getSectionId("services")).toBe("services");
  });

  it("audience includes student segments", () => {
    expect(AUDIENCE.segments.length).toBe(3);
    expect(AUDIENCE.segments[0].title).toContain("高中生");
  });

  it("services features IELTS as primary card", () => {
    const ielts = SERVICES.items.find((s) => s.id === "ielts");
    expect(ielts?.featured).toBe(true);
    expect(ielts?.title).toContain("雅思口语");
  });

  it("why ellen mentions non-child teaching style", () => {
    const style = WHY_ELLEN.points.find((p) => p.title === "教学风格");
    expect(style?.body).toContain("非低龄");
  });

  it("background timeline includes Guangzhou institutions", () => {
    const orgs = BACKGROUND.timeline.map((t) => t.org);
    expect(orgs.some((o) => o.includes("广州理工"))).toBe(true);
    expect(orgs.some((o) => o.includes("启德"))).toBe(true);
  });

  it("employers section is in English with credentials", () => {
    expect(EMPLOYERS.paragraphs[0]).toContain("CELTA");
    expect(EMPLOYERS.credentials).toContain("DELTA");
  });

  it("FAQ filters out primary school teaching", () => {
    expect(FAQ.items[0].question).toContain("小学生");
    expect(FAQ.items[0].answer).toContain("非本工作室方向");
  });

  it("FAQ has first two items open by default", () => {
    const openItems = FAQ.items.filter((i) => i.openByDefault);
    expect(openItems.length).toBe(2);
  });

  it("consultation section has three contact paths", () => {
    expect(CONSULTATION.cards.length).toBe(3);
    expect(CONSULTATION.cards.map((c) => c.id)).toEqual([
      "calendar",
      "wechat",
      "email",
    ]);
  });

  it("contact section includes wechat instruction", () => {
    expect(CONTACT_SECTION.instruction).toContain("试课");
    expect(CONTACT_SECTION.instruction).toContain("招聘");
    expect(CONTACT_SECTION.location).toContain("天河区");
  });
});
