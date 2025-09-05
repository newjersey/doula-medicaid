import { getScreeningFormData } from "@/app/form/(formSteps)/screening/ScreeningData";
import {
  setInSessionStorage,
  setRequiredFieldsInSessionStorage,
} from "@/app/form/_utils/fillPdf/testUtils/formData";

describe("getScreeningFormData", () => {
  describe("disclosing entity handling", () => {
    it("sets isSupportedSoleProprietor to true when isSoleProprietor is true, everHadEmployees is false, and everHadOtherBusinessOwner is false", async () => {
      setRequiredFieldsInSessionStorage();
      setInSessionStorage({
        isSoleProprietor: "true",
        everHadEmployees: "false",
        everHadOtherBusinessOwner: "false",
      });
      expect(getScreeningFormData()).toMatchObject({
        isSupportedSoleProprietor: true,
      });
    });

    it.each([
      { key: "isSoleProprietor", value: "false" },
      { key: "everHadEmployees", value: "true" },
      { key: "everHadOtherBusinessOwner", value: "true" },
    ])("throws an error when $key is $value", async ({ key, value }) => {
      setRequiredFieldsInSessionStorage();
      setInSessionStorage({ [key]: value });
      const expectedValues = {
        isSoleProprietor: "true",
        everHadEmployees: "false",
        everHadOtherBusinessOwner: "false",
        ...{ [key]: value },
      };
      expect(() => getScreeningFormData()).toThrow(
        `Invalid screening answers: isSoleProprietor: ${expectedValues["isSoleProprietor"]}, everHadEmployees: ${expectedValues["everHadEmployees"]}, everHadOtherBusinessOwner ${expectedValues["everHadOtherBusinessOwner"]}`,
      );
    });
  });
});
