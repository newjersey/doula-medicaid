import { createTestField, type TestField } from "@/app/form/_utils/testUtils/sharedTests";

const noHasBeenExcludedFromMedicaid: TestField = createTestField({
  name: "No",
  dataStoreKey: "hasBeenExcludedFromMedicaid",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName:
    "Have you ever been excluded or suspended by OIG (Office of Inspector General) from participation in Medicare, Medicaid/NJ FamilyCare, or CHIP? Select one *",
});

const yesHasBeenExcludedFromMedicaid: TestField = createTestField({
  name: "Yes",
  dataStoreKey: "hasBeenExcludedFromMedicaid",
  required: true,
  role: "radio",
  testValue: "true",
  withinGroupName:
    "Have you ever been excluded or suspended by OIG (Office of Inspector General) from participation in Medicare, Medicaid/NJ FamilyCare, or CHIP? Select one *",
});

const noHasBeenSuspendedFromMedicaid: TestField = createTestField({
  name: "No",
  dataStoreKey: "hasBeenSuspendedFromMedicaid",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName:
    "Have you ever had Medicare, Medicaid/NJ FamilyCare, or CHIP enrollment/participation suspended, denied, revoked, or terminated? Select one *",
});

const yesHasBeenSuspendedFromMedicaid: TestField = createTestField({
  name: "Yes",
  dataStoreKey: "hasBeenSuspendedFromMedicaid",
  required: true,
  role: "radio",
  testValue: "true",
  withinGroupName:
    "Have you ever had Medicare, Medicaid/NJ FamilyCare, or CHIP enrollment/participation suspended, denied, revoked, or terminated? Select one *",
});

export const testFields: Array<TestField> = [
  noHasBeenExcludedFromMedicaid,
  noHasBeenSuspendedFromMedicaid,
];
export const firstRadioOptionTestFields: Array<TestField> = [
  yesHasBeenExcludedFromMedicaid,
  yesHasBeenSuspendedFromMedicaid,
];
