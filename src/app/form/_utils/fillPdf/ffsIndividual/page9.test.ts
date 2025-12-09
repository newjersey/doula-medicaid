import { mapFfsIndividualFields } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import type { PdfFfsIndividualPage9 } from "@/app/form/_utils/fillPdf/ffsIndividual/page9";
import { expectNoDuplicateTest } from "@/app/form/_utils/fillPdf/testUtils/fillPdf";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";

describe("Page 9 - SECTION II – PROVIDER IDENTIFICATION", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage9>([]);

  describe("2. past or pending license suspension, revocation, or adverse action", () => {
    it("checks the No checkbox when formData.hadLicenseSuspended is false", () => {
      const yesPdfKey = "fd425licensesuspensionyes";
      const noPdfKey = "fd425licensesuspensionno";
      const explanationPdfKey = "fd425licensesuspensionyesexplaination";
      expectNoDuplicateTest<PdfFfsIndividualPage9>(noPdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          hadLicenseSuspended: false,
        }),
      );
      expect(pdfFields[noPdfKey]).toEqual(true);
      expect(pdfFields[yesPdfKey]).toEqual(undefined);
      expect(pdfFields[explanationPdfKey]).toEqual(undefined);
    });

    it("checks the Yes checkbox and fills in the explanation when formData.hadLicenseSuspended is true", () => {
      const yesPdfKey = "fd425licensesuspensionyes";
      const noPdfKey = "fd425licensesuspensionno";
      const explanationPdfKey = "fd425licensesuspensionyesexplaination";
      expectNoDuplicateTest<PdfFfsIndividualPage9>(yesPdfKey, testedPdfKeys);
      expectNoDuplicateTest<PdfFfsIndividualPage9>(explanationPdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          hadLicenseSuspended: true,
          licenseSuspendedExplanation: "Brief explanation of crime charge",
        }),
      );
      expect(pdfFields[yesPdfKey]).toEqual(true);
      expect(pdfFields[noPdfKey]).toEqual(undefined);
      expect(pdfFields[explanationPdfKey]).toEqual("Brief explanation of crime charge");
    });
  });

  describe("3. inducted, charged, or convicted of a crime", () => {
    it("checks the No checkbox when formData.hasCrimeCharge is false", () => {
      const yesPdfKey = "fd425indictedyes";
      const noPdfKey = "fd425indictedno";
      const explanationPdfKey = "fd425indictedyesexplaination";
      expectNoDuplicateTest<PdfFfsIndividualPage9>(noPdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          hasCrimeCharge: false,
        }),
      );
      expect(pdfFields[noPdfKey]).toEqual(true);
      expect(pdfFields[yesPdfKey]).toEqual(undefined);
      expect(pdfFields[explanationPdfKey]).toEqual(undefined);
    });

    it("checks the Yes checkbox and fills in the explanation when formData.hasCrimeCharge is true", () => {
      const yesPdfKey = "fd425indictedyes";
      const noPdfKey = "fd425indictedno";
      const explanationPdfKey = "fd425indictedyesexplaination";
      expectNoDuplicateTest<PdfFfsIndividualPage9>(yesPdfKey, testedPdfKeys);
      expectNoDuplicateTest<PdfFfsIndividualPage9>(explanationPdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          hasCrimeCharge: true,
          crimeChargeExplanation: "Brief explanation of crime charge",
        }),
      );
      expect(pdfFields[yesPdfKey]).toEqual(true);
      expect(pdfFields[noPdfKey]).toEqual(undefined);
      expect(pdfFields[explanationPdfKey]).toEqual("Brief explanation of crime charge");
    });
  });
});
