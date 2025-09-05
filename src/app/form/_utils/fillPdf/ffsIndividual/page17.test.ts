import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import { mapFfsIndividualFields } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import type { PdfFfsIndividualPage17 } from "@/app/form/_utils/fillPdf/ffsIndividual/page17";
import { expectNoDuplicateTest } from "@/app/form/_utils/fillPdf/testUtils/fillPdf";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";

describe("Page 17 - disclosure of ownership and control interest statement", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage17>([]);
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

  describe("Part II", () => {
    it("fills in no employees", () => {
      const pdfKey = "fd452affliatedprevious12monthsno";
      expectNoDuplicateTest<PdfFfsIndividualPage17>(pdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          isSupportedSoleProprietor: true,
        }),
      );
      expect(pdfFields[pdfKey]).toEqual(true);
    });
  });

  describe("Part III", () => {
    it.each([
      {
        description: "owner relationship",
        pdfKey: "fd452ownerreleationshipline1" as const,
      },
      {
        description: "owner relationship subcontractor",
        pdfKey: "fd452ownerreleationshipsubcontractorline1" as const,
      },
    ])("fills in N/A for $description", ({ pdfKey }) => {
      expectNoDuplicateTest<PdfFfsIndividualPage17>(pdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          isSupportedSoleProprietor: true,
        }),
      );
      expect(pdfFields[pdfKey]).toEqual("N/A");
    });
  });
});
