import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const NGINX_CONFIG = join(
  import.meta.dirname,
  "../../../ops/nginx-ellen.conf",
);

const REQUIRED_HEADERS = [
  "X-Frame-Options",
  "X-Content-Type-Options",
  "Referrer-Policy",
  "Permissions-Policy",
  "Content-Security-Policy",
  "server_tokens off",
] as const;

describe("nginx security config", () => {
  it("ops/nginx-ellen.conf exists", () => {
    expect(existsSync(NGINX_CONFIG)).toBe(true);
  });

  it("includes required security headers", () => {
    const config = readFileSync(NGINX_CONFIG, "utf8");
    for (const header of REQUIRED_HEADERS) {
      expect(config).toContain(header);
    }
  });

  it("listens on port 8080 for hk1.youyoubilly.com", () => {
    const config = readFileSync(NGINX_CONFIG, "utf8");
    expect(config).toContain("listen 8080");
    expect(config).toContain("server_name hk1.youyoubilly.com");
    expect(config).toContain("root /var/www/ellen");
  });
});
