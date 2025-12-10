import {
  baseExpectedFields,
  baseFormPages,
  fillAndDownloadApplication,
} from "./fillAndDownloadApplication";

it("should fill and download the application [productionFlags]", () => {
  fillAndDownloadApplication(baseFormPages, baseExpectedFields);
});
