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

export const formPages = [
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
export const expectedFields: Partial<PdfFfsIndividual> = {
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

// import * as pdfjsLib from "pdfjs-dist";

const coverPageText = "This is your pre-filled Medicaid Fee-for-Service application";

it("should fill and download the application", () => {
  fillAndDownloadApplication(formPages, expectedFields);
});

export const fillAndDownloadApplication = (
  formPages: Array<{ url: string; fields: TestField[]; titleName: string }>,
  expectedFields: Partial<PdfFfsIndividual>,
) => {
  /**
   * Test one field per page, and one of every type of field. Leaving unit individual-page tests to
   * test that every field within the page is filled under different circumstances
   */

  cy.visit(`${Cypress.config("baseUrl")}/form/review`);

  cy.url().should("eq", `${Cypress.config("baseUrl")}/form/review`);
  cy.contains("Download your application").click();
  const pdfFilePath = `${Cypress.config("downloadsFolder")}/Fee For Service Application.pdf`;

  cy.readFile(pdfFilePath, null).then(async (file: typeof Cypress.Buffer) => {
    // new stuff
    // pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    // pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    // pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    //   "pdfjs-dist/build/pdf.worker.min.mjs",
    //   import.meta.url,
    // ).toString();
    // // pdfjsLib.GlobalWorkerOptions.workerSrc = "pdf.worker.js";
    // const pdf = await pdfjsLib.getDocument(pdfFilePath).promise;
    // throw new Error(`test ${pdf}`);
    // const page1 = await pdf.getPage(1);
    // const page1TextItems = await page1.getTextContent();
    // const page1Text = page1TextItems.items
    //   .map(function (s) {
    //     return s.toString();
    //   })
    //   .join("");

    // throw new Error(page1Text);

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
