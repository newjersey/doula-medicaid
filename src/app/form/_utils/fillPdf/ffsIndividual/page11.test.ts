import type { PdfFfsIndividualPage11 } from "@/app/form/_utils/fillPdf/ffsIndividual/page11";
import { expectNoDuplicateTest, testLegalName } from "@/app/form/_utils/fillPdf/testUtils/fillPdf";

describe("Page 11 - provider agreement", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage11>([]);

  it("fills in provider name", () => {
    const pdfKey = "fd62aprovidername";
    expectNoDuplicateTest<PdfFfsIndividualPage11>(pdfKey, testedPdfKeys);
    testLegalName(pdfKey);
  });
});
