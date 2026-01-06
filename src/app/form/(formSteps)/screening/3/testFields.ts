import { createTestField, type TestField } from "@/app/form/_utils/testUtils/testFields";

const noHaveOtherBusinessOwnerNextYear = createTestField({
  name: "No",
  role: "radio",
  required: true,
  dataStoreKey: "haveOtherBusinessOwnerNextYear",
  testValue: "false",
  withinGroupName:
    "Do you anticipate anyone else having a percentage of your business in the next year? Select one *",
});
export const yesHaveOtherBusinessOwnerNextYear = createTestField({
  name: "Yes",
  role: "radio",
  required: true,
  dataStoreKey: "haveOtherBusinessOwnerNextYear",
  testValue: "true",
  withinGroupName:
    "Do you anticipate anyone else having a percentage of your business in the next year? Select one *",
});

const noHadDhmasBusiness = createTestField({
  name: "No",
  role: "radio",
  required: true,
  dataStoreKey: "hadDhmasBusiness",
  testValue: "false",
  withinGroupName:
    "In the last 5 years, have you owned any percentage of companies that do business with the Division of Medical Assistance and Health Services? Select one *",
});
export const yesHadDhmasBusiness = createTestField({
  name: "Yes",
  role: "radio",
  required: true,
  dataStoreKey: "hadDhmasBusiness",
  testValue: "true",
  withinGroupName:
    "In the last 5 years, have you owned any percentage of companies that do business with the Division of Medical Assistance and Health Services? Select one *",
});

export const testFields: Array<TestField> = [noHaveOtherBusinessOwnerNextYear, noHadDhmasBusiness];
