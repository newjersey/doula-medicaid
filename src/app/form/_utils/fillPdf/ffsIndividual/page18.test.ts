import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import { mapFfsIndividualFields } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import type { PdfFfsIndividualPage18 } from "@/app/form/_utils/fillPdf/ffsIndividual/page18";
import { expectNoDuplicateTest } from "@/app/form/_utils/fillPdf/testUtils/fillPdf";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";

describe("Page 18 - disclosure of ownership and control interest statement", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage18>([]);
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
      description: "other entity with ownership",
      pdfKey: "fd452nameofotherentitywithownershipinteresline1" as const,
    },
    {
      description: "business transactions more than $25,000",
      pdfKey: "fd452businesstransactions25000ormoreline1" as const,
    },
  ])("fills in N/A for $description", ({ pdfKey }) => {
    expectNoDuplicateTest<PdfFfsIndividualPage18>(pdfKey, testedPdfKeys);
    const pdfFields = mapFfsIndividualFields(
      generateFormData({
        isSupportedSoleProprietor: true,
      }),
    );
    expect(pdfFields[pdfKey]).toEqual("N/A");
  });
});
