import { getPersonalDetailsFormData } from "@/app/form/(formSteps)/personal-details/PersonalDetailsData";
import { generateDataStoreWithRequiredFields } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { AddressState } from "@/app/form/_utils/inputFields/addressState";

describe("getPersonalDetailsFormData", () => {
  describe("hasSameBillingMailingAddress handling", () => {
    it("overwrites all billing address values with mailing address values when hasSameBillingMailingAddress is true", () => {
      const dataStore = generateDataStoreWithRequiredFields({
        streetAddress1: "123 Main St",
        streetAddress2: "Apt 4B",
        city: "Trenton",
        state: "NJ",
        zip: "10001",
        hasSameBillingMailingAddress: "true",
        billingStreetAddress1: "400 Ignore St",
        billingStreetAddress2: "Unit 4",
        billingCity: "New York",
        billingState: "NY",
        billingZip: "22222",
      });
      expect(getPersonalDetailsFormData(dataStore)).toMatchObject({
        streetAddress1: "123 Main St",
        streetAddress2: "Apt 4B",
        city: "Trenton",
        state: AddressState.NJ,
        zip: "10001",
        billingStreetAddress1: "123 Main St",
        billingStreetAddress2: "Apt 4B",
        billingCity: "Trenton",
        billingState: AddressState.NJ,
        billingZip: "10001",
      });
    });

    it("uses separate billing address values when hasSameBillingMailingAddress is false", () => {
      const dataStore = generateDataStoreWithRequiredFields({
        streetAddress1: "123 Main St",
        streetAddress2: "Apt 4B",
        city: "Trenton",
        state: "NJ",
        zip: "10001",
        hasSameBillingMailingAddress: "false",
        billingStreetAddress1: "400 Billing St",
        billingStreetAddress2: "Unit 4",
        billingCity: "New York",
        billingState: "NY",
        billingZip: "22222",
      });
      expect(getPersonalDetailsFormData(dataStore)).toMatchObject({
        streetAddress1: "123 Main St",
        streetAddress2: "Apt 4B",
        city: "Trenton",
        state: AddressState.NJ,
        zip: "10001",
        billingStreetAddress1: "400 Billing St",
        billingStreetAddress2: "Unit 4",
        billingCity: "New York",
        billingState: AddressState.NY,
        billingZip: "22222",
      });
    });
  });

  describe("date of birth handling", () => {
    it("creates date when all date components are present", async () => {
      const dataStore = generateDataStoreWithRequiredFields({
        dateOfBirthDay: "25",
        dateOfBirthMonth: "12",
        dateOfBirthYear: "1990",
      });
      expect(getPersonalDetailsFormData(dataStore)).toMatchObject({
        dateOfBirth: new Date("1990/12/25"),
      });
    });
  });
});
