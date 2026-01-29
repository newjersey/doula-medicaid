import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import { mapFfsIndividualFields } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import type { PdfFfsIndividualPage4 } from "@/app/form/_utils/fillPdf/ffsIndividual/page4";
import {
  expectNoDuplicateTest,
  testDateOfBirth,
  testName,
  testSocialSecurityNumber,
} from "@/app/form/_utils/fillPdf/testUtils/fillPdf";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { AddressState } from "@/app/form/_utils/inputFields/addressState";

describe("Page 4 - doula qualifications form", () => {
  const testedPdfKeys = new Set<keyof PdfFfsIndividualPage4>([]);
  describe("Part 1", () => {
    it("fills legal name", () => {
      const pdfKey = "fd427LegalName";
      expectNoDuplicateTest<PdfFfsIndividualPage4>(pdfKey, testedPdfKeys);
      testName(pdfKey);
    });

    it("fills social security number", () => {
      const pdfKey = "fd427SocialSecurityNumber";
      expectNoDuplicateTest<PdfFfsIndividualPage4>(pdfKey, testedPdfKeys);
      testSocialSecurityNumber(pdfKey);
    });

    it("fills date of birth", () => {
      const pdfKey = "fd427dateofbirthDate1_af_date";
      expectNoDuplicateTest<PdfFfsIndividualPage4>(pdfKey, testedPdfKeys);
      testDateOfBirth(pdfKey);
    });
  });

  describe("Part 2", () => {
    describe("training program name", () => {
      it("fills training program name", () => {
        const pdfKey = "fd427TrainingProgramName";
        expectNoDuplicateTest<PdfFfsIndividualPage4>(pdfKey, testedPdfKeys);

        const testCases = [
          {
            description:
              "fills the selected approved training when user selects a state approved training",
            formData: {
              stateApprovedTraining: "Children's Futures (Trenton)",
              nameOfTrainingOrganization: null,
            },
            expected: "Children's Futures (Trenton)",
          },
          {
            description:
              "fills the name of the training organization when user provides the name of a non-approved training",
            formData: {
              stateApprovedTraining: "None of these",
              nameOfTrainingOrganization: "Name of training org",
            },
            expected: "Name of training org",
          },
        ];
        for (const testCase of testCases) {
          const pdfFields = mapFfsIndividualFields(generateFormData(testCase.formData));
          expect(pdfFields[pdfKey]).toEqual(testCase.expected);
        }
      });

      it("throws an UnexpectedFormDataError when formData contains None of these but no Training Organization", () => {
        const testFunction = () =>
          mapFfsIndividualFields(
            generateFormData({
              stateApprovedTraining: "None of these",
            }),
          );
        expect(testFunction).toThrow(UnexpectedFormDataError);
        expect(testFunction).toThrow(
          "stateApprovedTraining had value none of these, but no training organization was provided.",
        );
      });
    });

    it("fills training program contact", () => {
      const pdfKey = "fd427TrainingProgramContact";
      expectNoDuplicateTest<PdfFfsIndividualPage4>(pdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          instructorFirstName: "First",
          instructorLastName: "Last",
        }),
      );
      expect(pdfFields[pdfKey]).toEqual("First Last");
    });

    it("fills training program email address", () => {
      const pdfKey = "fd427trainingprogramcontanctE-mailAddress";
      expectNoDuplicateTest<PdfFfsIndividualPage4>(pdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          instructorEmail: "test@example.com",
        }),
      );
      expect(pdfFields[pdfKey]).toEqual("test@example.com");
    });

    it("fills training program telephone number", () => {
      const pdfKey = "fd427trainingprogramcontactTelephoneNo";
      expectNoDuplicateTest<PdfFfsIndividualPage4>(pdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          instructorPhoneNumber: "111-111-1111",
        }),
      );
      expect(pdfFields[pdfKey]).toEqual("111-111-1111");
    });

    it("fills training street", () => {
      const pdfKey = "fd427trainingsiteStreetaddress";
      expectNoDuplicateTest<PdfFfsIndividualPage4>(pdfKey, testedPdfKeys);

      const testCases = [
        {
          description: "training is in person and there is only one address line",
          formData: {
            isDoulaTrainingInPerson: true,
            trainingStreetAddress1: "55 Cherry St",
          },
          expected: "55 Cherry St",
        },
        {
          description: "training is in person and there are two address lines",
          formData: {
            isDoulaTrainingInPerson: true,
            trainingStreetAddress1: "55 Cherry St",
            trainingStreetAddress2: "Apt 4",
          },
          expected: "55 Cherry St Apt 4",
        },
        {
          description: "training is virtual",
          formData: {
            isDoulaTrainingInPerson: false,
            trainingStreetAddress1: "",
            trainingStreetAddress2: "",
          },
          expected: "Virtual",
        },
      ];
      for (const testCase of testCases) {
        const pdfFields = mapFfsIndividualFields(generateFormData(testCase.formData));
        expect(pdfFields[pdfKey]).toEqual(testCase.expected);
      }
    });

    it("fills doula training address city, state, and zip", () => {
      const cityKey = "fd427trainingsiteCity" as const;
      const stateKey = "fd427trainingsiteState" as const;
      const zipKey = "fd427trainingsiteZip" as const;
      const pdfKeys = [cityKey, stateKey, zipKey];
      for (const pdfKey of pdfKeys) {
        expectNoDuplicateTest<PdfFfsIndividualPage4>(pdfKey, testedPdfKeys);
      }

      const testCases = [
        {
          description: "training is in person and there is only one address line",
          formData: {
            isDoulaTrainingInPerson: true,
            trainingCity: "Newark",
            trainingState: AddressState.NJ,
            trainingZip: "08609",
          },
          expectedCity: "Newark",
          expectedState: "NJ",
          expectedZip: "08609",
        },
        {
          description: "training is virtual",
          formData: {
            isDoulaTrainingInPerson: false,
            trainingCity: null,
            trainingState: null,
            trainingZip: null,
          },
          expectedCity: "",
          expectedState: "",
          expectedZip: "",
        },
      ];
      for (const testCase of testCases) {
        const pdfFields = mapFfsIndividualFields(generateFormData(testCase.formData));
        expect(pdfFields[cityKey]).toEqual(testCase.expectedCity);
        expect(pdfFields[stateKey]).toEqual(testCase.expectedState);
        expect(pdfFields[zipKey]).toEqual(testCase.expectedZip);
      }
    });
  });

  describe("Part 3", () => {
    it("fills period of coverage", () => {
      const pdfKey = "fd427currentprofessionalliabilityinsurancecarrierPeriodofCoverage";
      expectNoDuplicateTest<PdfFfsIndividualPage4>(pdfKey, testedPdfKeys);
      const formData = generateFormData({
        insuranceStartDate: new Date("12/10/2024"),
        insuranceEndDate: new Date("01/01/2029"),
      });
      const pdfFields = mapFfsIndividualFields(formData);
      expect(pdfFields[pdfKey]).toEqual("12/10/2024 - 01/01/2029");
    });

    it("fills amount of coverage per occurrence", () => {
      const pdfKey =
        "fd427currentprofessionalliabilityinsurancecarrierAmountofCoveragePerOccurrence";
      expectNoDuplicateTest<PdfFfsIndividualPage4>(pdfKey, testedPdfKeys);
      const formData = generateFormData({
        insuranceOccurenceAmount: "1000000",
      });
      const pdfFields = mapFfsIndividualFields(formData);
      expect(pdfFields[pdfKey]).toEqual("1000000");
    });

    it("fills amount of coverage per aggregate", () => {
      const pdfKey =
        "fd427currentprofessionalliabilityinsurancecarrierAmountofCoveragePerAggregate";
      expectNoDuplicateTest<PdfFfsIndividualPage4>(pdfKey, testedPdfKeys);
      const formData = generateFormData({
        insuranceAggregateAmount: "3000000",
      });
      const pdfFields = mapFfsIndividualFields(formData);
      expect(pdfFields[pdfKey]).toEqual("3000000");
    });

    it("fills name of current professional liability insurance carrier", () => {
      const pdfKey = "fd427NameofCurrentProfessionalLiabilityInsuranceCarrier";
      expectNoDuplicateTest<PdfFfsIndividualPage4>(pdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          insuranceCarrierName: "Test insurance company",
        }),
      );
      expect(pdfFields[pdfKey]).toEqual("Test insurance company");
    });

    it("fills insurance address street, city, state, and zip", () => {
      const streetKey = "fd427currentprofessionalliabilityinsurancecarrierStreetaddress" as const;
      const cityKey = "fd427currentprofessionalliabilityinsurancecarriercity" as const;
      const stateKey = "fd427currentprofessionalliabilityinsurancecarrierstate" as const;
      const zipKey = "fd427currentprofessionalliabilityinsurancecarrierzip" as const;
      const pdfKeys = [streetKey, cityKey, stateKey, zipKey];
      for (const pdfKey of pdfKeys) {
        expectNoDuplicateTest<PdfFfsIndividualPage4>(pdfKey, testedPdfKeys);
      }

      const testCases = [
        {
          description: "there is only one address line",
          formData: {
            insuranceStreetAddress1: "55 Cherry St",
            insuranceStreetAddress2: null,
            insuranceCity: "Newark",
            insuranceState: AddressState.NJ,
            insuranceZip: "08609",
          },
          expectedStreet: "55 Cherry St",
        },
        {
          description: "there are two address lines",
          formData: {
            insuranceStreetAddress1: "55 Cherry St",
            insuranceStreetAddress2: "Apt 4",
            insuranceCity: "Newark",
            insuranceState: AddressState.NJ,
            insuranceZip: "08609",
          },
          expectedStreet: "55 Cherry St Apt 4",
        },
      ];
      for (const testCase of testCases) {
        const pdfFields = mapFfsIndividualFields(generateFormData(testCase.formData));
        expect(pdfFields[streetKey]).toEqual(testCase.expectedStreet);
        expect(pdfFields[cityKey]).toEqual("Newark");
        expect(pdfFields[stateKey]).toEqual("NJ");
        expect(pdfFields[zipKey]).toEqual("08609");
      }
    });

    it("fills policy number", () => {
      const pdfKey = "fd427currentprofessionalliabilityinsurancecarrierpolicyno";
      expectNoDuplicateTest<PdfFfsIndividualPage4>(pdfKey, testedPdfKeys);
      const pdfFields = mapFfsIndividualFields(
        generateFormData({
          insurancePolicyNumber: "POLICY-123",
        }),
      );
      expect(pdfFields[pdfKey]).toEqual("POLICY-123");
    });
  });
});
