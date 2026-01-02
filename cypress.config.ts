import { BASE_PATH } from "@/app/basePath";
import { defineConfig } from "cypress";

module.exports = defineConfig({
  e2e: {
    baseUrl: `http://localhost:3000${BASE_PATH}`,
  },
});
