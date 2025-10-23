import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import { mapFfsIndividualFields } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import type { PdfFfsIndividualPage26 } from "@/app/form/_utils/fillPdf/ffsIndividual/page26";
import { expectNoDuplicateTest } from "@/app/form/_utils/fillPdf/testUtils/fillPdf";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";

describe("Page 26 - W-9 Request for Taxpayer Identification Number and Certification", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage26>([]);

  describe("isSupportedSoleProprietor", () => {
    it("throws an UnexpectedFormDataError when isSupportedSoleProprietor is not true", () => {
      const testFunction = () =>
        mapFfsIndividualFields(
          generateFormData({
            isSupportedSoleProprietor: false,
          }),
        );
      expect(testFunction).toThrow(UnexpectedFormDataError);
      expect(testFunction).toThrow(
        "Expected isSupportedSoleProprietor to be true, is instead false",
      );
    });
    it("checks individual or sole proprietor", () => {
      const pdfKey = "W9_IndividualSole proprietor";
      expectNoDuplicateTest<PdfFfsIndividualPage26>(pdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          isSupportedSoleProprietor: true,
        }),
      );
      expect(pdfFields[pdfKey]).toEqual(true);
    });
  });

  it("fills SSN", () => {
    const pdfKeys: Array<keyof PdfFfsIndividualPage26> = [
      "W9_Social security number1",
      "W9_Social security number2",
      "W9_Social security number3",
      "W9_Social security number4",
      "W9_Social security number5",
      "W9_Social security number6",
      "W9_Social security number7",
      "W9_Social security number8",
      "W9_Social security number9",
    ];
    for (const pdfKey of pdfKeys) {
      expectNoDuplicateTest<PdfFfsIndividualPage26>(pdfKey, testedPdfKeys);
    }
    const pdfFields = mapFfsIndividualFields(
      generateFormData({
        socialSecurityNumber: "123-45-6789",
      }),
    );
    expect(pdfFields).toEqual(
      expect.objectContaining({
        "W9_Social security number1": "1",
        "W9_Social security number2": "2",
        "W9_Social security number3": "3",
        "W9_Social security number4": "4",
        "W9_Social security number5": "5",
        "W9_Social security number6": "6",
        "W9_Social security number7": "7",
        "W9_Social security number8": "8",
        "W9_Social security number9": "9",
      }),
    );
  });
});
