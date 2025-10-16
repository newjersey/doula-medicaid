import { mapFfsIndividualFields } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import type { PdfFfsIndividualPage13 } from "@/app/form/_utils/fillPdf/ffsIndividual/page13";
import {
  expectNoDuplicateTest,
  testLegalName,
  testNpiNumber,
  testPhoneNumber,
} from "@/app/form/_utils/fillPdf/testUtils/fillPdf";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { AddressState } from "@/app/form/_utils/inputFields/enums";

describe("Page 13 - request for paper updates", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage13>([]);

  it("fills in legal name", () => {
    const pdfKey = "fd455aREQPAPER_Provider Name";
    expectNoDuplicateTest<PdfFfsIndividualPage13>(pdfKey, testedPdfKeys);
    testLegalName(pdfKey);
  });

  it("fills in provider number", () => {
    const pdfKey = "fd455aREQPAPER_Provider Number";
    expectNoDuplicateTest<PdfFfsIndividualPage13>(pdfKey, testedPdfKeys);
    testNpiNumber(pdfKey);
  });

  it("fills in telephone number", () => {
    const pdfKey = "fd455aREQPAPER_Telephone Number";
    expectNoDuplicateTest<PdfFfsIndividualPage13>(pdfKey, testedPdfKeys);
    testPhoneNumber(pdfKey);
  });

  it("fills in mail to address", () => {
    const line1Key = "fd455aREQPAPER_Mail To Address 1" as const;
    const line2Key = "fd455aREQPAPER_Mail To Address 2" as const;
    const line3Key = "fd455aREQPAPER_Mail To Address 3" as const;
    const pdfKeys = [line1Key, line2Key, line3Key];
    for (const pdfKey of pdfKeys) {
      expectNoDuplicateTest<PdfFfsIndividualPage13>(pdfKey, testedPdfKeys);
    }

    const testCases = [
      {
        description: "has streetAddress2",
        formData: {
          streetAddress1: "456 Test St",
          streetAddress2: "Suite Test",
          city: "Newark",
          state: AddressState.NJ,
          zip: "22222",
        },
        expectedLine1Key: "456 Test St",
        expectedLine2Key: "Suite Test",
        expectedLine3Key: "Newark, NJ 22222",
      },
      {
        description: "no streetAddress2",
        formData: {
          streetAddress1: "456 Test St",
          city: "Newark",
          state: AddressState.NJ,
          zip: "22222",
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
