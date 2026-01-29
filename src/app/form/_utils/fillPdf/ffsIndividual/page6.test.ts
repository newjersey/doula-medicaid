import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import { mapFfsIndividualFields } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import type { PdfFfsIndividualPage6 } from "@/app/form/_utils/fillPdf/ffsIndividual/page6";
import {
  expectNoDuplicateTest,
  testName,
  testNpiNumber,
  testPhoneNumber,
} from "@/app/form/_utils/fillPdf/testUtils/fillPdf";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { AddressState } from "@/app/form/_utils/inputFields/addressState";

describe("Page 6 - authorization agreement for automated deposits of state payments", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage6>([]);

  it("fills name of my bank", () => {
    const pdfKey = "fd443bankname";
    expectNoDuplicateTest<PdfFfsIndividualPage6>(pdfKey, testedPdfKeys);
    const pdfFields = mapFfsIndividualFields(
      generateFormData({
        bankName: "Name of Bank",
      }),
    );
    expect(pdfFields[pdfKey]).toEqual("Name of Bank");
  });

  it("fills bank city", () => {
    const pdfKey = "fd443CITY";
    expectNoDuplicateTest<PdfFfsIndividualPage6>(pdfKey, testedPdfKeys);
    const pdfFields = mapFfsIndividualFields(
      generateFormData({
        bankCity: "Test city",
      }),
    );
    expect(pdfFields[pdfKey]).toEqual("Test city");
  });

  it("fills bank state", () => {
    const pdfKey = "fd443STATE";
    expectNoDuplicateTest<PdfFfsIndividualPage6>(pdfKey, testedPdfKeys);
    const pdfFields = mapFfsIndividualFields(
      generateFormData({
        bankState: "NJ",
      }),
    );
    expect(pdfFields[pdfKey]).toEqual("NJ");
  });

  it("fills bank ZIP Code", () => {
    const pdfKey = "fd443zipcode";
    expectNoDuplicateTest<PdfFfsIndividualPage6>(pdfKey, testedPdfKeys);
    const pdfFields = mapFfsIndividualFields(
      generateFormData({
        bankZip: "12345",
      }),
    );
    expect(pdfFields[pdfKey]).toEqual("12345");
  });

  it("fills my bank transit number", () => {
    const pdfKey = "fd443banktransitno";
    expectNoDuplicateTest<PdfFfsIndividualPage6>(pdfKey, testedPdfKeys);
    const pdfFields = mapFfsIndividualFields(
      generateFormData({
        bankRoutingNumber: "123456789",
      }),
    );
    expect(pdfFields[pdfKey]).toEqual("123456789");
  });

  it("fills my bank account number", () => {
    const pdfKey = "fd443bankacctno";
    expectNoDuplicateTest<PdfFfsIndividualPage6>(pdfKey, testedPdfKeys);
    const pdfFields = mapFfsIndividualFields(
      generateFormData({
        bankAccountNumber: "11111111111",
      }),
    );
    expect(pdfFields[pdfKey]).toEqual("11111111111");
  });

  it("fills name on your bank account", () => {
    const pdfKey = "fd443bankaccount";
    expectNoDuplicateTest<PdfFfsIndividualPage6>(pdfKey, testedPdfKeys);
    const pdfFields = mapFfsIndividualFields(
      generateFormData({
        nameOnBankAccount: "Full name used for bank account",
      }),
    );
    expect(pdfFields[pdfKey]).toEqual("Full name used for bank account");
  });

  it("fills telephone number", () => {
    const pdfKey = "fd443telephoneno";
    expectNoDuplicateTest<PdfFfsIndividualPage6>(pdfKey, testedPdfKeys);
    testPhoneNumber(pdfKey);
  });

  it("fills NPI number", () => {
    const pdfKey = "fd443npino";
    expectNoDuplicateTest<PdfFfsIndividualPage6>(pdfKey, testedPdfKeys);
    testNpiNumber(pdfKey);
  });

  it("fills in pay to address", () => {
    const line1Key = "fd443paytoaddressline1" as const;
    const line2Key = "fd443paytoaddressline2" as const;
    const line3Key = "fd443paytoaddressline3" as const;
    const pdfKeys = [line1Key, line2Key, line3Key];
    for (const pdfKey of pdfKeys) {
      expectNoDuplicateTest<PdfFfsIndividualPage6>(pdfKey, testedPdfKeys);
    }

    const testCases = [
      {
        description: "has streetAddress2",
        formData: {
          billingStreetAddress1: "456 Test St",
          billingStreetAddress2: "Suite Test",
          billingCity: "Newark",
          billingState: AddressState.NJ,
          billingZip: "22222",
        },
        expectedLine1Key: "456 Test St",
        expectedLine2Key: "Suite Test",
        expectedLine3Key: "Newark, NJ 22222",
      },
      {
        description: "no streetAddress2",
        formData: {
          billingStreetAddress1: "456 Test St",
          billingStreetAddress2: "",
          billingCity: "Newark",
          billingState: AddressState.NJ,
          billingZip: "22222",
        },
        expectedLine1Key: "456 Test St",
        expectedLine2Key: "Newark, NJ 22222",
        expectedLine3Key: "",
      },
    ];
    for (const testCase of testCases) {
      const pdfFields = mapFfsIndividualFields(generateFormData(testCase.formData));
      expect(pdfFields[line1Key]).toEqual(testCase.expectedLine1Key);
      expect(pdfFields[line2Key]).toEqual(testCase.expectedLine2Key);
      expect(pdfFields[line3Key]).toEqual(testCase.expectedLine3Key);
    }
  });

  it("fills printed name", () => {
    const pdfKey = "fd443printedname";
    expectNoDuplicateTest<PdfFfsIndividualPage6>(pdfKey, testedPdfKeys);
    testName(pdfKey);
  });

  describe("joint account other owner's printed name", () => {
    it("fills other owner's printed name when hasJointBankAccount is true", () => {
      const pdfKey = "fd443jointprintedname";
      expectNoDuplicateTest<PdfFfsIndividualPage6>(pdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          hasJointBankAccount: true,
          secondNameOnJointBankAccount: "Joint owner name",
        }),
      );
      expect(pdfFields[pdfKey]).toEqual("Joint owner name");
    });

    it("does not fill other owner's printed name when hasJointBankAccount is false", () => {
      const pdfKey = "fd443jointprintedname";
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          hasJointBankAccount: false,
        }),
      );
      expect(pdfFields[pdfKey]).toEqual(undefined);
    });

    it("throws an UnexpectedFormDataError when hasJointBankAccount is true but secondNameOnJointBankAccount is null", () => {
      const testFunction = () =>
        mapFfsIndividualFields(
          generateFormData({
            hasJointBankAccount: true,
            secondNameOnJointBankAccount: null,
          }),
        );
      expect(testFunction).toThrow(UnexpectedFormDataError);
      expect(testFunction).toThrow(
        "hasJointBankAccount is true, but secondNameOnJointBankAccount was not provided",
      );
    });
  });
});
