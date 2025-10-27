import { type TestField } from "@/app/form/_utils/testUtils/sharedTests";

const noHasUncollectedDebt: TestField = {
  name: "No",
  dataStoreKey: "hasUncollectedDebt",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "false",
  expectedValue: "false",
  withinGroupName:
    "Do you have any uncollected debt to Medicare, Medicaid/NJ FamilyCare, or CHIP (Children's Health Insurance Program)? Select one *",
};

const yesHasUncollectedDebt: TestField = {
  name: "Yes",
  dataStoreKey: "hasUncollectedDebt",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "true",
  expectedValue: "true",
  withinGroupName:
    "Do you have any uncollected debt to Medicare, Medicaid/NJ FamilyCare, or CHIP (Children's Health Insurance Program)? Select one *",
};

const noIsSubjectToPaymentSuspension: TestField = {
  name: "No",
  dataStoreKey: "isSubjectToPaymentSuspension",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "false",
  expectedValue: "false",
  withinGroupName:
    "Have you ever been subject to a payment suspension under a federal health care program? Select one *",
};

const yesIsSubjectToPaymentSuspension: TestField = {
  name: "Yes",
  dataStoreKey: "isSubjectToPaymentSuspension",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "true",
  expectedValue: "true",
  withinGroupName:
    "Have you ever been subject to a payment suspension under a federal health care program? Select one *",
};

export const minimalTestFields: Array<TestField> = [
  yesHasUncollectedDebt,
  yesIsSubjectToPaymentSuspension,
];
export const maximalTestFields: Array<TestField> = [
  noHasUncollectedDebt,
  noIsSubjectToPaymentSuspension,
  yesHasUncollectedDebt,
  yesIsSubjectToPaymentSuspension,
];
