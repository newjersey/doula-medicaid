import type { PdfFfsIndividualPage10 } from "@/app/form/_utils/fillPdf/ffsIndividual/page10";
import { expectNoDuplicateTest, testLegalName } from "@/app/form/_utils/fillPdf/testUtils/fillPdf";

describe("Page 10 - provider agreement", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage10>([]);

  it("fills in provider name", () => {
    const pdfKey = "fd62aprovidername";
    expectNoDuplicateTest<PdfFfsIndividualPage10>(pdfKey, testedPdfKeys);
    testLegalName(pdfKey);
  });
});
