import { getBusinessDetailsData } from "@/app/form/(formSteps)/business-details/BusinessDetailsData";
import {
  setInSessionStorage,
  setRequiredFieldsInSessionStorage,
} from "@/app/form/_utils/fillPdf/testUtils/formData";
import { DisclosingEntity } from "@/app/form/_utils/inputFields/enums";

describe("getBusinessDetailsData", () => {
  describe("disclosing entity handling", () => {
    it("sets natureOfDisclosingEntity to SoleProprietor when isSoleProprietor is true", async () => {
      setRequiredFieldsInSessionStorage();
      setInSessionStorage({ isSoleProprietor: "true" });
      expect(getBusinessDetailsData()).toMatchObject({
        natureOfDisclosingEntity: DisclosingEntity.SoleProprietor,
      });
    });

    it("sets natureOfDisclosingEntity to null when isSoleProprietor is false", async () => {
      setRequiredFieldsInSessionStorage();
      setInSessionStorage({ isSoleProprietor: "false" });
      expect(getBusinessDetailsData()).toMatchObject({
        natureOfDisclosingEntity: null,
      });
    });
  });
});
