import { minimalTestFields as businessDetails1TestFields } from "@/app/form/(formSteps)/business-details/1/testFields";
import { minimalTestFields as businessDetails2TestFields } from "@/app/form/(formSteps)/business-details/2/testFields";
import { minimalTestFields as businessDetails3TestFields } from "@/app/form/(formSteps)/business-details/3/testFields";
import { testFields as insurance1TestFields } from "@/app/form/(formSteps)/insurance/1/testFields";
import { testFields as insurance2TestFields } from "@/app/form/(formSteps)/insurance/2/testFields";
import {
  firstNameField,
  lastNameField,
  middleNameField,
  testFields as personalDetails1TestFields,
  phoneNumberField,
} from "@/app/form/(formSteps)/personal-details/1/testFields";
import { minimalTestFields as personalDetails2TestFields } from "@/app/form/(formSteps)/personal-details/2/testFields";
import { testFields as personalDetails3TestFields } from "@/app/form/(formSteps)/personal-details/3/testFields";
import { testFields as screening1TestFields } from "@/app/form/(formSteps)/screening/1/testFields";
import { testFields as screening2TestFields } from "@/app/form/(formSteps)/screening/2/testFields";
import { testFields as screening3TestFields } from "@/app/form/(formSteps)/screening/3/testFields";
import { minimalTestFields as training1TestFields } from "@/app/form/(formSteps)/training/1/testFields";
import type { PdfFfsIndividual } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import { TestField } from "@/app/form/_utils/testUtils/sharedTests";
import { PDFCheckBox, PDFDocument, PDFTextField } from "pdf-lib";

export const formPages = [
  { url: "/form/screening/1", fields: screening1TestFields, titleName: "Screening 1 of 3" },
  { url: "/form/screening/2", fields: screening2TestFields, titleName: "Screening 2 of 3" },
  { url: "/form/screening/3", fields: screening3TestFields, titleName: "Screening 3 of 3" },
  { url: "/form/insurance/1", fields: insurance1TestFields, titleName: "Insurance 1 of 2" },
  { url: "/form/insurance/2", fields: insurance2TestFields, titleName: "Insurance 2 of 2" },
  { url: "/form/training/1", fields: training1TestFields, titleName: "Training 1 of 1" },
  {
    url: "/form/personal-details/1",
    fields: personalDetails1TestFields,
    titleName: "Personal details 1 of 3",
  },
  {
    url: "/form/personal-details/2",
    fields: personalDetails2TestFields,
    titleName: "Personal details 2 of 3",
  },
  {
    url: "/form/personal-details/3",
    fields: personalDetails3TestFields,
    titleName: "Personal details 3 of 3",
  },
  {
    url: "/form/business-details/1",
    fields: businessDetails1TestFields,
    titleName: "Business details 1 of 3",
  },
  {
    url: "/form/business-details/2",
    fields: businessDetails2TestFields,
    titleName: "Business details 2 of 3",
  },
  {
    url: "/form/business-details/3",
    fields: businessDetails3TestFields,
    titleName: "Business details 3 of 3",
  },
];

export const fillAndDownloadApplication = (
  formPages: Array<{ url: string; fields: TestField[]; titleName: string }>,
) => {
  /**
   * Test one field per page, and one of every type of field. Leaving unit individual-page tests
   * to test that every field within the page is filled under different circumstances
   */
  const legalName = `${firstNameField.expectedValue} ${middleNameField.expectedValue} ${lastNameField.expectedValue}`;
  const expectedFields: Partial<PdfFfsIndividual> = {
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

  // if flagOff don't test legal, else test legal
  cy.visit("/");
  cy.url().should("eq", `${Cypress.config("baseUrl")}/form/welcome`);
  const titleEnding = " | NJ Doula Assistant";
  cy.title().should("eq", "Welcome" + titleEnding);
  cy.contains("Start now").click();

  for (const formPage of formPages) {
    console.log("formPage.url", formPage.url);
    cy.url().should("eq", `${Cypress.config("baseUrl")}${formPage.url}`);
    cy.window().its("scrollY").should("equal", 0); // The page view should be at the top
    cy.title().should("eq", `${formPage.titleName + titleEnding}`);

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
    cy.contains("Next").click();
  }
  cy.url().should("eq", `${Cypress.config("baseUrl")}/form/finish`);

  // Test clicking previous, and prepopulation
  for (const formPage of formPages.reverse()) {
    cy.contains("Previous").click();
    cy.url().should("eq", `${Cypress.config("baseUrl")}${formPage.url}`);
    cy.window().its("scrollY").should("equal", 0);
    cy.title().should("eq", `${formPage.titleName + titleEnding}`);

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

  for (const _ of formPages) {
    cy.contains("Next").click();
  }

  cy.url().should("eq", `${Cypress.config("baseUrl")}/form/finish`);
  cy.title().should("eq", "Finish" + titleEnding);
  cy.contains("Download your application").click();

  cy.readFile(`${Cypress.config("downloadsFolder")}/Fee For Service Application.pdf`, null).then(
    async (file: typeof Cypress.Buffer) => {
      /**
       * Uint8Array wants an ArrayBuffer. The type checker complains that the Buffer type
       * returned by cypress lacks properties like slice, maxByteLength, resizable, resize,
       * and 4 more. I simply could not figure out how to convert
       * https://docs.cypress.io/api/utilities/buffer to an ArrayBuffer.
       *
       * I don't know if I'm typing file incorrectly.
       * https://docs.cypress.io/api/commands/readfile does seem to indicate that the return
       * is indeed Cypress.Buffer However, the codes does run.
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
};
