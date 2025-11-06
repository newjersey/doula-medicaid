import { createTestFields, type TestField } from "@/app/form/_utils/testUtils/sharedTests";

const insuranceAddressGroupName =
  "Insurance address This is the office location of your insurance carrier.";

export const insuranceDetailsFields: TestField[] = createTestFields([
  {
    name: "Name of your insurance carrier *",
    required: true,
    dataStoreKey: "insuranceCarrierName",
    testValue: "Test insurance carrier",
  },
  {
    name: "Policy number *",
    required: true,
    dataStoreKey: "insurancePolicyNumber",
    testValue: "ABC-12345",
  },
]);

export const insuranceAddressFields: TestField[] = createTestFields([
  {
    name: "Street address *",
    required: true,
    dataStoreKey: "insuranceStreetAddress1",
    testValue: "Test insurance address 1",
    withinGroupName: insuranceAddressGroupName,
  },
  {
    name: "Street address line 2",
    required: false,
    dataStoreKey: "insuranceStreetAddress2",
    testValue: "Test insurance address 2",
    withinGroupName: insuranceAddressGroupName,
  },
  {
    name: "City *",
    required: true,
    dataStoreKey: "insuranceCity",
    testValue: "Test insurance city",
    withinGroupName: insuranceAddressGroupName,
  },
  {
    name: "State *",
    required: false,
    role: "combobox",
    testValue: "NJ",
    dataStoreKey: "insuranceState",
    withinGroupName: insuranceAddressGroupName,
  },
  {
    name: "ZIP Code *",
    required: true,
    dataStoreKey: "insuranceZip",
    testValue: "12345",
    withinGroupName: insuranceAddressGroupName,
  },
]);

export const testFields = [...insuranceDetailsFields, ...insuranceAddressFields];
