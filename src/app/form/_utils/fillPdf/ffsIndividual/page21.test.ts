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
    {
      description: "no bankruptcy in the last 7 years",
      pdfKey: "fd452filedbankruptcypastsevenyearsno" as const,
    },
    {
      description: "no possibility of filing bankruptcy in the next year",
      pdfKey: "fd452filedbankruptcywithinyearno" as const,
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
});
