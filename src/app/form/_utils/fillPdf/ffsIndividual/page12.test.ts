import { mapFfsIndividualFields } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import type { PdfFfsIndividualPage12 } from "@/app/form/_utils/fillPdf/ffsIndividual/page12";
import {
  expectNoDuplicateTest,
  testLegalName,
  testNpiNumber,
  testPhoneNumber,
} from "@/app/form/_utils/fillPdf/testUtils/fillPdf";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { AddressState } from "@/app/form/_utils/inputFields/enums";

describe("Page 12 - request for paper updates", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage12>([]);

  it("fills in legal name", () => {
    const pdfKey = "fd455aREQPAPER_Provider Name";
    expectNoDuplicateTest<PdfFfsIndividualPage12>(pdfKey, testedPdfKeys);
    testLegalName(pdfKey);
  });

  it("fills in provider number", () => {
    const pdfKey = "fd455aREQPAPER_Provider Number";
    expectNoDuplicateTest<PdfFfsIndividualPage12>(pdfKey, testedPdfKeys);
    testNpiNumber(pdfKey);
  });

  it("fills in telephone number", () => {
    const pdfKey = "fd455aREQPAPER_Telephone Number";
    expectNoDuplicateTest<PdfFfsIndividualPage12>(pdfKey, testedPdfKeys);
    testPhoneNumber(pdfKey);
  });

  it.each([
    {
      description: "mail to address line 1",
      pdfKey: "fd455aREQPAPER_Mail To Address 1" as const,
      formData: {
        streetAddress1: "123 Main St",
      },
      expected: "123 Main St",
    },
    {
      description: "mail to address line 2",
      pdfKey: "fd455aREQPAPER_Mail To Address 2" as const,
      formData: {
        streetAddress2: "Apt 2F",
      },
      expected: "Apt 2F",
    },
    {
      description: "mail to address line 3",
      pdfKey: "fd455aREQPAPER_Mail To Address 3" as const,
      formData: {
        city: "Trenton",
        state: AddressState.NJ,
        zip: "11111",
      },
      expected: "Trenton, NJ 11111",
    },
  ])("fills in $description", ({ pdfKey, formData, expected }) => {
    expectNoDuplicateTest<PdfFfsIndividualPage12>(pdfKey, testedPdfKeys);
    const pdfFields = mapFfsIndividualFields(generateFormData(formData));
    expect(pdfFields[pdfKey]).toEqual(expected);
  });
});
