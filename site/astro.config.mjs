// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "http://hk1.youyoubilly.com:8080",
  vite: {
    plugins: [tailwindcss()],
  },
});
