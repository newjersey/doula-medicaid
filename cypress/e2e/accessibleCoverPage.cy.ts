import { DOWNLOAD_FILE_NAME, formPages, testFillApplication } from "e2e/utils/fillApplication";
import type { PDFDocumentProxy } from "pdfjs-dist";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

beforeEach(() => {
  cy.exec(`mkdir -p "public/cypressTest"`);
  cy.exec(`rm -f "public/cypressTest/fee_for_service_application.pdf"`);
});

afterEach(() => {
  cy.exec(`rm -f "public/cypressTest/fee_for_service_application.pdf"`);
});

it("should download the application with a cover page that has accessibly readable text [accessibleCoverPage]", () => {
  cy.visit("/");
  const titleEnding = "| NJ Doula Assistant";
  testFillApplication(formPages, titleEnding);
  cy.contains("Download your application").click();

  const downloadedPdfpath = `${Cypress.config("downloadsFolder")}/${DOWNLOAD_FILE_NAME}`;
  const filePathInPublicDir = `cypressTest/fee_for_service_application.pdf`;

  cy.exec(`cp "${downloadedPdfpath}" "public/${filePathInPublicDir}"`, {
    failOnNonZeroExit: true,
  }).then(async () => {
    // cy.wait(500);
    const pdfUrl = `${Cypress.config("baseUrl")}/${filePathInPublicDir}`;
    cy.exec(`echo "hi"`).then(async () => {
      /**
       * I truly do not understand why this cy exec statement makes a difference, but it does. It
       * works in that the test passes, but also in that in a manual attempt, the test will fail if
       * e.g. changing `expectedCoverPageText` to something invalid, both locally and on CI.
       *
       * Without it, `await pdfjsLib.getDocument(pdfUrl).promise` gets the error:
       * "InvalidPDFException: Invalid PDF structure.". Even though the pdf if indeed available at
       * `pdfUrl`, when manually checked.
       *
       * A long enough cy.wait() of 2000 usually is long enough to fix the Invalid PDF structure
       * error. However, wait's aren't great because they add time and are not actually
       * deterministic.
       *
       * Note that even though `cy.exec()` is then-able, it's not actually a promise.
       *
       * Breaking up into a single flat chain of .then, without the exec, does not work
       */
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      const page1Text = await getAllPageText(pdf, 1);
      expect(page1Text).to.include("This is your pre-filled Medicaid Fee-for-Service application");
    });
  });
});

const getAllPageText = async (pdf: PDFDocumentProxy, pageNum: number) => {
  const page = await pdf.getPage(pageNum);
  const pageTextItems = await page.getTextContent();
  const pageText = pageTextItems.items
    .map((item) => {
      if ("str" in item) {
        return item.str;
      } else {
        throw new Error(`Property str unexpectedly does not exist on ${item}`);
      }
    })
    .join(" ");
  return pageText;
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
const testCoverPageAccessibleText = (
  downloadedPdfpath: string,
  filePathInPublicDir: string,
  expectedCoverPageText: string,
) => {};
