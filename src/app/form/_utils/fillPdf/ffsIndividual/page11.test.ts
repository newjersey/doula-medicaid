import type { PdfFfsIndividualPage11 } from "@/app/form/_utils/fillPdf/ffsIndividual/page11";
import {
  expectNoDuplicateTest,
  testName,
  testNameAndDoulaTitle,
} from "@/app/form/_utils/fillPdf/testUtils/fillPdf";

describe("Page 11 - provider agreement", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage11>([]);

  it("fills in provider name", () => {
    const pdfKey = "fd62aprovidername";
    expectNoDuplicateTest<PdfFfsIndividualPage11>(pdfKey, testedPdfKeys);
    testName(pdfKey);
  });

  it("fills in print name an title", () => {
    const pdfKey = "fd62aPrintNameTitle";
    expectNoDuplicateTest<PdfFfsIndividualPage11>(pdfKey, testedPdfKeys);
    testNameAndDoulaTitle(pdfKey);
  });
});
