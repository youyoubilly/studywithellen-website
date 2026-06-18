import type { APIRoute } from "astro";
import { buildSitemapXml } from "../lib/seo";

export const GET: APIRoute = () =>
  new Response(buildSitemapXml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
