import type { PdfFfsIndividual } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import { type TestField } from "@/app/form/_utils/testUtils/testFields";
import { DOWNLOAD_FILE_NAME, testFillApplication } from "e2e/utils/fillApplication";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

it("should download the application with a cover page that has accessibly readable text", () => {});

const FILE_PATH_IN_PUBLIC_DIR = `cypressTest/fee_for_service_application.pdf`;

beforeEach(() => {
  cy.exec(`mkdir -p "public/cypressTest"`);
  cy.exec(`rm -f "public/cypressTest/fee_for_service_application.pdf"`);
});

afterEach(() => {
  cy.exec(`rm -f "public/cypressTest/fee_for_service_application.pdf"`);
});

export const fillAndDownloadApplication = async (
  formPages: Array<{ url: string; fields: TestField[]; titleName: string }>,
  expectedFields: Partial<PdfFfsIndividual>,
  expectedCoverPageText: string,
) => {
  cy.visit("/");
  const titleEnding = "| NJ Doula Assistant";

  testFillApplication(formPages, titleEnding);

  cy.contains("Download your application").click();
  const downloadedPdfpath = `${Cypress.config("downloadsFolder")}/${DOWNLOAD_FILE_NAME}`;

  testCoverPageAccessibleText(downloadedPdfpath, expectedCoverPageText);
};

/**
 * Our usual pdf-lib [cannot read plain text outside of a form
 * field](https://github.com/Hopding/pdf-lib#limitations), so we use pdfjs-dist which is able to do
 * so. That said, pdfjs-dist can only read documents from URLs, and not local files. So we have
 * cypress write the downloaded file into the `public` directory, which vite then serves for
 * pdfjs-dist to call `getDocument` on.
 *
 * There's probably a way to just copy the file using a filesystem library, instead of reading and
 * writing it. But couldn't figure the imports out in a timebox.
 */

/**
 * Test that the text on the cover page can be read. We had a prior bug where the cover page of the
 * output pdf could not be accessibly read - it seemed to be an image, that was not highlight-able
 * or readable by a screenreader.
 */
const testCoverPageAccessibleText = (downloadedPdfpath: string, expectedCoverPageText: string) => {
  cy.exec(`cp "${downloadedPdfpath}" "public/${FILE_PATH_IN_PUBLIC_DIR}"`, {
    failOnNonZeroExit: true,
  }).then(async () => {
    cy.wait(500);
    const pdfUrl = `${Cypress.config("baseUrl")}/${FILE_PATH_IN_PUBLIC_DIR}`;

    cy.exec(`echo "hi"`).then(async () => {
      console.log("pdfUrl", pdfUrl);
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      const page1 = await pdf.getPage(1);
      const page1TextItems = await page1.getTextContent();
      const page1Text = page1TextItems.items
        .map((item) => {
          if ("str" in item) {
            return item.str;
          } else {
            throw new Error(`Property str unexpectedly does not exist on ${item}`);
          }
        })
        .join(" ");
      expect(page1Text).to.include(expectedCoverPageText);
    });
  });
};
