import { getLegalFormData } from "@/app/form/(formSteps)/legal/LegalData";
import { generateDataStoreWithRequiredFields } from "@/app/form/_utils/fillPdf/testUtils/formData";

describe("getLegalFormData", () => {
  describe.each([
    ["isEmployedByNj", "employedByNjExplanation"],
    ["hasProvidedMedicaidServices", "medicaidProviderExplanation"],
    ["hasCrimeCharge", "crimeChargeExplanation"],
    ["hadLicenseSuspended", "licenseSuspendedExplanation"],
    ["hasDisqualification", "disqualificationExplanation"],
    ["hasCompanyInvolvement", "companyInvolvementExplanation"],
  ])("%s", (condition, explanation) => {
    it(`gets ${explanation} when ${condition} is true`, () => {
      const dataStore = generateDataStoreWithRequiredFields({
        [condition]: "true",
        [explanation]: "Explanation",
      });
      expect(getLegalFormData(dataStore)).toMatchObject({
        [condition]: true,
        [explanation]: "Explanation",
      });
    });

    it(`overwrites ${explanation} with null when ${condition} is false`, () => {
      const dataStore = generateDataStoreWithRequiredFields({
        [condition]: "false",
        [explanation]: "Explanation",
      });
      expect(getLegalFormData(dataStore)).toMatchObject({
        [condition]: false,
        [explanation]: null,
      });
    });
  });
});
