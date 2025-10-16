import type { PdfFfsIndividualPage5 } from "@/app/form/_utils/fillPdf/ffsIndividual/page5";
import {
  expectNoDuplicateTest,
  testLegalName,
  testNpiNumber,
} from "@/app/form/_utils/fillPdf/testUtils/fillPdf";

describe("Page 5 - signature authorization form", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage5>([]);

  it("fills in provider name", () => {
    const pdfKey = "fd444Providername";
    expectNoDuplicateTest<PdfFfsIndividualPage5>(pdfKey, testedPdfKeys);
    testLegalName(pdfKey);
  });

  it("fills in NPI number", () => {
    const pdfKey = "fd444providerNPINumber";
    expectNoDuplicateTest<PdfFfsIndividualPage5>(pdfKey, testedPdfKeys);
    testNpiNumber(pdfKey);
  });
});
