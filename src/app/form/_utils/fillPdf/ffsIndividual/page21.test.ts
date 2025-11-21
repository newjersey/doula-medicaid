import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import { mapFfsIndividualFields } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import type { PdfFfsIndividualPage21 } from "@/app/form/_utils/fillPdf/ffsIndividual/page21";
import { expectNoDuplicateTest } from "@/app/form/_utils/fillPdf/testUtils/fillPdf";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";

describe("Page 21 - disclosure of ownership and control interest statement", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage21>([]);
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

  it.each([
    {
      description: "no participating provider ownership",
      pdfKey: "fd452ownershiphealthcareproviderno" as const,
    },
    {
      description: "no ownership change",
      pdfKey: "fd452ownershipchangeno" as const,
    },
    {
      description: "no ownership change within the next year",
      pdfKey: "fd452ownershipchangewithinyearno" as const,
    },
  ])("checks $description", ({ pdfKey }) => {
    expectNoDuplicateTest<PdfFfsIndividualPage21>(pdfKey, testedPdfKeys);
    const pdfFields = mapFfsIndividualFields(
      generateFormData({
        isSupportedSoleProprietor: true,
      }),
    );
    expect(pdfFields[pdfKey]).toEqual(true);
  });

  describe("Filed for bankruptcy in the past 7 years", () => {
    it("throws an UnexpectedFormDataError when hasFiledBankruptcy is true but pastBankruptcyDate is null", () => {
      const testFunction = () =>
        mapFfsIndividualFields(
          generateFormData({
            hasFiledBankruptcy: true,
            pastBankruptcyDate: null,
          }),
        );
      expect(testFunction).toThrow(UnexpectedFormDataError);
      expect(testFunction).toThrow("hasFiledBankruptcy true, but pastBankruptcyDate is null.");
    });

    it("checks the No checkbox when formData.hasFiledBankruptcy is false", () => {
      const yesPdfKey = "fd452filedbankruptcypastsevenyearsyes";
      const noPdfKey = "fd452filedbankruptcypastsevenyearsno";
      const datePdfKey = "fd452filedbankruptcypastsevenyearsdate";
      expectNoDuplicateTest<PdfFfsIndividualPage21>(noPdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          hasFiledBankruptcy: false,
        }),
      );
      expect(pdfFields[noPdfKey]).toEqual(true);
      expect(pdfFields[yesPdfKey]).toEqual(undefined);
      expect(pdfFields[datePdfKey]).toEqual(undefined);
    });

    it("checks the Yes checkbox and fills in the date when formData.hasFiledBankruptcy is true", () => {
      const yesPdfKey = "fd452filedbankruptcypastsevenyearsyes";
      const noPdfKey = "fd452filedbankruptcypastsevenyearsno";
      const datePdfKey = "fd452filedbankruptcypastsevenyearsdate";
      expectNoDuplicateTest<PdfFfsIndividualPage21>(yesPdfKey, testedPdfKeys);
      expectNoDuplicateTest<PdfFfsIndividualPage21>(datePdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          hasFiledBankruptcy: true,
          pastBankruptcyDate: new Date("1/2/2024"),
        }),
      );
      expect(pdfFields[yesPdfKey]).toEqual(true);
      expect(pdfFields[noPdfKey]).toEqual(undefined);
      expect(pdfFields[datePdfKey]).toEqual("01/02/2024");
    });
  });

  describe("Possibility of filing for bankruptcy in the next year", () => {
    it("throws an UnexpectedFormDataError when mightFileBankruptcy is true but futureBankruptcyDate is null", () => {
      const testFunction = () =>
        mapFfsIndividualFields(
          generateFormData({
            mightFileBankruptcy: true,
            futureBankruptcyDate: null,
          }),
        );
      expect(testFunction).toThrow(UnexpectedFormDataError);
      expect(testFunction).toThrow("mightFileBankruptcy true, but futureBankruptcyDate is null.");
    });

    it("checks the No checkbox when formData.mightFileBankruptcy is false", () => {
      const yesPdfKey = "fd452filedbankruptcywithinyearyes";
      const noPdfKey = "fd452filedbankruptcywithinyearno";
      const datePdfKey = "fd452filedbankruptcywithinyeardate";
      expectNoDuplicateTest<PdfFfsIndividualPage21>(noPdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          mightFileBankruptcy: false,
        }),
      );
      expect(pdfFields[noPdfKey]).toEqual(true);
      expect(pdfFields[yesPdfKey]).toEqual(undefined);
      expect(pdfFields[datePdfKey]).toEqual(undefined);
    });

    it("checks the Yes checkbox and fills in the date when formData.mightFileBankruptcy is true", () => {
      const yesPdfKey = "fd452filedbankruptcywithinyearyes";
      const noPdfKey = "fd452filedbankruptcywithinyearno";
      const datePdfKey = "fd452filedbankruptcywithinyeardate";
      expectNoDuplicateTest<PdfFfsIndividualPage21>(yesPdfKey, testedPdfKeys);
      expectNoDuplicateTest<PdfFfsIndividualPage21>(datePdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          mightFileBankruptcy: true,
          futureBankruptcyDate: new Date("1/2/2026"),
        }),
      );
      expect(pdfFields[yesPdfKey]).toEqual(true);
      expect(pdfFields[noPdfKey]).toEqual(undefined);
      expect(pdfFields[datePdfKey]).toEqual("01/02/2026");
    });
  });
});
