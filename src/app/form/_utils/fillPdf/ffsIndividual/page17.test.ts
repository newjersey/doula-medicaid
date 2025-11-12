import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import { mapFfsIndividualFields } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import type { PdfFfsIndividualPage17 } from "@/app/form/_utils/fillPdf/ffsIndividual/page17";
import {
  expectNoDuplicateTest,
  testLegalName,
  testNpiNumber,
  testPhoneNumber,
  testSocialSecurityNumber,
} from "@/app/form/_utils/fillPdf/testUtils/fillPdf";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { AddressState } from "@/app/form/_utils/inputFields/addressState";

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

  describe("Part I", () => {
    it("checks nature of disclosing entity sole proprietorship", () => {
      const pdfKey = "fd452disclosingentitySole Proprietorship";
      expectNoDuplicateTest<PdfFfsIndividualPage17>(pdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          isSupportedSoleProprietor: true,
        }),
      );
      expect(pdfFields[pdfKey]).toEqual(true);
    });

    it("fills in name of disclosing entity", () => {
      const pdfKey = "fd452nameofdisclosingentity";
      expectNoDuplicateTest<PdfFfsIndividualPage17>(pdfKey, testedPdfKeys);
      testLegalName(pdfKey);
    });

    it("fills in business address", () => {
      const line1Key = "fd452businessstreetline1" as const;
      const line2Key = "fd452businessstreetline2" as const;
      const line3Key = "fd452businessstreetline3" as const;
      const pdfKeys = [line1Key, line2Key, line3Key];
      for (const pdfKey of pdfKeys) {
        expectNoDuplicateTest<PdfFfsIndividualPage17>(pdfKey, testedPdfKeys);
      }

      const testCases = [
        {
          description: "has streetAddress2",
          formData: {
            businessStreetAddress1: "456 Test St",
            businessStreetAddress2: "Suite Test",
            businessCity: "Newark",
            businessState: AddressState.NJ,
            businessZip: "22222",
          },
          expectedLine1Key: "456 Test St",
          expectedLine2Key: "Suite Test",
          expectedLine3Key: "Newark, NJ 22222",
        },
        {
          description: "no streetAddress2",
          formData: {
            businessStreetAddress1: "456 Test St",
            businessStreetAddress2: "",
            businessCity: "Newark",
            businessState: AddressState.NJ,
            businessZip: "22222",
          },
          expectedLine1Key: "456 Test St",
          expectedLine2Key: "Newark, NJ 22222",
          expectedLine3Key: "",
        },
      ];
      for (const testCase of testCases) {
        const pdfFields = mapFfsIndividualFields(generateFormData(testCase.formData));
        expect(pdfFields[line1Key]).toEqual(testCase.expectedLine1Key);
        expect(pdfFields[line2Key]).toEqual(testCase.expectedLine2Key);
        expect(pdfFields[line3Key]).toEqual(testCase.expectedLine3Key);
      }
    });

    it("fills telephone number", () => {
      const pdfKey = "fd452telephonenumber";
      expectNoDuplicateTest<PdfFfsIndividualPage17>(pdfKey, testedPdfKeys);
      testPhoneNumber(pdfKey);
    });

    it("fills provider number and/or NPI", () => {
      const pdfKey = "fd452providernumbandornpi";
      expectNoDuplicateTest<PdfFfsIndividualPage17>(pdfKey, testedPdfKeys);
      testNpiNumber(pdfKey);
    });

    it("fills EIN or other tax ID number", () => {
      const pdfKey = "fd452einorothertaxidnumber";
      expectNoDuplicateTest<PdfFfsIndividualPage17>(pdfKey, testedPdfKeys);
      testSocialSecurityNumber(pdfKey);
    });
  });

  describe("Part II", () => {
    it.each([
      {
        description: "no ownership or 5 percent or more",
        pdfKey: "fd452ownershipoffivepercentormoreno" as const,
      },
      {
        description: "fills in not convicted of a crime",
        pdfKey: "fd452convictedofcrimeno" as const,
      },
    ])("checks $description", ({ pdfKey }) => {
      expectNoDuplicateTest<PdfFfsIndividualPage17>(pdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          isSupportedSoleProprietor: true,
        }),
      );
      expect(pdfFields[pdfKey]).toEqual(true);
    });
  });
});
