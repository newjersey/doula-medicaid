import { type TestField } from "@/app/form/_utils/testUtils/sharedTests";

const noHasBeenExcludedFromMedicaid: TestField = {
  name: "No",
  dataStoreKey: "hasBeenExcludedFromMedicaid",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "false",
  expectedValue: "false",
  withinGroupName:
    "Have you ever been excluded or suspended by OIG (Office of Inspector General) from participation in Medicare, Medicaid/NJ FamilyCare, or CHIP? Select one *",
};

const yesHasBeenExcludedFromMedicaid: TestField = {
  name: "Yes",
  dataStoreKey: "hasBeenExcludedFromMedicaid",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "true",
  expectedValue: "true",
  withinGroupName:
    "Have you ever been excluded or suspended by OIG (Office of Inspector General) from participation in Medicare, Medicaid/NJ FamilyCare, or CHIP? Select one *",
};

const noHasBeenSuspendedFromMedicaid: TestField = {
  name: "No",
  dataStoreKey: "hasBeenSuspendedFromMedicaid",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "false",
  expectedValue: "false",
  withinGroupName:
    "Have you ever had Medicare, Medicaid/NJ FamilyCare, or CHIP enrollment/participation suspended, denied, revoked, or terminated? Select one *",
};

const yesHasBeenSuspendedFromMedicaid: TestField = {
  name: "Yes",
  dataStoreKey: "hasBeenSuspendedFromMedicaid",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "true",
  expectedValue: "true",
  withinGroupName:
    "Have you ever had Medicare, Medicaid/NJ FamilyCare, or CHIP enrollment/participation suspended, denied, revoked, or terminated? Select one *",
};

export const minimalTestFields: Array<TestField> = [
  yesHasBeenExcludedFromMedicaid,
  yesHasBeenSuspendedFromMedicaid,
];
export const maximalTestFields: Array<TestField> = [
  noHasBeenExcludedFromMedicaid,
  noHasBeenSuspendedFromMedicaid,
  yesHasBeenExcludedFromMedicaid,
  yesHasBeenSuspendedFromMedicaid,
];
