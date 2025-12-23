import { createTestField, type TestField } from "@/app/form/_utils/testUtils/sharedTests";

export const noIsEmployedByNj: TestField = createTestField({
  name: "No",
  dataStoreKey: "isEmployedByNj",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName: "Are you employed by the State of New Jersey? Select one *",
});

const yesIsEmployedByNj: TestField = createTestField({
  name: "Yes",
  dataStoreKey: "isEmployedByNj",
  required: true,
  role: "radio",
  testValue: "true",
  withinGroupName: "Are you employed by the State of New Jersey? Select one *",
});

export const noHasProvidedMedicaidServices: TestField = createTestField({
  name: "No",
  dataStoreKey: "hasProvidedMedicaidServices",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName:
    "Have you previously been approved to provide services under any state's Medicaid program, such as NJ FamilyCare? Select one *",
});

const yesHasProvidedMedicaidServices: TestField = createTestField({
  name: "Yes",
  dataStoreKey: "hasProvidedMedicaidServices",
  required: true,
  role: "radio",
  testValue: "true",
  withinGroupName:
    "Have you previously been approved to provide services under any state's Medicaid program, such as NJ FamilyCare? Select one *",
});

export const employedByNjExplanation = createTestField({
  name: "In a few words please explain your role with the State of New Jersey *",
  dataStoreKey: "employedByNjExplanation",
  required: true,
  testValue: "Test employed by state details",
  prerequisiteField: yesIsEmployedByNj,
  alternateRequiredFieldError: "This question is required",
});

export const medicaidServicesExplanation = createTestField({
  name: "What services did you provide and what is your current provider status? Please explain in a few words. *",
  dataStoreKey: "medicaidServicesExplanation",
  required: true,
  testValue: "Test medicaid details",
  prerequisiteField: yesHasProvidedMedicaidServices,
  alternateRequiredFieldError: "This question is required",
});

export const path1TestFields: Array<TestField> = [noIsEmployedByNj, noHasProvidedMedicaidServices];

export const firstRadioOptionTestFields: Array<TestField> = [
  yesIsEmployedByNj,
  yesHasProvidedMedicaidServices,
];

export const path2TestFields: Array<TestField> = [
  yesIsEmployedByNj,
  employedByNjExplanation,
  yesHasProvidedMedicaidServices,
  medicaidServicesExplanation,
];
