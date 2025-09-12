import { mapFfsIndividualFields } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import type { PdfFfsIndividualPage5 } from "@/app/form/_utils/fillPdf/ffsIndividual/page5";
import {
  expectNoDuplicateTest,
  testNpiNumber,
  testPhoneNumber,
} from "@/app/form/_utils/fillPdf/testUtils/fillPdf";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { AddressState } from "@/app/form/_utils/inputFields/enums";

describe("Page 5 - authorization agreement for automated deposits of state payments", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage5>([]);

  it("fills telephone number", () => {
    const pdfKey = "fd443telephoneno";
    expectNoDuplicateTest<PdfFfsIndividualPage5>(pdfKey, testedPdfKeys);
    testPhoneNumber(pdfKey);
  });

  it("fills NPI number", () => {
    const pdfKey = "fd443npino";
    expectNoDuplicateTest<PdfFfsIndividualPage5>(pdfKey, testedPdfKeys);
    testNpiNumber(pdfKey);
  });

  it.each([
    {
      description: "pay to address line 1",
      pdfKey: "fd443paytoaddressline1" as const,
      formData: {
        billingStreetAddress1: "123 Main St",
      },
      expected: "123 Main St",
    },
    {
      description: "pay to address line 2",
      pdfKey: "fd443paytoaddressline2" as const,
      formData: {
        billingStreetAddress2: "Apt 2F",
      },
      expected: "Apt 2F",
    },
    {
      description: "pay to address line 3",
      pdfKey: "fd443paytoaddressline3" as const,
      formData: {
        billingCity: "Trenton",
        billingState: AddressState.NJ,
        billingZip: "11111",
      },
      expected: "Trenton, NJ 11111",
    },
  ])("fills in $description", ({ pdfKey, formData, expected }) => {
    expectNoDuplicateTest<PdfFfsIndividualPage5>(pdfKey, testedPdfKeys);
    const pdfFields = mapFfsIndividualFields(generateFormData(formData));
    expect(pdfFields[pdfKey]).toEqual(expected);
  });
});
