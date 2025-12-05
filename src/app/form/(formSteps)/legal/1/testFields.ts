import {
  createTestField,
  createTestFields,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";

export const noEmployedByState: TestField = createTestField({
  name: "No",
  dataStoreKey: "employedByState",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName: "Are you employed by the State of New Jersey? *",
});

export const yesEmployedByState: TestField = createTestField({
  name: "No",
  dataStoreKey: "employedByState",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName: "Are you employed by the State of New Jersey? *",
});

export const noApprovedForMedicaidProgram: TestField = createTestField({
  name: "No",
  dataStoreKey: "approvedForMedicaidProgram",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName:
    "Have you previously been approved to provide services under any state's Medicaid program, such as NJ FamilyCare?",
});

export const yesApprovedForMedicaidProgram: TestField = createTestField({
  name: "No",
  dataStoreKey: "approvedForMedicaidProgram",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName:
    "Have you previously been approved to provide services under any state's Medicaid program, such as NJ FamilyCare?",
});

export const employedByStateDetails: TestField[] = createTestFields([
  {
    name: "In a few words please explain your role with the State of New Jersey *",
    required: true,
    dataStoreKey: "usersRoleWithState",
    testValue: "Test role in New Jersey.",
  },
]);

export const approvedForMedicaidDetails: TestField[] = createTestFields([
  {
    name: "What services did you provide and what is your current provider status? Please explain in a few words. *",
    required: true,
    dataStoreKey: "usersServicesProvided",
    testValue: "Test services provided.",
  },
]);

export const path1TestFields: Array<TestField> = [noEmployedByState, noApprovedForMedicaidProgram];
export const firstRadioOptionTestFields: Array<TestField> = [
  yesEmployedByState,
  yesApprovedForMedicaidProgram,
];

export const path2TestFields: Array<TestField> = [
  yesEmployedByState,
  ...employedByStateDetails,
  yesApprovedForMedicaidProgram,
  ...approvedForMedicaidDetails,
];
