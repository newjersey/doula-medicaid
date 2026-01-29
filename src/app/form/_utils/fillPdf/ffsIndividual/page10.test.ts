import { mapFfsIndividualFields } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import type { PdfFfsIndividualPage10 } from "@/app/form/_utils/fillPdf/ffsIndividual/page10";
import { expectNoDuplicateTest } from "@/app/form/_utils/fillPdf/testUtils/fillPdf";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";

describe("Page 10 - PROVIDER CERTIFICATION", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage10>([]);
  it("fills in print name without the middle name", () => {
    const pdfKey = "fd429printnameandtitle";
    expectNoDuplicateTest<PdfFfsIndividualPage10>(pdfKey, testedPdfKeys);
    const pdfFieldsWithMiddleName = mapFfsIndividualFields(
      generateFormData({
        firstName: "First",
        middleName: "Middle",
        lastName: "Last",
      }),
    );
    expect(pdfFieldsWithMiddleName[pdfKey]).toEqual("First Last, Doula");

    const pdfFieldsWithoutMiddleName = mapFfsIndividualFields(
      generateFormData({
        firstName: "First",
        lastName: "Last",
      }),
    );
    expect(pdfFieldsWithoutMiddleName[pdfKey]).toEqual("First Last, Doula");
  });
});
