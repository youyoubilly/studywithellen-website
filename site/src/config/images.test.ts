import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { ASSET_MANIFEST } from "../generated/asset-manifest";
import {
  getHeroImage,
  getServiceImage,
  hasEllenPortrait,
  hasWechatQr,
  IMAGES,
  IMAGE_CREDITS,
} from "./images";

const PUBLIC = join(import.meta.dirname, "../../public");

describe("images config", () => {
  it("manifest matches synced portrait files", () => {
    const onDisk =
      existsSync(join(PUBLIC, "images/hero/ellen-portrait.webp")) ||
      existsSync(join(PUBLIC, "images/hero/ellen-portrait.jpg"));
    expect(ASSET_MANIFEST.portrait).toBe(onDisk);
    expect(hasEllenPortrait()).toBe(onDisk);
  });

  it("uses Ellen portrait when manifest says so", () => {
    if (!hasEllenPortrait()) {
      expect(getHeroImage().src).toBe(IMAGES.hero.stock);
      return;
    }
    const hero = getHeroImage();
    expect(hero.isPortrait).toBe(true);
    expect(hero.src).toBe(IMAGES.heroPortrait.webp);
  });

  it("maps all service ids to images", () => {
    for (const id of ["ielts", "academic", "business"]) {
      const image = getServiceImage(id);
      expect(image?.src).toMatch(/^\/images\/services\//);
      expect(image?.alt).toBeTruthy();
    }
  });

  it("ellen portrait and OG files exist when manifest enabled", () => {
    if (!hasEllenPortrait()) return;
    const paths = [
      IMAGES.heroPortrait.webp,
      IMAGES.heroPortrait.jpg,
      IMAGES.og,
    ];
    for (const webPath of paths) {
      const file = join(PUBLIC, webPath.replace(/^\//, ""));
      expect(existsSync(file), `missing ${webPath}`).toBe(true);
    }
  });

  it("tracks wechat QR availability", () => {
    const onDisk = existsSync(join(PUBLIC, "images/contact/wechat-qr.png"));
    expect(ASSET_MANIFEST.wechatQr).toBe(onDisk);
    expect(hasWechatQr()).toBe(onDisk);
  });

  it("records unsplash credits for interim service assets", () => {
    expect(IMAGE_CREDITS.length).toBeGreaterThanOrEqual(4);
  });
});
