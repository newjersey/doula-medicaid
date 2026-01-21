import { path1TestFields as business1TestFields } from "@/app/form/(formSteps)/business/1/testFields";
import { testFields as business2TestFields } from "@/app/form/(formSteps)/business/2/testFields";
import { testFields as business3TestFields } from "@/app/form/(formSteps)/business/3/testFields";
import { path1TestFields as business4TestFields } from "@/app/form/(formSteps)/business/4/testFields";
import { testFields as insurance1TestFields } from "@/app/form/(formSteps)/insurance/1/testFields";
import { testFields as insurance2TestFields } from "@/app/form/(formSteps)/insurance/2/testFields";
import { path1TestFields as legal1TestFields } from "@/app/form/(formSteps)/legal/1/testFields";
import { path1TestFields as legal2TestFields } from "@/app/form/(formSteps)/legal/2/testFields";
import { path1TestFields as legal3TestFields } from "@/app/form/(formSteps)/legal/3/testFields";
import { testFields as personal1TestFields } from "@/app/form/(formSteps)/personal/1/testFields";
import { minimalTestFields as personal2TestFields } from "@/app/form/(formSteps)/personal/2/testFields";
import { testFields as personal3TestFields } from "@/app/form/(formSteps)/personal/3/testFields";
import { path1TestFields as personal4TestFields } from "@/app/form/(formSteps)/personal/4/testFields";
import { testFields as screening1TestFields } from "@/app/form/(formSteps)/screening/1/testFields";
import { testFields as screening2TestFields } from "@/app/form/(formSteps)/screening/2/testFields";
import { testFields as screening3TestFields } from "@/app/form/(formSteps)/screening/3/testFields";
import { path1TestFields as training1TestFields } from "@/app/form/(formSteps)/training/1/testFields";
import type { TestField } from "@/app/form/_utils/testUtils/testFields";

export const DOWNLOAD_FILE_NAME = "Fee For Service Application.pdf";

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

export const testFillApplication = (
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
      cy.contains("button", "Review", { timeout: 8000 }).click();
    }
  }
  cy.url().should("eq", `${Cypress.config("baseUrl")}/form/review`);
  cy.title().should("eq", `Review ${titleEnding}`);
};
