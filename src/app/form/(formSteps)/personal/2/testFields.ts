import {
  createTestField,
  createTestFields,
  type TestField,
} from "@/app/form/_utils/testUtils/testFields";

export const mailingAddressQuestion =
  "Mailing address We will send official mail here. It can be your home address.";
const billingAddressQuestion = "What is your billing address?";

export const stateField = createTestField({
  name: "State *",
  dataStoreKey: "state",
  required: false,
  role: "combobox",
  testValue: "Pennsylvania",
  expectedValue: "PA",
  withinGroupName: mailingAddressQuestion,
});

export const zipCodeField = createTestField({
  name: "ZIP Code *",
  dataStoreKey: "zip",
  required: true,
  testValue: "12345",
  withinGroupName: mailingAddressQuestion,
});

export const mailingAddressFields = [
  ...createTestFields([
    {
      name: "Street address *",
      dataStoreKey: "streetAddress1",
      required: true,
      testValue: "Test address 1",
      withinGroupName: mailingAddressQuestion,
    },
    {
      name: "Street address line 2",
      dataStoreKey: "streetAddress2",
      required: false,
      testValue: "Test address 2",
      withinGroupName: mailingAddressQuestion,
    },
    {
      name: "City *",
      dataStoreKey: "city",
      required: true,
      testValue: "Test city",
      withinGroupName: mailingAddressQuestion,
    },
  ]),
  stateField,
  zipCodeField,
];

export const yesSameBillingMailingAddress: TestField = createTestField({
  name: "Yes",
  dataStoreKey: "hasSameBillingMailingAddress",
  required: true,
  role: "radio",
  testValue: "true",
  withinGroupName: "Are your billing and residential addresses the same? Select one *",
});
export const noSameBillingMailingAddress: TestField = createTestField({
  name: "No",
  dataStoreKey: "hasSameBillingMailingAddress",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName: "Are your billing and residential addresses the same? Select one *",
});

export const minimalTestFields = [...mailingAddressFields, yesSameBillingMailingAddress];

export const billingStateField = createTestField({
  name: "State *",
  dataStoreKey: "billingState",
  required: false,
  role: "combobox",
  testValue: "Texas",
  expectedValue: "TX",
  withinGroupName: billingAddressQuestion,
  prerequisiteField: noSameBillingMailingAddress,
});

export const billingZipCodeField = createTestField({
  name: "ZIP Code *",
  dataStoreKey: "billingZip",
  required: true,
  testValue: "12345",
  withinGroupName: billingAddressQuestion,
  alternateRequiredFieldError: "Billing ZIP Code is required",
  prerequisiteField: noSameBillingMailingAddress,
});

export const billingAddressFields = [
  ...createTestFields([
    {
      name: "Street address *",
      dataStoreKey: "billingStreetAddress1",
      required: true,
      testValue: "Test address 1",
      withinGroupName: billingAddressQuestion,
      alternateRequiredFieldError: "Billing street address is required",
      prerequisiteField: noSameBillingMailingAddress,
    },
    {
      name: "Street address line 2",
      dataStoreKey: "billingStreetAddress2",
      required: false,
      testValue: "", // Test this address field not having a line 2
      withinGroupName: billingAddressQuestion,
      prerequisiteField: noSameBillingMailingAddress,
    },
    {
      name: "City *",
      dataStoreKey: "billingCity",
      required: true,
      testValue: "Houston",
      withinGroupName: billingAddressQuestion,
      alternateRequiredFieldError: "Billing city is required",
      prerequisiteField: noSameBillingMailingAddress,
    },
  ]),
  billingStateField,
  billingZipCodeField,
];

export const testFields = [
  ...mailingAddressFields,
  noSameBillingMailingAddress,
  ...billingAddressFields,
];
