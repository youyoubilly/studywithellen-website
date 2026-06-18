import { ASSET_MANIFEST } from "../generated/asset-manifest";

/** Stock paths — services/why kept from Stage 8; hero stock is fallback only. */
export const IMAGES = {
  hero: {
    stock: "/images/hero/stock-desk.jpg",
  },
  services: {
    ielts: {
      src: "/images/services/ielts.jpg",
      alt: "一对一英语口语练习场景",
    },
    academic: {
      src: "/images/services/academic.jpg",
      alt: "大学图书馆学术学习场景",
    },
    business: {
      src: "/images/services/business.jpg",
      alt: "商务会议英语沟通场景",
    },
  },
  why: {
    ambient: "/images/why/ambient.jpg",
    alt: "大学校园学习氛围（背景）",
  },
  og: "/images/og/og-share.jpg",
  wechatQr: "/images/contact/wechat-qr.png",
  heroPortrait: {
    webp: "/images/hero/ellen-portrait.webp",
    jpg: "/images/hero/ellen-portrait.jpg",
  },
} as const;

/** Unsplash credits — interim service/why/stock fallbacks only. */
export const IMAGE_CREDITS = [
  { file: "hero/stock-desk.jpg", photo: "Jarek Ceborski", unsplash: "1456513080510" },
  { file: "services/ielts.jpg", photo: "Brooke Cagle", unsplash: "1523240795612" },
  { file: "services/academic.jpg", photo: "NeONBRAND", unsplash: "1509062522246" },
  { file: "services/business.jpg", photo: "Campaign Creators", unsplash: "1552664730" },
  { file: "why/ambient.jpg", photo: "Vince Fleming", unsplash: "1562774053" },
] as const;

export function hasEllenPortrait(): boolean {
  return ASSET_MANIFEST.portrait;
}

export function hasWechatQr(): boolean {
  return ASSET_MANIFEST.wechatQr;
}

export function getHeroImage(): { src: string; isPortrait: boolean } {
  if (ASSET_MANIFEST.portrait) {
    return { src: IMAGES.heroPortrait.webp, isPortrait: true };
  }
  return { src: IMAGES.hero.stock, isPortrait: false };
}

export function getServiceImage(serviceId: string) {
  return IMAGES.services[serviceId as keyof typeof IMAGES.services];
}
