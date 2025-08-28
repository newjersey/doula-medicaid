import { getScreeningFormData } from "@/app/form/(formSteps)/screening/ScreeningData";
import {
  setInSessionStorage,
  setRequiredFieldsInSessionStorage,
} from "@/app/form/_utils/fillPdf/testUtils/formData";
import { DisclosingEntity } from "@/app/form/_utils/inputFields/enums";

describe("getScreeningFormData", () => {
  describe("disclosing entity handling", () => {
    it("sets natureOfDisclosingEntity to SoleProprietor when isSoleProprietor is true", async () => {
      setRequiredFieldsInSessionStorage();
      setInSessionStorage({ isSoleProprietor: "true" });
      expect(getScreeningFormData()).toMatchObject({
        natureOfDisclosingEntity: DisclosingEntity.SoleProprietor,
      });
    });

    it("throws an error when isSoleProprietor is false", async () => {
      setRequiredFieldsInSessionStorage();
      setInSessionStorage({ isSoleProprietor: "false" });
      expect(() => getScreeningFormData()).toThrow(
        "Expected isSoleProprietor to be true, was false",
      );
    });
  });
});
