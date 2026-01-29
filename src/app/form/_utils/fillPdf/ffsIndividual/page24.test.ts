import { mapFfsIndividualFields } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import type { PdfFfsIndividualPage24 } from "@/app/form/_utils/fillPdf/ffsIndividual/page24";
import { expectNoDuplicateTest, testName } from "@/app/form/_utils/fillPdf/testUtils/fillPdf";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";

describe("Page 24 - CERTIFICATION", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage24>([]);

  it("fills in provider name", () => {
    const pdfKey = "fd452nameofauthorizedrepresentative";
    expectNoDuplicateTest<PdfFfsIndividualPage24>(pdfKey, testedPdfKeys);
    testName(pdfKey);
  });

  it("fills in print name an title", () => {
    const pdfKey = "fd452titleofnameofauthorizedrepresentative";
    expectNoDuplicateTest<PdfFfsIndividualPage24>(pdfKey, testedPdfKeys);
    const pdfFields = mapFfsIndividualFields(generateFormData({}));
    expect(pdfFields[pdfKey]).toEqual("Doula");
  });
});
