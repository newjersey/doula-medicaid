import { createTestField, type TestField } from "@/app/form/_utils/testUtils/sharedTests";

export const noEmployedByState: TestField = createTestField({
  name: "No",
  dataStoreKey: "employedByState",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName: "Are you employed by the State of New Jersey? Select one *",
});

const yesEmployedByState: TestField = createTestField({
  name: "Yes",
  dataStoreKey: "employedByState",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName: "Are you employed by the State of New Jersey? Select one *",
});

export const noApprovedForMedicaidProgram: TestField = createTestField({
  name: "No",
  dataStoreKey: "approvedForMedicaidProgram",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName:
    "Have you previously been approved to provide services under any state's Medicaid program, such as NJ FamilyCare? Select one *",
});

const yesApprovedForMedicaidProgram: TestField = createTestField({
  name: "Yes",
  dataStoreKey: "approvedForMedicaidProgram",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName:
    "Have you previously been approved to provide services under any state's Medicaid program, such as NJ FamilyCare? Select one *",
});

export const employedByStateDetails = createTestField({
  name: "In a few words please explain your role with the State of New Jersey *",
  dataStoreKey: "employedByStateDetails",
  required: true,
  testValue: "Test employed by state details",
  prerequisiteField: yesEmployedByState,
  alternateRequiredFieldError: "This question is required",
});

export const approvedForMedicaidDetails = createTestField({
  name: "What services did you provide and what is your current provider status? Please explain in a few words. *",
  dataStoreKey: "medicaidDetails",
  required: true,
  testValue: "Test medicaid details",
  prerequisiteField: yesApprovedForMedicaidProgram,
  alternateRequiredFieldError: "This question is required",
});

export const path1TestFields: Array<TestField> = [noEmployedByState, noApprovedForMedicaidProgram];

export const firstRadioOptionTestFields: Array<TestField> = [
  yesEmployedByState,
  yesApprovedForMedicaidProgram,
];

export const path2TestFields: Array<TestField> = [
  yesEmployedByState,
  employedByStateDetails,
  yesApprovedForMedicaidProgram,
  approvedForMedicaidDetails,
];
