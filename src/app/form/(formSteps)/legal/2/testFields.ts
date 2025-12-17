import { createTestField, type TestField } from "@/app/form/_utils/testUtils/sharedTests";

export const noHasCrimeCharge: TestField = createTestField({
  name: "No",
  dataStoreKey: "hasCrimeCharge",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName:
    "Have you ever been indicted or charged with a crime or a disorderly persons offense anywhere? Select one *",
});

export const yesHasCrimeCharge: TestField = createTestField({
  name: "Yes",
  dataStoreKey: "hasCrimeCharge",
  required: true,
  role: "radio",
  testValue: "true",
  withinGroupName:
    "Have you ever been indicted or charged with a crime or a disorderly persons offense anywhere? Select one *",
});

export const crimeChargeExplanationField = createTestField({
  name: "In a few words, please explain the charge or offense. *",
  dataStoreKey: "crimeChargeExplanation",
  required: true,
  testValue: "Test explanation of crime charge",
  prerequisiteField: yesHasCrimeCharge,
  alternateRequiredFieldError: "This question is required",
});

export const noHadLicenseSuspended: TestField = createTestField({
  name: "No",
  dataStoreKey: "hadLicenseSuspended",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName:
    "Have you ever had a professional license suspended or revoked, or faced disciplinary action or fines from any professional licensing authority? Select one *",
});

const yesHadLicenseSuspended: TestField = createTestField({
  name: "Yes",
  dataStoreKey: "hadLicenseSuspended",
  required: true,
  role: "radio",
  testValue: "true",
  withinGroupName:
    "Have you ever had a professional license suspended or revoked, or faced disciplinary action or fines from any professional licensing authority? Select one *",
});

export const licenseSuspendedExplanationField = createTestField({
  name: "In a few words, please explain the suspension, revocation, or disciplinary action. *",
  dataStoreKey: "licenseSuspendedExplanation",
  required: true,
  testValue: "Test explanation of license suspension",
  prerequisiteField: yesHadLicenseSuspended,
  alternateRequiredFieldError: "This question is required",
});

export const path1TestFields: Array<TestField> = [noHasCrimeCharge, noHadLicenseSuspended];
export const firstRadioOptionTestFields: Array<TestField> = [
  yesHasCrimeCharge,
  yesHadLicenseSuspended,
];

export const path2TestFields: Array<TestField> = [
  yesHasCrimeCharge,
  crimeChargeExplanationField,
  yesHadLicenseSuspended,
  licenseSuspendedExplanationField,
];
