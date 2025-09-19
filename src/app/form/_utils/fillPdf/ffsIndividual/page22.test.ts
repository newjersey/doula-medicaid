import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import { mapFfsIndividualFields } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import type { PdfFfsIndividualPage22 } from "@/app/form/_utils/fillPdf/ffsIndividual/page22";
import { expectNoDuplicateTest } from "@/app/form/_utils/fillPdf/testUtils/fillPdf";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";

describe("Page 22 - disclosure of ownership and control interest statement", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage22>([]);
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

  it("checks no bed capacity increase", () => {
    const pdfKey = "fd452increasedbedcapacityno";
    expectNoDuplicateTest<PdfFfsIndividualPage22>(pdfKey, testedPdfKeys);
    const pdfFields = mapFfsIndividualFields(
      generateFormData({
        isSupportedSoleProprietor: true,
      }),
    );
    expect(pdfFields[pdfKey]).toEqual(true);
  });

  describe("hasDisclosableEvent", () => {
    it("checks the No checkbox when formData.hasDisclosableEvent is false", () => {
      const pdfKey = "fd452disclosableeventno";
      expectNoDuplicateTest<PdfFfsIndividualPage22>(pdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          hasDisclosableEvent: false,
        }),
      );
      expect(pdfFields[pdfKey]).toEqual(true);
    });

    it("checks the Yes checkbox when formData.hasDisclosableEvent is true", () => {
      const pdfKey = "fd452disclosableeventyyes";
      expectNoDuplicateTest<PdfFfsIndividualPage22>(pdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          hasDisclosableEvent: true,
        }),
      );
      expect(pdfFields[pdfKey]).toEqual(true);
    });
  });
});
