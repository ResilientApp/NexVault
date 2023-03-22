import { crx, ManifestV3Export } from "@crxjs/vite-plugin";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import path from "path";
import manifest from "./manifest.json";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [vue(), crx({ manifest: manifest as ManifestV3Export })],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          "border-radius-base": "0px",
          "font-family": "Poppins, sans-serif",
        },
      },
      scss: {
        additionalData: `@import "@/styles/variables";`,
      },
    },
  },
});
