import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "gritlog",
        short_name: "gritlog",
        display: "standalone",
        background_color: "#090B13",
        theme_color: "#090B13",
        icons: [
          {
            src: "icons/flash_192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/flash_512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      // devOptions: {
      //   enabled: true,
      // },
    }),
  ],
  server: {
    port: 3000,
  },
});
