import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const workspace = dirname(fileURLToPath(import.meta.url));

/** Static build for GitHub Pages at https://crumpm-cyber.github.io/learnbuild/ */
export default defineConfig({
  root: resolve(workspace, "pages-site"),
  base: "/learnbuild/",
  publicDir: resolve(workspace, "pages-site/public"),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": resolve(workspace, "src") },
  },
  build: {
    outDir: resolve(workspace, "docs"),
    emptyOutDir: true,
  },
});
