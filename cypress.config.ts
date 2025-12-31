import { BASE_PATH } from "@/app/basePath";
import { defineConfig } from "cypress";

module.exports = defineConfig({
  e2e: {
    baseUrl: `http://localhost:5173${BASE_PATH}`,
  },
});
