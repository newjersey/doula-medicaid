/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { BASE_PATH } from "./src/app/basePath";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: BASE_PATH,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      "@form": path.resolve(__dirname, "./src/app/form"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
  },
  server: {
    port: 3000,
  },
});
