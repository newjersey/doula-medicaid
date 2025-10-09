import { type TestField } from "@/app/form/_utils/testUtils/sharedTests";

export const yesHasEin: TestField = {
  name: "Yes",
  dataStoreKey: "hasEin",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "true",
  expectedValue: "true",
  withinGroupName: "Do you have an Employee Identification Number (EIN)? Select one *",
};
export const noHasEin: TestField = {
  name: "No",
  dataStoreKey: "hasEin",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "false",
  expectedValue: "false",
  withinGroupName: "Do you have an Employee Identification Number (EIN)? Select one *",
};

export const minimalTestFields = [noHasEin];

export const einField: TestField = {
  name: "EIN *",
  dataStoreKey: "ein",
  required: true,
  requiredErrorMessage: "EIN is required",
  role: "textbox",
  testValue: "111111111",
  expectedValue: "11-1111111",
  prerequisiteField: yesHasEin,
};

export const maximalTestFields = [yesHasEin, einField];
