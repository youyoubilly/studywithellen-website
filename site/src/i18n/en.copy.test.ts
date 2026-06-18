import { describe, expect, it } from "vitest";
import { getPageContent } from "./index";

const ALLOWED_CJK = ["中文"];

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") {
    out.push(value);
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out);
    return out;
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectStrings(item, out);
  }
  return out;
}

function stripAllowedCjk(text: string): string {
  let result = text;
  for (const allowed of ALLOWED_CJK) {
    result = result.replaceAll(allowed, "");
  }
  return result;
}

function hasUnexpectedCjk(text: string): boolean {
  return /[\u4e00-\u9fff]/.test(stripAllowedCjk(text));
}

describe("English copy quality (Stage 10)", () => {
  const content = getPageContent("en");

  it("hero targets recruiters with credentials CTA", () => {
    expect(content.hero.ctaSecondary).toBe("View credentials");
    expect(content.hero.ctaSecondaryHref).toBe("#background");
    expect(content.hero.subheadline).toContain("British EAL teacher");
  });

  it("employers block matches approved source copy", () => {
    expect(content.employers.paragraphs[0]).toContain(
      "CELTA- and DELTA-qualified EAL teacher",
    );
    expect(content.employers.credentials).toContain("Chinese Permanent Residence");
  });

  it("FAQ clarifies non-primary-school focus in English", () => {
    expect(content.faq.items[0].answer).toContain("Young-learner");
    expect(content.faq.items[0].answer).not.toContain("非本工作室");
  });

  it("visible English strings avoid Chinese UI copy", () => {
    const strings = collectStrings({
      seo: content.seo,
      hero: content.hero,
      header: content.header,
      audience: content.audience,
      services: content.services,
      whyEllen: content.whyEllen,
      background: content.background,
      employers: content.employers,
      faq: content.faq,
      consultation: content.consultation,
      contact: content.contact,
      footer: content.footer,
      stickyBar: content.stickyBar,
      images: content.images,
    });

    const offenders = strings.filter(hasUnexpectedCjk);
    expect(offenders).toEqual([]);
  });

  it("image alt text is English on EN locale", () => {
    expect(content.images.hero.portraitAlt).toMatch(/Ellen Wang/i);
    expect(content.images.services.ielts.alt).toMatch(/speaking practice/i);
  });
});
