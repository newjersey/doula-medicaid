import { getBusinessDetailsFormData } from "@/app/form/(formSteps)/business-details/BusinessDetailsData";
import {
  setInSessionStorage,
  setRequiredFieldsInSessionStorage,
} from "@/app/form/_utils/fillPdf/testUtils/formData";
import { AddressState } from "@/app/form/_utils/inputFields/enums";

describe("getBusinessDetailsFormData", () => {
  describe("businessAddressSameAsOtherAddress handling", () => {
    it("overwrites all business address values with mailing address values when businessAddressSameAsOtherAddress is mailing", () => {
      setRequiredFieldsInSessionStorage();
      setInSessionStorage({
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
      expect(getBusinessDetailsFormData()).toMatchObject({
        businessStreetAddress1: "123 Main St",
        businessStreetAddress2: "Apt 4B",
        businessCity: "Trenton",
        businessState: AddressState.NJ,
        businessZip: "10001",
      });
    });

    it("overwrites all business address values with billing address values when businessAddressSameAsOtherAddress is billing", () => {
      setRequiredFieldsInSessionStorage();
      setInSessionStorage({
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
      expect(getBusinessDetailsFormData()).toMatchObject({
        businessStreetAddress1: "123 Main St",
        businessStreetAddress2: "Apt 4B",
        businessCity: "Trenton",
        businessState: AddressState.NJ,
        businessZip: "10001",
      });
    });

    it("uses separate business address values when businessAddressSameAsOtherAddress is different", () => {
      setRequiredFieldsInSessionStorage();
      setInSessionStorage({
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
      expect(getBusinessDetailsFormData()).toMatchObject({
        businessStreetAddress1: "55 Cherry St",
        businessStreetAddress2: "Apt 10",
        businessCity: "Newark",
        businessState: AddressState.NJ,
        businessZip: "08609",
      });
    });
  });
});
