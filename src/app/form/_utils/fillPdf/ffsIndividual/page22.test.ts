import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import { mapFfsIndividualFields } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import type { PdfFfsIndividualPage22 } from "@/app/form/_utils/fillPdf/ffsIndividual/page22";
import { expectNoDuplicateTest } from "@/app/form/_utils/fillPdf/testUtils/fillPdf";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";

describe("Page 22 - disclosure of ownership and control interest statement", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage22>([]);
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
      description: "no operator or fiscally managed",
      pdfKey: "fd452operatedorfiscallymanagedno" as const,
    },
    {
      description: "no change in managing",
      pdfKey: "fd452changeinmanagingno" as const,
    },
    {
      description: "no subsidiary of a parent company",
      pdfKey: "fd452subsidiaryofparentcompanyno" as const,
    },
    {
      description: "no affiliation with a parent company",
      pdfKey: "fd452affiliatedwithparentcompanyno" as const,
    },
  ])("checks $description", ({ pdfKey }) => {
    expectNoDuplicateTest<PdfFfsIndividualPage22>(pdfKey, testedPdfKeys);
    const pdfFields = mapFfsIndividualFields(
      generateFormData({
        isSupportedSoleProprietor: true,
      }),
    );
    expect(pdfFields[pdfKey]).toEqual(true);
  });
});
