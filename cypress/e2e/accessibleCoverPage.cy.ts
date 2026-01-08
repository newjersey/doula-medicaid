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

/**
 * Test that the text on the cover page can be read. We had a prior bug where the cover page of the
 * output pdf could not be accessibly read - it seemed to be an image, that was not highlight-able
 * or readable by a screenreader.
 *
 * This test has multiple exceptions to our usual patterns.
 *
 * 1. Our usual pdf-lib [cannot read plain text outside of a form
 *    field](https://github.com/Hopding/pdf-lib#limitations), so we use pdfjs-dist which is able to
 *    do so.
 * 2. Additionally, pdfjs-dist can only read documents from URLs, and not local files. So we copy the
 *    downloaded pdf from the cypress download dir to the `public` directory. Vite then serves the
 *    public asset for pdfjs-dist to call `getDocument` on.
 * 3. In order to hot reload with the new public asset, we run this cypress on CI against the dev
 *    server, instead of npm build + preview. That is why this test has the `[accessibleCoverPage]`
 *    tag and runs as a separate process from other cypress test. It is the only test that test
 *    against the dev server.
 */
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
    const pdfUrl = `${Cypress.config("baseUrl")}/${filePathInPublicDir}`;
    /**
     * I truly do not understand why this cy exec statement below makes a difference, but it does.
     * It works in that the test passes, but also in that in manual attempts, the test fails when it
     * should. E.g., test the failure by changing `expectedCoverPageText` to something invalid.
     *
     * Without this cy. statement, `await pdfjsLib.getDocument(pdfUrl).promise` gets the error:
     * "InvalidPDFException: Invalid PDF structure.". Even though the pdf if indeed available at
     * `pdfUrl`, when manually accessing the URL.
     *
     * Cypress docs are confusing on cy. statements and .then() behavior. Note that even though
     * `cy.exec()` is then-able, it's not actually a promise, and you can't await them. Per [cypress
     * docs](https://docs.cypress.io/app/core-concepts/variables-and-aliases), the commands outside
     * of the .then() will not run until all of the nested commands finish.
     *
     * Breaking up into a single flat chain of .then, without the exec, does not work.
     *
     * A long enough cy.wait() of 2000 usually is long enough to fix the Invalid PDF structure
     * error. However, wait's aren't great because they add time and are not actually deterministic.
     * So instead, we have this `echo "hi"`
     */
    cy.exec(`echo "hi"`).then(async () => {
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
      // To satisfy typescript. The type definition seems off and missing .str
      if ("str" in item) {
        return item.str;
      } else {
        throw new Error(`Property str unexpectedly does not exist on ${item}`);
      }
    })
    .join(" ");
  return pageText;
};
