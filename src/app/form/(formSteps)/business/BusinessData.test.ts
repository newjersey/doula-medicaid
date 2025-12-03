import { getBusinessFormData } from "@/app/form/(formSteps)/business/BusinessData";
import { generateDataStoreWithRequiredFields } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { AddressState } from "@/app/form/_utils/inputFields/addressState";

describe("getBusinessFormData", () => {
  describe("businessAddressSameAsOtherAddress handling", () => {
    it("overwrites all business address values with mailing address values when businessAddressSameAsOtherAddress is mailing", () => {
      const dataStore = generateDataStoreWithRequiredFields({
        streetAddress1: "123 Main St",
        streetAddress2: "Apt 4B",
        city: "Trenton",
        state: "NJ",
        zip: "10001",
        businessAddressSameAsOtherAddress: "mailing",
        businessStreetAddress1: "400 Ignore St",
        businessStreetAddress2: "Unit 4",
        businessCity: "New York",
        businessState: "NY",
        businessZip: "22222",
      });
      expect(getBusinessFormData(dataStore)).toMatchObject({
        businessStreetAddress1: "123 Main St",
        businessStreetAddress2: "Apt 4B",
        businessCity: "Trenton",
        businessState: AddressState.NJ,
        businessZip: "10001",
      });
    });

    it("overwrites all business address values with billing address values when businessAddressSameAsOtherAddress is billing", () => {
      const dataStore = generateDataStoreWithRequiredFields({
        billingStreetAddress1: "123 Main St",
        billingStreetAddress2: "Apt 4B",
        billingCity: "Trenton",
        billingState: "NJ",
        billingZip: "10001",
        businessAddressSameAsOtherAddress: "billing",
        businessStreetAddress1: "400 Ignore St",
        businessStreetAddress2: "Unit 4",
        businessCity: "New York",
        businessState: "NY",
        businessZip: "22222",
      });
      expect(getBusinessFormData(dataStore)).toMatchObject({
        businessStreetAddress1: "123 Main St",
        businessStreetAddress2: "Apt 4B",
        businessCity: "Trenton",
        businessState: AddressState.NJ,
        businessZip: "10001",
      });
    });

    it("uses separate business address values when businessAddressSameAsOtherAddress is different", () => {
      const dataStore = generateDataStoreWithRequiredFields({
        streetAddress1: "123 Main St",
        streetAddress2: "Apt 4B",
        city: "Trenton",
        state: "NJ",
        zip: "10001",
        billingStreetAddress1: "400 Billing St",
        billingStreetAddress2: "Unit 4",
        billingCity: "New York",
        billingState: "NY",
        billingZip: "22222",
        businessAddressSameAsOtherAddress: "different",
        businessStreetAddress1: "55 Cherry St",
        businessStreetAddress2: "Apt 10",
        businessCity: "Newark",
        businessState: "NJ",
        businessZip: "08609",
      });
      expect(getBusinessFormData(dataStore)).toMatchObject({
        businessStreetAddress1: "55 Cherry St",
        businessStreetAddress2: "Apt 10",
        businessCity: "Newark",
        businessState: AddressState.NJ,
        businessZip: "08609",
      });
    });
  });
  describe("hasDisclosableEvent handling", () => {
    it("sets hasDisclosableEvent to false when the user answers no to all questions", () => {
      const dataStore = generateDataStoreWithRequiredFields({
        hasUncollectedDebt: "false",
        isSubjectToPaymentSuspension: "false",
        hasBeenSuspendedFromMedicaid: "false",
        hasBeenExcludedFromMedicaid: "false",
      });
      expect(getBusinessFormData(dataStore)).toMatchObject({
        hasDisclosableEvent: false,
      });
    });

    it.each([
      { key: "hasUncollectedDebt", value: "true" },
      { key: "isSubjectToPaymentSuspension", value: "true" },
      { key: "hasBeenSuspendedFromMedicaid", value: "true" },
      { key: "hasBeenExcludedFromMedicaid", value: "true" },
    ])("sets hasDisclosableEvent to true when $key is $value", async ({ key, value }) => {
      const dataStore = generateDataStoreWithRequiredFields({ [key]: value });
      expect(getBusinessFormData(dataStore)).toMatchObject({
        hasDisclosableEvent: true,
      });
    });
  });
});
