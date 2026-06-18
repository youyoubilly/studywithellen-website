import { describe, expect, it } from "vitest";
import { buildRobotsTxt, buildSitemapXml, buildStructuredData } from "./seo";
import { buildSiteUrl } from "../config/site";

describe("seo helpers", () => {
  it("builds robots.txt with sitemap reference", () => {
    const robots = buildRobotsTxt();
    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Sitemap:");
    expect(robots).toContain("/sitemap.xml");
  });

  it("builds sitemap with bilingual hreflang entries", () => {
    const xml = buildSitemapXml();
    expect(xml).toContain(buildSiteUrl("/"));
    expect(xml).toContain(buildSiteUrl("/en/"));
    expect(xml).toContain('hreflang="zh-CN"');
    expect(xml).toContain('hreflang="en"');
    expect(xml).toContain('hreflang="x-default"');
  });

  it("builds JSON-LD graph for zh locale", () => {
    const data = buildStructuredData("zh");
    const graph = data["@graph"] as Record<string, unknown>[];
    expect(graph.some((node) => node["@type"] === "WebSite")).toBe(true);
    expect(graph.some((node) => node["@type"] === "WebPage")).toBe(true);
    expect(graph.some((node) => node["@type"] === "ProfessionalService")).toBe(
      true,
    );
  });

  it("uses Tianhe District address without estate detail", () => {
    const zh = buildStructuredData("zh");
    const service = (zh["@graph"] as Record<string, unknown>[]).find(
      (node) => node["@type"] === "ProfessionalService",
    ) as { address: { addressLocality: string } };
    expect(service.address.addressLocality).toBe("天河区");
    expect(JSON.stringify(zh)).not.toContain("汇景新城");
  });
});
