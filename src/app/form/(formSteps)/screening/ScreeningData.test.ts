import { getScreeningFormData } from "@/app/form/(formSteps)/screening/ScreeningData";
import { generateDataStoreWithRequiredFields } from "@/app/form/_utils/fillPdf/testUtils/formData";

describe("getScreeningFormData", () => {
  describe("disclosing entity handling", () => {
    it("sets isSupportedSoleProprietor to true when isSoleProprietor is true, everHadEmployees is false, everHadOtherBusinessOwner is false, haveOtherBusinessOwnerNextYear is false, and hadDhmasBusiness is false", async () => {
      const dataStore = generateDataStoreWithRequiredFields({
        isSoleProprietor: "true",
        everHadEmployees: "false",
        everHadOtherBusinessOwner: "false",
        haveOtherBusinessOwnerNextYear: "false",
        hadDhmasBusiness: "false",
      });
      expect(getScreeningFormData(dataStore)).toMatchObject({
        isSupportedSoleProprietor: true,
      });
    });

    it.each([
      { key: "isSoleProprietor", value: "false" },
      { key: "everHadEmployees", value: "true" },
      { key: "everHadOtherBusinessOwner", value: "true" },
      { key: "haveOtherBusinessOwnerNextYear", value: "true" },
      { key: "hadDhmasBusiness", value: "true" },
    ])("throws an error when $key is $value", async ({ key, value }) => {
      const dataStore = generateDataStoreWithRequiredFields({ [key]: value });
      const expectedValues = {
        isSoleProprietor: "true",
        everHadEmployees: "false",
        everHadOtherBusinessOwner: "false",
        haveOtherBusinessOwnerNextYear: "false",
        hadDhmasBusiness: "false",
        ...{ [key]: value },
      };
      expect(() => getScreeningFormData(dataStore)).toThrow(
        `Invalid screening answers: isSoleProprietor: ${expectedValues["isSoleProprietor"]}, everHadEmployees: ${expectedValues["everHadEmployees"]}, everHadOtherBusinessOwner ${expectedValues["everHadOtherBusinessOwner"]}, haveOtherBusinessOwnerNextYear ${expectedValues["haveOtherBusinessOwnerNextYear"]}, hadDhmasBusiness ${expectedValues["hadDhmasBusiness"]}`,
      );
    });
  });
});
