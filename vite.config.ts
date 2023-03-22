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
            src: "icons/152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "icons/167.png",
            sizes: "167x167",
            type: "image/png",
          },
          {
            src: "icons/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
          },
          {
            src: "icons/192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "icons/512.png",
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
