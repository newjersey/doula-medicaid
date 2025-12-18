import { getFormData } from "@/app/form/_utils/fillPdf/form";
import { generateDataStoreWithRequiredFields } from "@/app/form/_utils/fillPdf/testUtils/formData";

describe("getFormData", () => {
  describe("when NEXT_PUBLIC_FLAG_LEGAL is not set", () => {
    it("does not get legal form data", () => {
      const dataStore = generateDataStoreWithRequiredFields();
      expect(getFormData(dataStore)).not.toHaveProperty("hasCrimeCharge");
    });
  });

  describe('when NEXT_PUBLIC_FLAG_LEGAL is "1"', () => {
    const oldProcessEnv = process.env;
    beforeEach(() => {
      jest.resetModules();
      process.env = { ...oldProcessEnv, NEXT_PUBLIC_FLAG_LEGAL: "1" };
    });
    afterAll(() => {
      process.env = oldProcessEnv;
    });

    it("gets legal form data", () => {
      const dataStore = generateDataStoreWithRequiredFields();
      expect(getFormData(dataStore)).toHaveProperty("hasCrimeCharge");
    });
  });
});
