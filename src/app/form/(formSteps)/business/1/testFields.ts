import {
  createTestField,
  createTestFields,
  type TestField,
} from "@/app/form/_utils/testUtils/testFields";

const businessAddressQuestion = "What is your business address?";

export const mailingBusinessAddressSameAsOtherAddress: TestField = createTestField({
  name: /Mailing address/i,
  dataStoreKey: "businessAddressSameAsOtherAddress",
  required: true,
  role: "radio",
  testValue: "mailing",
});
export const billingBusinessAddressSameAsOtherAddress: TestField = createTestField({
  name: /Billing address/i,
  dataStoreKey: "businessAddressSameAsOtherAddress",
  required: true,
  role: "radio",
  testValue: "billing",
});
export const differentBusinessAddressSameAsOtherAddress: TestField = createTestField({
  name: "I wish to enter a new address",
  dataStoreKey: "businessAddressSameAsOtherAddress",
  required: true,
  role: "radio",
  testValue: "different",
});

export const businessAddressFields = createTestFields([
  {
    name: "Street address *",
    dataStoreKey: "businessStreetAddress1",
    required: true,
    testValue: "Test address 1",
    withinGroupName: businessAddressQuestion,
    prerequisiteField: differentBusinessAddressSameAsOtherAddress,
  },
  {
    name: "Street address line 2",
    dataStoreKey: "businessStreetAddress2",
    required: false,
    testValue: "Test address 2",
    withinGroupName: businessAddressQuestion,
    prerequisiteField: differentBusinessAddressSameAsOtherAddress,
  },
  {
    name: "City *",
    dataStoreKey: "businessCity",
    required: true,
    testValue: "Test city",
    withinGroupName: businessAddressQuestion,
    prerequisiteField: differentBusinessAddressSameAsOtherAddress,
  },
  {
    name: "State *",
    dataStoreKey: "businessState",
    required: false,
    role: "combobox",
    testValue: "Pennsylvania",
    expectedValue: "PA",
    withinGroupName: businessAddressQuestion,
    prerequisiteField: differentBusinessAddressSameAsOtherAddress,
  },
  {
    name: "ZIP Code *",
    dataStoreKey: "businessZip",
    required: true,
    testValue: "12345",
    withinGroupName: businessAddressQuestion,
    prerequisiteField: differentBusinessAddressSameAsOtherAddress,
  },
]);

export const path1TestFields = [mailingBusinessAddressSameAsOtherAddress];
export const path2TestFields = [
  differentBusinessAddressSameAsOtherAddress,
  ...businessAddressFields,
];
