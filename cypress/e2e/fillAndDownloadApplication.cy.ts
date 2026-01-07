import { path1TestFields as business1TestFields } from "@/app/form/(formSteps)/business/1/testFields";
import { testFields as business2TestFields } from "@/app/form/(formSteps)/business/2/testFields";
import { testFields as business3TestFields } from "@/app/form/(formSteps)/business/3/testFields";
import { path1TestFields as business4TestFields } from "@/app/form/(formSteps)/business/4/testFields";
import { testFields as insurance1TestFields } from "@/app/form/(formSteps)/insurance/1/testFields";
import { testFields as insurance2TestFields } from "@/app/form/(formSteps)/insurance/2/testFields";
import { path1TestFields as legal1TestFields } from "@/app/form/(formSteps)/legal/1/testFields";
import { path1TestFields as legal2TestFields } from "@/app/form/(formSteps)/legal/2/testFields";
import { path1TestFields as legal3TestFields } from "@/app/form/(formSteps)/legal/3/testFields";
import {
  firstNameField,
  lastNameField,
  middleNameField,
  testFields as personal1TestFields,
  phoneNumberField,
} from "@/app/form/(formSteps)/personal/1/testFields";
import { minimalTestFields as personal2TestFields } from "@/app/form/(formSteps)/personal/2/testFields";
import { testFields as personal3TestFields } from "@/app/form/(formSteps)/personal/3/testFields";
import { path1TestFields as personal4TestFields } from "@/app/form/(formSteps)/personal/4/testFields";
import { testFields as screening1TestFields } from "@/app/form/(formSteps)/screening/1/testFields";
import { testFields as screening2TestFields } from "@/app/form/(formSteps)/screening/2/testFields";
import { testFields as screening3TestFields } from "@/app/form/(formSteps)/screening/3/testFields";
import { path1TestFields as training1TestFields } from "@/app/form/(formSteps)/training/1/testFields";
import type { PdfFfsIndividual } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import { type TestField } from "@/app/form/_utils/testUtils/testFields";
import { PDFCheckBox, PDFDocument, PDFTextField } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

// Use Cypress to remove test artifacts instead of Node `fs` (not available in bundled specs)

it("should fill and download the application", () => {
  const formPages = [
    { url: "/form/screening/1", fields: screening1TestFields, titleName: "Screening 1 of 3" },
    { url: "/form/screening/2", fields: screening2TestFields, titleName: "Screening 2 of 3" },
    { url: "/form/screening/3", fields: screening3TestFields, titleName: "Screening 3 of 3" },
    { url: "/form/insurance/1", fields: insurance1TestFields, titleName: "Insurance 1 of 2" },
    { url: "/form/insurance/2", fields: insurance2TestFields, titleName: "Insurance 2 of 2" },
    { url: "/form/training/1", fields: training1TestFields, titleName: "Training 1 of 1" },
    {
      url: "/form/personal/1",
      fields: personal1TestFields,
      titleName: "Personal 1 of 4",
    },
    {
      url: "/form/personal/2",
      fields: personal2TestFields,
      titleName: "Personal 2 of 4",
    },
    {
      url: "/form/personal/3",
      fields: personal3TestFields,
      titleName: "Personal 3 of 4",
    },
    {
      url: "/form/personal/4",
      fields: personal4TestFields,
      titleName: "Personal 4 of 4",
    },
    {
      url: "/form/business/1",
      fields: business1TestFields,
      titleName: "Business 1 of 4",
    },
    {
      url: "/form/business/2",
      fields: business2TestFields,
      titleName: "Business 2 of 4",
    },
    {
      url: "/form/business/3",
      fields: business3TestFields,
      titleName: "Business 3 of 4",
    },
    {
      url: "/form/business/4",
      fields: business4TestFields,
      titleName: "Business 4 of 4",
    },
    { url: "/form/legal/1", fields: legal1TestFields, titleName: "Legal 1 of 3" },
    { url: "/form/legal/2", fields: legal2TestFields, titleName: "Legal 2 of 3" },
    { url: "/form/legal/3", fields: legal3TestFields, titleName: "Legal 3 of 3" },
  ];

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

  const expectedCoverPageText = "This is your pre-filled Medicaid Fee-for-Service application";

  fillAndDownloadApplication(formPages, expectedFields, expectedCoverPageText);
});

const FILE_NAME = "Fee For Service Application.pdf";
const FILE_PATH_IN_PUBLIC_DIR = `cypressTest/fee_for_service_application.pdf`;

// also do this before
beforeEach(() => {
  // Use cy.exec to run a shell command to remove the file. Do not fail the test if file
  // is already missing (failOnNonZeroExit: false).
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  cy.exec(`rm -f "public/${FILE_PATH_IN_PUBLIC_DIR}"`, { failOnNonZeroExit: false });
});

export const fillAndDownloadApplication = async (
  formPages: Array<{ url: string; fields: TestField[]; titleName: string }>,
  expectedFields: Partial<PdfFfsIndividual>,
  expectedCoverPageText: string,
) => {
  cy.visit("/");
  cy.url().should("eq", `${Cypress.config("baseUrl")}/form/welcome`);
  const titleEnding = "| NJ Doula Assistant";
  cy.title().should("eq", `Welcome ${titleEnding}`);

  testFillApplication(formPages, titleEnding);
  testFieldsArePrepopulated(formPages, titleEnding);

  cy.contains("Download your application").click();
  const downloadedPdfpath = `${Cypress.config("downloadsFolder")}/${FILE_NAME}`;

  cy.readFile(`${Cypress.config("downloadsFolder")}/${FILE_NAME}`, null).then(
    async (file: typeof Cypress.Buffer) => {
      await testPdfFields(file, expectedFields);
      return file;
    },
  );

  await testCoverPageAccessibleText(downloadedPdfpath, expectedCoverPageText);

  // throw new Error("test");
};

const testFillApplication = (
  formPages: Array<{ url: string; fields: TestField[]; titleName: string }>,
  titleEnding: string,
) => {
  cy.contains("Start now").click();

  for (const [index, formPage] of formPages.entries()) {
    cy.url().should("eq", `${Cypress.config("baseUrl")}${formPage.url}`);
    cy.window().its("scrollY").should("equal", 0); // The page view should be at the top
    cy.title().should("eq", `${formPage.titleName} ${titleEnding}`);

    cy.get("form").within(() => {
      for (const field of formPage.fields) {
        if (field.role === "textbox") {
          cy.get(`input[name="${field.dataStoreKey}"]`).type(field.testValue);
        } else if (field.role === "radio") {
          cy.get(`input[name="${field.dataStoreKey}"][value="${field.testValue}"]`).check({
            force: true,
          });
        } else if (field.role === "combobox") {
          cy.get(`select[name="${field.dataStoreKey}"]`).select(field.testValue);
        } else {
          throw new Error(`Unexpected type ${field.role}`);
        }
      }
    });
    if (index !== formPages.length - 1) {
      cy.contains("button", "Next").click();
    } else {
      cy.contains("button", "Review").click();
    }
  }
  cy.url().should("eq", `${Cypress.config("baseUrl")}/form/review`);
  cy.title().should("eq", `Review ${titleEnding}`);
};

const testFieldsArePrepopulated = (
  formPages: Array<{ url: string; fields: TestField[]; titleName: string }>,
  titleEnding: string,
) => {
  // Starting from the Review page, test clicking previous, and prepopulation
  for (const formPage of formPages.reverse()) {
    cy.contains("Previous").click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}${formPage.url}`);
    cy.window().its("scrollY").should("equal", 0);
    cy.title().should("eq", `${formPage.titleName} ${titleEnding}`);

    cy.get("form").within(() => {
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
  for (const _ of formPages.slice(0, -1)) {
    cy.contains("button", "Next").click();
  }
  cy.contains("button", "Review").click();
  cy.url().should("eq", `${Cypress.config("baseUrl")}/form/review`);
};

const testPdfFields = async (
  file: typeof Cypress.Buffer,
  expectedFields: Partial<PdfFfsIndividual>,
) => {
  /**
   * Uint8Array wants an ArrayBuffer. The type checker complains that the Buffer type returned by
   * cypress lacks properties like slice, maxByteLength, resizable, resize, and 4 more. I simply
   * could not figure out how to convert https://docs.cypress.io/api/utilities/buffer to an
   * ArrayBuffer.
   *
   * I don't know if I'm typing file incorrectly. https://docs.cypress.io/api/commands/readfile does
   * seem to indicate that the return is indeed Cypress.Buffer However, the codes does run.
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
const testCoverPageAccessibleText = async (
  downloadedPdfpath: string,
  expectedCoverPageText: string,
) => {
  cy.exec(`cp "${downloadedPdfpath}" "public/${FILE_PATH_IN_PUBLIC_DIR}"`, {
    failOnNonZeroExit: true,
  }).then(async () => {
    const pdfUrl = `${Cypress.config("baseUrl")}/${FILE_PATH_IN_PUBLIC_DIR}`;
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
};
