import type { PdfFfsIndividualPage29 } from "@/app/form/_utils/fillPdf/ffsIndividual/page29";
import { expectNoDuplicateTest, testName } from "@/app/form/_utils/fillPdf/testUtils/fillPdf";

describe("Page 29 - Agreement of Understanding", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage29>([]);

  it("fills in provider name", () => {
    const pdfKey = "AgreementofUnderstandingprintname";
    expectNoDuplicateTest<PdfFfsIndividualPage29>(pdfKey, testedPdfKeys);
    testName(pdfKey);
  });
});
