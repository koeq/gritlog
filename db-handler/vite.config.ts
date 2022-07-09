const { defineConfig } = require("vite");
const path = require("path");

module.exports = defineConfig({
  build: {
    lib: {
      entry: "index.ts",
      name: "index.js",
      fileName: "index.js",
    },
  },
});
