import { path1TestFields as business1TestFields } from "@/app/form/(formSteps)/business/1/testFields";
import { testFields as business2TestFields } from "@/app/form/(formSteps)/business/2/testFields";
import { testFields as business3TestFields } from "@/app/form/(formSteps)/business/3/testFields";
import { path1TestFields as business4TestFields } from "@/app/form/(formSteps)/business/4/testFields";
import { testFields as insurance1TestFields } from "@/app/form/(formSteps)/insurance/1/testFields";
import { testFields as insurance2TestFields } from "@/app/form/(formSteps)/insurance/2/testFields";
import {
  firstNameField,
  lastNameField,
  middleNameField,
  testFields as personal1TestFields,
  phoneNumberField,
} from "@/app/form/(formSteps)/personal/1/testFields";
import { minimalTestFields as personal2TestFields } from "@/app/form/(formSteps)/personal/2/testFields";
import { testFields as personal3TestFields } from "@/app/form/(formSteps)/personal/3/testFields";
import { testFields as screening1TestFields } from "@/app/form/(formSteps)/screening/1/testFields";
import { testFields as screening2TestFields } from "@/app/form/(formSteps)/screening/2/testFields";
import { testFields as screening3TestFields } from "@/app/form/(formSteps)/screening/3/testFields";
import { path1TestFields as training1TestFields } from "@/app/form/(formSteps)/training/1/testFields";
import type { PdfFfsIndividual } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import { type TestField } from "@/app/form/_utils/testUtils/sharedTests";
import { PDFCheckBox, PDFDocument, PDFTextField } from "pdf-lib";
import { pdfjsLib } from "pdfjs-dist";

export const baseFormPages = [
  { url: "/form/screening/1", fields: screening1TestFields, titleName: "Screening 1 of 3" },
  { url: "/form/screening/2", fields: screening2TestFields, titleName: "Screening 2 of 3" },
  { url: "/form/screening/3", fields: screening3TestFields, titleName: "Screening 3 of 3" },
  { url: "/form/insurance/1", fields: insurance1TestFields, titleName: "Insurance 1 of 2" },
  { url: "/form/insurance/2", fields: insurance2TestFields, titleName: "Insurance 2 of 2" },
  { url: "/form/training/1", fields: training1TestFields, titleName: "Training 1 of 1" },
  {
    url: "/form/personal/1",
    fields: personal1TestFields,
    titleName: "Personal 1 of 3",
  },
  {
    url: "/form/personal/2",
    fields: personal2TestFields,
    titleName: "Personal 2 of 3",
  },
  {
    url: "/form/personal/3",
    fields: personal3TestFields,
    titleName: "Personal 3 of 3",
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
];

const legalName = `${firstNameField.expectedValue} ${middleNameField.expectedValue} ${lastNameField.expectedValue}`;
const coverPageText = "This is your pre-filled Medicaid Fee-for-Service application";
export const baseExpectedFields: Partial<PdfFfsIndividual> = {
  fd427LegalName: legalName, // page 4
  fd443telephoneno: phoneNumberField.expectedValue, // page 6
  fd425legalname: legalName, // page 8
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

export const fillAndDownloadApplication = (
  formPages: Array<{ url: string; fields: TestField[]; titleName: string }>,
  expectedFields: Partial<PdfFfsIndividual>,
) => {
  /**
   * Test one field per page, and one of every type of field. Leaving unit individual-page tests to
   * test that every field within the page is filled under different circumstances
   */

  cy.visit("/");
  cy.url().should("eq", `${Cypress.config("baseUrl")}/form/welcome`);
  const titleEnding = "| NJ Doula Assistant";
  cy.wait(500); // The title takes a moment to update
  cy.title().should("eq", `Welcome ${titleEnding}`);
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

  // Test clicking previous, and prepopulation
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

  for (const _ of formPages.slice(0, -1)) {
    cy.contains("button", "Next").click();
  }
  cy.contains("button", "Review").click();

  cy.url().should("eq", `${Cypress.config("baseUrl")}/form/review`);
  cy.title().should("eq", `Review ${titleEnding}`);
  cy.contains("Download your application").click();

  cy.readFile(`${Cypress.config("downloadsFolder")}/Fee For Service Application.pdf`, null).then(
    async (file: typeof Cypress.Buffer) => {
      /**
       * Uint8Array wants an ArrayBuffer. The type checker complains that the Buffer type returned
       * by cypress lacks properties like slice, maxByteLength, resizable, resize, and 4 more. I
       * simply could not figure out how to convert https://docs.cypress.io/api/utilities/buffer to
       * an ArrayBuffer.
       *
       * I don't know if I'm typing file incorrectly. https://docs.cypress.io/api/commands/readfile
       * does seem to indicate that the return is indeed Cypress.Buffer However, the codes does
       * run.
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
    },
  );

  // The cover page should have accessibly readable text
  // We need to use a different pdf library, as our usual one cannot read text: https://github.com/Hopding/pdf-lib#limitations

  pdfjsLib.getDocument("helloworld.pdf");
};
