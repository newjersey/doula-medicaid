import { createTestField, type TestField } from "@/app/form/_utils/testUtils/testFields";

const noHasUncollectedDebt: TestField = createTestField({
  name: "No",
  dataStoreKey: "hasUncollectedDebt",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName:
    "Do you have any uncollected debt to Medicare, Medicaid/NJ FamilyCare, or CHIP (Children's Health Insurance Program)? Select one *",
});

const yesHasUncollectedDebt: TestField = createTestField({
  name: "Yes",
  dataStoreKey: "hasUncollectedDebt",
  required: true,
  role: "radio",
  testValue: "true",
  withinGroupName:
    "Do you have any uncollected debt to Medicare, Medicaid/NJ FamilyCare, or CHIP (Children's Health Insurance Program)? Select one *",
});

const noIsSubjectToPaymentSuspension: TestField = createTestField({
  name: "No",
  dataStoreKey: "isSubjectToPaymentSuspension",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName:
    "Have you ever been subject to a payment suspension under a federal health care program? Select one *",
});

const yesIsSubjectToPaymentSuspension: TestField = createTestField({
  name: "Yes",
  dataStoreKey: "isSubjectToPaymentSuspension",
  required: true,
  role: "radio",
  testValue: "true",
  withinGroupName:
    "Have you ever been subject to a payment suspension under a federal health care program? Select one *",
});

export const testFields: Array<TestField> = [noHasUncollectedDebt, noIsSubjectToPaymentSuspension];
export const firstRadioOptionTestFields: Array<TestField> = [
  yesHasUncollectedDebt,
  yesIsSubjectToPaymentSuspension,
];
