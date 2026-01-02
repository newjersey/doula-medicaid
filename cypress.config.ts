import { defineConfig } from "cypress";
import { BASE_PATH } from "./src/app/basePath";

module.exports = defineConfig({
  e2e: {
    baseUrl: `http://localhost:3000${BASE_PATH}`,
  },
});
