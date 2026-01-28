import {
  firstNameField,
  lastNameField,
  middleNameField,
  phoneNumberField,
} from "@/app/form/(formSteps)/personal/1/testFields";
import type { PdfFfsIndividual } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import { type TestField } from "@/app/form/_utils/testUtils/testFields";
import { DOWNLOAD_FILE_NAME, formPages, testFillApplication } from "e2e/utils/testFillApplication";
import { PDFCheckBox, PDFDocument, PDFTextField } from "pdf-lib";

it("should fill and download the application", () => {
  const legalName = `${firstNameField.expectedValue} ${middleNameField.expectedValue} ${lastNameField.expectedValue}`;
  /**
   * Test one field per page, and one of every type of field. Leaving unit individual-page tests to
   * test that every field within the page is filled under different circumstances
   */
  const expectedFields: Partial<PdfFfsIndividual> = {
    fd427LegalName: legalName, // page 4
    fd443telephoneno: phoneNumberField.expectedValue, // page 6
    fd425legalname: legalName, // page 8
    fd425licensesuspensionno: true, // page 9
    "fd455aREQPAPER_Provider Name": legalName, // page 13
    "fd452disclosingentitySole Proprietorship": true, // page 17
    fd452affliatedprevious12monthsno: true, // page 18
    fd452nameofotherentitywithownershipinteresline1: "N/A", // page 19
    fd452significanttransactionsprevious5yearsline1: "N/A", // page 20
    fd452ownershiphealthcareproviderno: true, // page 21
    fd452operatedorfiscallymanagedno: true, // page 22
    fd452increasedbedcapacityno: true, // page 23
    "W9_Name See Specific Instructions on page 2": legalName, // page 26
  };

  cy.visit("/");
  cy.url().should("eq", `${Cypress.config("baseUrl")}/form/welcome`);
  const titleEnding = "| NJ Doula Assistant";
  cy.title().should("eq", `Welcome ${titleEnding}`);

  testFillApplication(formPages, titleEnding);
  testFieldsArePrepopulated(formPages, titleEnding);

  cy.contains("Download your application", { timeout: 8000 }).click();
  const downloadedPdfpath = `${Cypress.config("downloadsFolder")}/${DOWNLOAD_FILE_NAME}`;

  testPdfFields(downloadedPdfpath, expectedFields);
});

const testFieldsArePrepopulated = (
  formPages: Array<{ url: string; fields: TestField[]; titleName: string }>,
  titleEnding: string,
) => {
  // Starting from the Review page, test clicking previous, and prepopulation
  for (const formPage of [...formPages].reverse()) {
    cy.contains("Previous").click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}${formPage.url}`);
    cy.window().its("scrollY").should("equal", 0);
    cy.title().should("eq", `${formPage.titleName} ${titleEnding}`);

    cy.get("main form").within(() => {
      for (const field of formPage.fields) {
        if (field.role === "textbox") {
          cy.get(`input[name="${field.dataStoreKey}"]`).should("have.value", field.expectedValue);
        } else if (field.role === "radio") {
          cy.get(`input[name="${field.dataStoreKey}"][value="${field.testValue}"]`).should(
            "be.checked",
          );
        } else if (field.role === "combobox") {
          cy.get(`select[name="${field.dataStoreKey}"]`).should("have.value", field.expectedValue);
        } else {
          throw new Error(`Unexpected type ${field.role}`);
        }
      }
    });
  }

  // Go back to review page
  for (const formPage of formPages.slice(0, -1)) {
    /**
     * We don't really need to test that the URL is correct. However, it helps make sure that we are
     * on the next page before clicking "Next" again. We have gotten CI flakes e.g.
     * https://github.com/org-njdhs-mahs/doula-medicaid/actions/runs/21365005037/job/61494218856,
     * that my be due to "Next" being clicked twice on the same page.
     */
    cy.url().should("eq", `${Cypress.config("baseUrl")}${formPage.url}`);
    cy.contains("button", "Next").click();
  }
  cy.contains("button", "Review").click();
  cy.url().should("eq", `${Cypress.config("baseUrl")}/form/review`);
};

const testPdfFields = async (
  downloadedPdfpath: string,
  expectedFields: Partial<PdfFfsIndividual>,
) => {
  cy.readFile(downloadedPdfpath, null).then(async (file: typeof Cypress.Buffer) => {
    /**
     * Uint8Array wants an ArrayBuffer. The type checker complains that the Buffer type returned by
     * cypress lacks properties like slice, maxByteLength, resizable, resize, and 4 more. I simply
     * could not figure out how to convert https://docs.cypress.io/api/utilities/buffer to an
     * ArrayBuffer.
     *
     * I don't know if I'm typing file incorrectly. https://docs.cypress.io/api/commands/readfile
     * does seem to indicate that the return is indeed Cypress.Buffer However, the codes does run.
     */
    //  @ts-expect-error see above
    const uint8Array = new Uint8Array(file);
    const pdfDoc = await PDFDocument.load(uint8Array);
    const form = pdfDoc.getForm();

    const pageCount = pdfDoc.getPageCount();
    expect(pageCount).to.equal(39);

    for (const [key, value] of Object.entries(expectedFields)) {
      const field = form.getField(key);
      if (field instanceof PDFTextField) {
        expect(field.getText()).to.equal(value);
      } else if (field instanceof PDFCheckBox) {
        expect(field.isChecked()).to.equal(value);
      } else {
        throw new Error(`Unexpected field class ${field.constructor.name}`);
      }
    }
  });
};
