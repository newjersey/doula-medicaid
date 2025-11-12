import { mapFfsIndividualFields } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import type { PdfFfsIndividualPage6 } from "@/app/form/_utils/fillPdf/ffsIndividual/page6";
import {
  expectNoDuplicateTest,
  testNpiNumber,
  testPhoneNumber,
} from "@/app/form/_utils/fillPdf/testUtils/fillPdf";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { AddressState } from "@/app/form/_utils/inputFields/addressState";

describe("Page 6 - authorization agreement for automated deposits of state payments", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage6>([]);

  it("fills telephone number", () => {
    const pdfKey = "fd443telephoneno";
    expectNoDuplicateTest<PdfFfsIndividualPage6>(pdfKey, testedPdfKeys);
    testPhoneNumber(pdfKey);
  });

  it("fills NPI number", () => {
    const pdfKey = "fd443npino";
    expectNoDuplicateTest<PdfFfsIndividualPage6>(pdfKey, testedPdfKeys);
    testNpiNumber(pdfKey);
  });

  it("fills in pay to address", () => {
    const line1Key = "fd443paytoaddressline1" as const;
    const line2Key = "fd443paytoaddressline2" as const;
    const line3Key = "fd443paytoaddressline3" as const;
    const pdfKeys = [line1Key, line2Key, line3Key];
    for (const pdfKey of pdfKeys) {
      expectNoDuplicateTest<PdfFfsIndividualPage6>(pdfKey, testedPdfKeys);
    }

    const testCases = [
      {
        description: "has streetAddress2",
        formData: {
          billingStreetAddress1: "456 Test St",
          billingStreetAddress2: "Suite Test",
          billingCity: "Newark",
          billingState: AddressState.NJ,
          billingZip: "22222",
        },
        expectedLine1Key: "456 Test St",
        expectedLine2Key: "Suite Test",
        expectedLine3Key: "Newark, NJ 22222",
      },
      {
        description: "no streetAddress2",
        formData: {
          billingStreetAddress1: "456 Test St",
          billingStreetAddress2: "",
          billingCity: "Newark",
          billingState: AddressState.NJ,
          billingZip: "22222",
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
});
