import type { PdfFfsIndividualPage4 } from "@/app/form/_utils/fillPdf/ffsIndividual/page4";
import {
  expectNoDuplicateTest,
  testLegalName,
  testNpiNumber,
} from "@/app/form/_utils/fillPdf/testUtils/fillPdf";

describe("Page 4 - signature authorization form", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage4>([]);

  it("fills in provider name", () => {
    const pdfKey = "fd444Providername";
    expectNoDuplicateTest<PdfFfsIndividualPage4>(pdfKey, testedPdfKeys);
    testLegalName(pdfKey);
  });

  it("fills in NPI number", () => {
    const pdfKey = "fd444providerNPINumber";
    expectNoDuplicateTest<PdfFfsIndividualPage4>(pdfKey, testedPdfKeys);
    testNpiNumber(pdfKey);
  });
});
