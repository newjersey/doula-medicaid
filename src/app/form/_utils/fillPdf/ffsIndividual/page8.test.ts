import { mapFfsIndividualFields } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import type { PdfFfsIndividualPage8 } from "@/app/form/_utils/fillPdf/ffsIndividual/page8";
import {
  expectNoDuplicateTest,
  testDateOfBirth,
  testLegalName,
  testNpiNumber,
  testPhoneNumber,
  testSocialSecurityNumber,
} from "@/app/form/_utils/fillPdf/testUtils/fillPdf";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { AddressState } from "@/app/form/_utils/inputFields/addressState";

describe("Page 8 - individual doula provider application section I provider identification", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage8>([]);

  it("fills in legal name", () => {
    const pdfKey = "fd425legalname";
    expectNoDuplicateTest<PdfFfsIndividualPage8>(pdfKey, testedPdfKeys);
    testLegalName(pdfKey);
  });

  it("fills in Social Security Number", () => {
    const pdfKey = "fd425socialsecuritynumber";
    expectNoDuplicateTest<PdfFfsIndividualPage8>(pdfKey, testedPdfKeys);
    testSocialSecurityNumber(pdfKey);
  });

  it("fills in DOB", () => {
    const pdfKey = "fd452dobfdate_af_date";
    expectNoDuplicateTest<PdfFfsIndividualPage8>(pdfKey, testedPdfKeys);
    testDateOfBirth(pdfKey);
  });

  it("fills in Medicare provider no.", () => {
    const pdfKey = "fd452medicareprovnumber";
    expectNoDuplicateTest<PdfFfsIndividualPage8>(pdfKey, testedPdfKeys);
    const pdfFields = mapFfsIndividualFields(
      generateFormData({
        medicareProviderId: "111111",
      }),
    );
    expect(pdfFields[pdfKey]).toEqual("111111");
  });

  it("fills in UPIN number", () => {
    const pdfKey = "fd425upinno";
    expectNoDuplicateTest<PdfFfsIndividualPage8>(pdfKey, testedPdfKeys);

    const pdfFieldsWithUpinPopulated = mapFfsIndividualFields(
      generateFormData({
        upinNumber: "ABC123",
      }),
    );
    expect(pdfFieldsWithUpinPopulated[pdfKey]).toEqual("ABC123");

    for (const emptyValue of [null, "", "   "]) {
      const pdfFieldsWithUpinEmpty = mapFfsIndividualFields(
        generateFormData({
          upinNumber: emptyValue,
        }),
      );
      expect(pdfFieldsWithUpinEmpty[pdfKey]).toEqual("N/A");
    }
  });

  it("fills in NPI number", () => {
    const pdfKey = "fd425npinumber";
    expectNoDuplicateTest<PdfFfsIndividualPage8>(pdfKey, testedPdfKeys);
    testNpiNumber(pdfKey);
  });

  it("fills in telephone number", () => {
    const pdfKey = "fd425telephoneno";
    expectNoDuplicateTest<PdfFfsIndividualPage8>(pdfKey, testedPdfKeys);
    testPhoneNumber(pdfKey);
  });

  it("fills in e-mail address", () => {
    const pdfKey = "fd425emailaddress";
    expectNoDuplicateTest<PdfFfsIndividualPage8>(pdfKey, testedPdfKeys);
    const pdfFields = mapFfsIndividualFields(
      generateFormData({
        email: "test@test.com",
      }),
    );
    expect(pdfFields[pdfKey]).toEqual("test@test.com");
  });

  describe("mail to address", () => {
    it("fills in mail to address line 1", () => {
      const pdfKey = "fd425mailtoaddressstreet";
      expectNoDuplicateTest<PdfFfsIndividualPage8>(pdfKey, testedPdfKeys);
      const pdfFieldsOnlyAddress1 = mapFfsIndividualFields(
        generateFormData({
          streetAddress1: "55 Cherry St",
        }),
      );
      expect(pdfFieldsOnlyAddress1[pdfKey]).toEqual("55 Cherry St");

      const pdfFieldsAddress1And2 = mapFfsIndividualFields(
        generateFormData({
          streetAddress1: "55 Cherry St",
          streetAddress2: "Apt 4",
        }),
      );
      expect(pdfFieldsAddress1And2[pdfKey]).toEqual("55 Cherry St Apt 4");
    });

    it.each([
      {
        description: "mail to address city",
        pdfKey: "fd425mailtoaddresscity" as const,
        formData: {
          city: "Newark",
        },
        expected: "Newark",
      },
      {
        description: "mail to address state",
        pdfKey: "fd425mailtoaddressstate" as const,
        formData: {
          state: AddressState.NJ,
        },
        expected: "NJ",
      },
      {
        description: "mail to address zip",
        pdfKey: "fd425mailtoaddresszip" as const,
        formData: {
          zip: "08609",
        },
        expected: "08609",
      },
    ])("fills in $description", ({ pdfKey, formData, expected }) => {
      expectNoDuplicateTest<PdfFfsIndividualPage8>(pdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(generateFormData(formData));
      expect(pdfFields[pdfKey]).toEqual(expected);
    });
  });

  it("fills in transfer of ownership no", () => {
    const pdfKey = "fd425transfercbno";
    expectNoDuplicateTest<PdfFfsIndividualPage8>(pdfKey, testedPdfKeys);
    const pdfFields = mapFfsIndividualFields(generateFormData({}));
    expect(pdfFields[pdfKey]).toEqual(true);
  });

  describe("pay to address", () => {
    it("fills in pay to address line 1", () => {
      const pdfKey = "fd425paytoaddressstreet";
      expectNoDuplicateTest<PdfFfsIndividualPage8>(pdfKey, testedPdfKeys);
      const pdfFieldsOnlyAddress1 = mapFfsIndividualFields(
        generateFormData({
          billingStreetAddress1: "55 Cherry St",
        }),
      );
      expect(pdfFieldsOnlyAddress1[pdfKey]).toEqual("55 Cherry St");

      const pdfFieldsAddress1And2 = mapFfsIndividualFields(
        generateFormData({
          billingStreetAddress1: "55 Cherry St",
          billingStreetAddress2: "Apt 4",
        }),
      );
      expect(pdfFieldsAddress1And2[pdfKey]).toEqual("55 Cherry St Apt 4");
    });

    it.each([
      {
        description: "pay to address city",
        pdfKey: "fd425paytoaddresscity" as const,
        formData: {
          billingCity: "Newark",
        },
        expected: "Newark",
      },
      {
        description: "pay to address state",
        pdfKey: "fd425paytoaddressstate" as const,
        formData: {
          billingState: AddressState.NJ,
        },
        expected: "NJ",
      },
      {
        description: "pay to address zip",
        pdfKey: "fd425paytoaddresszip" as const,
        formData: {
          billingZip: "08609",
        },
        expected: "08609",
      },
    ])("fills in $description", ({ pdfKey, formData, expected }) => {
      expectNoDuplicateTest<PdfFfsIndividualPage8>(pdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(generateFormData(formData));
      expect(pdfFields[pdfKey]).toEqual(expected);
    });
  });
});
