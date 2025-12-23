import { mapFfsIndividualFields } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import type { PdfFfsIndividualPage9 } from "@/app/form/_utils/fillPdf/ffsIndividual/page9";
import { expectNoDuplicateTest } from "@/app/form/_utils/fillPdf/testUtils/fillPdf";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";

describe("Page 9 - SECTION II – PROVIDER IDENTIFICATION", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage9>([]);

  describe("when NEXT_PUBLIC_FLAG_LEGAL is not set", () => {
    it("does not fill 1. approved as a provider of services under Medicaid", () => {
      const yesPdfKey = "fd425approvedprovideryes";
      const noPdfKey = "fd425approvedproviderno";
      const explanationPdfKey = "fd425approvedprovideryesexplaination";
      const pdfFields = mapFfsIndividualFields(generateFormData({}));
      expect(pdfFields[noPdfKey]).toEqual(undefined);
      expect(pdfFields[yesPdfKey]).toEqual(undefined);
      expect(pdfFields[explanationPdfKey]).toEqual(undefined);
    });

    it("does not fill 2. past or pending license suspension, revocation, or adverse action", () => {
      const yesPdfKey = "fd425licensesuspensionyes";
      const noPdfKey = "fd425licensesuspensionno";
      const explanationPdfKey = "fd425licensesuspensionyesexplaination";
      const pdfFields = mapFfsIndividualFields(generateFormData({}));
      expect(pdfFields[noPdfKey]).toEqual(undefined);
      expect(pdfFields[yesPdfKey]).toEqual(undefined);
      expect(pdfFields[explanationPdfKey]).toEqual(undefined);
    });

    it("it does not fill 3. inducted, charged, or convicted of a crime", () => {
      const yesPdfKey = "fd425indictedyes";
      const noPdfKey = "fd425indictedno";
      const explanationPdfKey = "fd425indictedyesexplaination";
      const pdfFields = mapFfsIndividualFields(generateFormData({}));
      expect(pdfFields[noPdfKey]).toEqual(undefined);
      expect(pdfFields[yesPdfKey]).toEqual(undefined);
      expect(pdfFields[explanationPdfKey]).toEqual(undefined);
    });

    it("does not fill 4. past or pending suspensions, debarments, disqualifications, etc. from health program", () => {
      const yesPdfKey = "fd425programsuspensionsyes";
      const noPdfKey = "fd425programsuspensionsno";
      const explanationPdfKey = "fd425programsuspensionsyesexplaination";
      const pdfFields = mapFfsIndividualFields(generateFormData({}));
      expect(pdfFields[noPdfKey]).toEqual(undefined);
      expect(pdfFields[yesPdfKey]).toEqual(undefined);
      expect(pdfFields[explanationPdfKey]).toEqual(undefined);
    });

    it("it does not fill 5. owned, interest, or relationship with company providing services to health program", () => {
      const yesPdfKey = "fd425partnershipyes";
      const noPdfKey = "fd425partnershipno";
      const explanationPdfKey = "fd425partnershipyesexplaination";
      const pdfFields = mapFfsIndividualFields(generateFormData({}));
      expect(pdfFields[noPdfKey]).toEqual(undefined);
      expect(pdfFields[yesPdfKey]).toEqual(undefined);
      expect(pdfFields[explanationPdfKey]).toEqual(undefined);
    });

    it("it does not fill 6. employed by the State of New Jersey", () => {
      const yesPdfKey = "fd425employedbystateofnjyes";
      const noPdfKey = "fd425employedbystateofnjno";
      const explanationPdfKey = "fd425employedbystateofnjyesexplaination";
      const pdfFields = mapFfsIndividualFields(generateFormData({}));
      expect(pdfFields[noPdfKey]).toEqual(undefined);
      expect(pdfFields[yesPdfKey]).toEqual(undefined);
      expect(pdfFields[explanationPdfKey]).toEqual(undefined);
    });
  });

  describe('when NEXT_PUBLIC_FLAG_LEGAL is "1"', () => {
    const oldProcessEnv = process.env;
    beforeEach(() => {
      jest.resetModules();
      process.env = { ...oldProcessEnv, NEXT_PUBLIC_FLAG_LEGAL: "1" };
    });
    afterAll(() => {
      process.env = oldProcessEnv;
    });

    describe("1. approved as a provider of services under Medicaid", () => {
      it("checks the No checkbox when formData.hasProvidedMedicaidServices is false", () => {
        const yesPdfKey = "fd425approvedprovideryes";
        const noPdfKey = "fd425approvedproviderno";
        const explanationPdfKey = "fd425approvedprovideryesexplaination";
        expectNoDuplicateTest<PdfFfsIndividualPage9>(noPdfKey, testedPdfKeys);
        const pdfFields = mapFfsIndividualFields(
          generateFormData({
            hasProvidedMedicaidServices: false,
          }),
        );
        expect(pdfFields[noPdfKey]).toEqual(true);
        expect(pdfFields[yesPdfKey]).toEqual(undefined);
        expect(pdfFields[explanationPdfKey]).toEqual(undefined);
      });

      it("checks the Yes checkbox and fills in the explanation when formData.hasProvidedMedicaidServices is true", () => {
        const yesPdfKey = "fd425approvedprovideryes";
        const noPdfKey = "fd425approvedproviderno";
        const explanationPdfKey = "fd425approvedprovideryesexplaination";
        expectNoDuplicateTest<PdfFfsIndividualPage9>(yesPdfKey, testedPdfKeys);
        expectNoDuplicateTest<PdfFfsIndividualPage9>(explanationPdfKey, testedPdfKeys);
        const pdfFields = mapFfsIndividualFields(
          generateFormData({
            hasProvidedMedicaidServices: true,
            medicaidProviderExplanation: "Brief explanation of crime charge",
          }),
        );
        expect(pdfFields[yesPdfKey]).toEqual(true);
        expect(pdfFields[noPdfKey]).toEqual(undefined);
        expect(pdfFields[explanationPdfKey]).toEqual("Brief explanation of crime charge");
      });
    });

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

    describe("4. past or pending suspensions, debarments, disqualifications, etc. from health program", () => {
      it("checks the No checkbox when formData.hasDisqualification is false", () => {
        const yesPdfKey = "fd425programsuspensionsyes";
        const noPdfKey = "fd425programsuspensionsno";
        const explanationPdfKey = "fd425programsuspensionsyesexplaination";
        expectNoDuplicateTest<PdfFfsIndividualPage9>(noPdfKey, testedPdfKeys);
        const pdfFields = mapFfsIndividualFields(
          generateFormData({
            hasDisqualification: false,
          }),
        );
        expect(pdfFields[noPdfKey]).toEqual(true);
        expect(pdfFields[yesPdfKey]).toEqual(undefined);
        expect(pdfFields[explanationPdfKey]).toEqual(undefined);
      });

      it("checks the Yes checkbox and fills in the explanation when formData.hasDisqualification is true", () => {
        const yesPdfKey = "fd425programsuspensionsyes";
        const noPdfKey = "fd425programsuspensionsno";
        const explanationPdfKey = "fd425programsuspensionsyesexplaination";
        expectNoDuplicateTest<PdfFfsIndividualPage9>(yesPdfKey, testedPdfKeys);
        expectNoDuplicateTest<PdfFfsIndividualPage9>(explanationPdfKey, testedPdfKeys);
        const pdfFields = mapFfsIndividualFields(
          generateFormData({
            hasDisqualification: true,
            disqualificationExplanation: "Brief explanation of disqualification",
          }),
        );
        expect(pdfFields[yesPdfKey]).toEqual(true);
        expect(pdfFields[noPdfKey]).toEqual(undefined);
        expect(pdfFields[explanationPdfKey]).toEqual("Brief explanation of disqualification");
      });
    });

    describe("5. owned, interest, or relationship with company providing services to health program", () => {
      it("checks the No checkbox when formData.hasCompanyInvolvement is false", () => {
        const yesPdfKey = "fd425partnershipyes";
        const noPdfKey = "fd425partnershipno";
        const explanationPdfKey = "fd425partnershipyesexplaination";
        expectNoDuplicateTest<PdfFfsIndividualPage9>(noPdfKey, testedPdfKeys);
        const pdfFields = mapFfsIndividualFields(
          generateFormData({
            hasCompanyInvolvement: false,
          }),
        );
        expect(pdfFields[noPdfKey]).toEqual(true);
        expect(pdfFields[yesPdfKey]).toEqual(undefined);
        expect(pdfFields[explanationPdfKey]).toEqual(undefined);
      });

      it("checks the Yes checkbox and fills in the explanation when formData.hasCompanyInvolvement is true", () => {
        const yesPdfKey = "fd425partnershipyes";
        const noPdfKey = "fd425partnershipno";
        const explanationPdfKey = "fd425partnershipyesexplaination";
        expectNoDuplicateTest<PdfFfsIndividualPage9>(yesPdfKey, testedPdfKeys);
        expectNoDuplicateTest<PdfFfsIndividualPage9>(explanationPdfKey, testedPdfKeys);
        const pdfFields = mapFfsIndividualFields(
          generateFormData({
            hasCompanyInvolvement: true,
            companyInvolvementExplanation: "Brief explanation of company involvement",
          }),
        );
        expect(pdfFields[yesPdfKey]).toEqual(true);
        expect(pdfFields[noPdfKey]).toEqual(undefined);
        expect(pdfFields[explanationPdfKey]).toEqual("Brief explanation of company involvement");
      });
    });

    describe("employed by the State of New Jersey", () => {
      it("checks the No checkbox when formData.isEmployedByNj is false", () => {
        const yesPdfKey = "fd425employedbystateofnjyes";
        const noPdfKey = "fd425employedbystateofnjno";
        const explanationPdfKey = "fd425employedbystateofnjyesexplaination";
        expectNoDuplicateTest<PdfFfsIndividualPage9>(noPdfKey, testedPdfKeys);
        const pdfFields = mapFfsIndividualFields(
          generateFormData({
            isEmployedByNj: false,
          }),
        );
        expect(pdfFields[noPdfKey]).toEqual(true);
        expect(pdfFields[yesPdfKey]).toEqual(undefined);
        expect(pdfFields[explanationPdfKey]).toEqual(undefined);
      });

      it("checks the Yes checkbox and fills in the explanation when formData.isEmployedByNj is true", () => {
        const yesPdfKey = "fd425employedbystateofnjyes";
        const noPdfKey = "fd425employedbystateofnjno";
        const explanationPdfKey = "fd425employedbystateofnjyesexplaination";
        expectNoDuplicateTest<PdfFfsIndividualPage9>(yesPdfKey, testedPdfKeys);
        expectNoDuplicateTest<PdfFfsIndividualPage9>(explanationPdfKey, testedPdfKeys);
        const pdfFields = mapFfsIndividualFields(
          generateFormData({
            isEmployedByNj: true,
            employedByNjExplanation: "Brief explanation of company involvement",
          }),
        );
        expect(pdfFields[yesPdfKey]).toEqual(true);
        expect(pdfFields[noPdfKey]).toEqual(undefined);
        expect(pdfFields[explanationPdfKey]).toEqual("Brief explanation of company involvement");
      });
    });
  });
});
