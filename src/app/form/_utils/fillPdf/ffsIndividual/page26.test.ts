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

  describe("hasEin", () => {
    it("throws an UnexpectedFormDataError if hasEin is true but EIN is null", () => {
      const testFunction = () =>
        mapFfsIndividualFields(
          generateFormData({ hasEin: true, ein: null, socialSecurityNumber: "555-55-5555" }),
        );
      expect(testFunction).toThrow(UnexpectedFormDataError);
      expect(testFunction).toThrow("hasEin is true but ein is null");
    });

    it("fills EIN if hasEin is true", () => {
      const pdfKeys: Array<keyof PdfFfsIndividualPage26> = [
        "W9_EIN1",
        "W9_EIN2",
        "W9_EIN3",
        "W9_EIN4",
        "W9_EIN5",
        "W9_EIN6",
        "W9_EIN7",
        "W9_EIN8",
        "W9_EIN9",
      ];
      for (const pdfKey of pdfKeys) {
        expectNoDuplicateTest<PdfFfsIndividualPage26>(pdfKey, testedPdfKeys);
      }
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          hasEin: true,
          ein: "12-3456789",
          socialSecurityNumber: "555-55-5555",
        }),
      );
      expect(pdfFields).toEqual(
        expect.objectContaining({
          W9_EIN1: "1",
          W9_EIN2: "2",
          W9_EIN3: "3",
          W9_EIN4: "4",
          W9_EIN5: "5",
          W9_EIN6: "6",
          W9_EIN7: "7",
          W9_EIN8: "8",
          W9_EIN9: "9",
        }),
      );
    });

    it("fills SSN if hasEin is false", () => {
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
          hasEin: false,
          ein: "11-1111111",
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
});
