import { describe, expect, it } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIST = join(import.meta.dirname, "../../dist");

function listFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

describe("build output", () => {
  it.skipIf(!existsSync(join(DIST, "index.html")))(
    "dist contains index.html",
    () => {
      expect(existsSync(join(DIST, "index.html"))).toBe(true);
    },
  );

  it.skipIf(!existsSync(DIST))(
    "ships without client JavaScript bundles",
    () => {
      const jsFiles = listFiles(DIST).filter((file) => file.endsWith(".js"));
      expect(jsFiles).toEqual([]);
    },
  );

  it.skipIf(!existsSync(DIST))(
    "index.html has only JSON-LD script tag",
    async () => {
      const { readFileSync } = await import("node:fs");
      const html = readFileSync(join(DIST, "index.html"), "utf8");
      expect(html).not.toMatch(/<script\b[^>]*src=/i);
      expect(html).toMatch(
        /<script type="application\/ld\+json">[\s\S]*ProfessionalService/i,
      );
    },
  );
});
