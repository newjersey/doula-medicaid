import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 19 - disclosure of ownership and control interest statement
export interface PdfFfsIndividualPage19 {
  fd452significanttransactionsprevious5yearsline1: string;
  fd452significanttransactionsprevious5yearsline2: string;
  fd452significanttransactionsprevious5yearsline3: string;
  fd452significanttransactionsprevious5yearsline4: string;
  fd452significanttransactionsprevious5yearsline5: string;
  fd452affiliatesindividualentitywithaffiliationline1: string;
  fd452affiliatesindividualentitysroleline1: string;
  fd452affiliatesssownershiporcontrolpercentline1: string;
  fd452affiliatesssnortaxidline1: string;
  fd452affiliatesaffiliatedprovidersupplierline1: string;
  fd452affiliatesnpiline1: string;
  fd452affiliatesdobline1: string;
  fd452affiliatesindividualentitywithaffiliationline2: string;
  fd452affiliatesindividualentitysroleline2: string;
  fd452affiliatesssownershiporcontrolpercentline2: string;
  fd452affiliatesssnortaxidline2: string;
  fd452affiliatesaffiliatedprovidersupplierline2: string;
  fd452affiliatesnpiline2: string;
  fd452affiliatesdobline2: string;
  fd452affiliatesindividualentitywithaffiliationline3: string;
  fd452affiliatesindividualentitysroleline3: string;
  fd452affiliatesssownershiporcontrolpercentline3: string;
  fd452affiliatesssnortaxidline3: string;
  fd452affiliatesaffiliatedprovidersupplierline3: string;
  fd452affiliatesnpiline3: string;
  fd452affiliatesdobline3: string;
  fd452affiliatesindividualentitywithaffiliationline4: string;
  fd452affiliatesindividualentitysroleline4: string;
  fd452affiliatesssownershiporcontrolpercentline4: string;
  fd452affiliatesssnortaxidline4: string;
  fd452affiliatesaffiliatedprovidersupplierline4: string;
  fd452affiliatesnpiline4: string;
  fd452affiliatesdobline4: string;
}

export const getPage19Fields = (formData: FormData): Partial<PdfFfsIndividualPage19> => {
  if (formData.isSupportedSoleProprietor === true) {
    return {
      fd452significanttransactionsprevious5yearsline1: "N/A",
      fd452affiliatesaffiliatedprovidersupplierline1: "N/A",
    };
  }
  throw new UnexpectedFormDataError(
    `Expected isSupportedSoleProprietor to be true, is instead ${formData.isSupportedSoleProprietor}.`,
  );
};
