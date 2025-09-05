import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import { mapFfsIndividualFields } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import type { PdfFfsIndividualPage25 } from "@/app/form/_utils/fillPdf/ffsIndividual/page25";
import { expectNoDuplicateTest } from "@/app/form/_utils/fillPdf/testUtils/fillPdf";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";

describe("Page 25 - W-9 Request for Taxpayer Identification Number and Certification", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage25>([]);
  it("throws an UnexpectedFormDataError when isSupportedSoleProprietor is not true", () => {
    const testFunction = () =>
      mapFfsIndividualFields(
        generateFormData({
          isSupportedSoleProprietor: false,
        }),
      );
    expect(testFunction).toThrow(UnexpectedFormDataError);
    expect(testFunction).toThrow("Expected isSupportedSoleProprietor to be true, is instead false");
  });

  it("checks individual or sole proprietor", () => {
    const pdfKey = "W9_IndividualSole proprietor";
    expectNoDuplicateTest<PdfFfsIndividualPage25>(pdfKey, testedPdfKeys);
    const pdfFields = mapFfsIndividualFields(
      generateFormData({
        isSupportedSoleProprietor: true,
      }),
    );
    expect(pdfFields[pdfKey]).toEqual(true);
  });
});
