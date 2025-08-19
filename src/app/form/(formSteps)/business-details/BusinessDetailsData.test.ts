import { getBusinessDetailsData } from "@/app/form/(formSteps)/business-details/BusinessDetailsData";
import {
  setInSessionStorage,
  setRequiredFieldsInSessionStorage,
} from "@/app/form/_utils/fillPdf/testUtils/formData";
import { DisclosingEntity } from "@/app/form/_utils/inputFields/enums";

describe("getBusinessDetailsData", () => {
  describe("disclosing entity handling", () => {
    it("sets natureOfDisclosingEntity to SoleProprietorship when isSoleProprietorship is true", async () => {
      setRequiredFieldsInSessionStorage();
      setInSessionStorage({ isSoleProprietorship: "true" });
      expect(getBusinessDetailsData()).toMatchObject({
        natureOfDisclosingEntity: DisclosingEntity.SoleProprietorship,
      });
    });

    it("sets natureOfDisclosingEntity to null when isSoleProprietorship is false", async () => {
      setRequiredFieldsInSessionStorage();
      setInSessionStorage({ isSoleProprietorship: "false" });
      expect(getBusinessDetailsData()).toMatchObject({
        natureOfDisclosingEntity: null,
      });
    });
  });
});
