import { getInsuranceFormData } from "@/app/form/(formSteps)/insurance/InsuranceData";
import {
  setInSessionStorage,
  setRequiredFieldsInSessionStorage,
} from "@/app/form/_utils/fillPdf/testUtils/formData";

describe("getInsuranceFormData", () => {
  describe("insurance start and end date handling", () => {
    it("creates date when all date components are present", async () => {
      setRequiredFieldsInSessionStorage();
      setInSessionStorage({
        insuranceStartDateDay: "25",
        insuranceStartDateMonth: "12",
        insuranceStartDateYear: "2020",
        insuranceEndDateDay: "1",
        insuranceEndDateMonth: "1",
        insuranceEndDateYear: "2030",
      });
      expect(getInsuranceFormData()).toMatchObject({
        insuranceStartDate: new Date("2020/12/25"),
        insuranceEndDate: new Date("2030/01/01"),
      });
    });
  });
});
