import { createTestField, type TestField } from "@/app/form/_utils/testUtils/testFields";

export const noHasDisqualification: TestField = createTestField({
  name: "No",
  dataStoreKey: "hasDisqualification",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName:
    "Have you ever been barred, disqualified, or faced any penalties in connection with Medicaid, Medicare, or any other government-funded or private health program? Select one *",
});

export const yesHasDisqualification: TestField = createTestField({
  name: "Yes",
  dataStoreKey: "hasDisqualification",
  required: true,
  role: "radio",
  testValue: "true",
  withinGroupName:
    "Have you ever been barred, disqualified, or faced any penalties in connection with Medicaid, Medicare, or any other government-funded or private health program? Select one *",
});

export const disqualificationExplanationField = createTestField({
  name: "In a few words, explain why you were barred, disqualified, or given penalties and the current status of your situation. *",
  dataStoreKey: "disqualificationExplanation",
  required: true,
  testValue: "Test explanation of disqualification",
  prerequisiteField: yesHasDisqualification,
  alternateRequiredFieldError: "This question is required",
});

export const noHasCompanyInvolvement: TestField = createTestField({
  name: "No",
  dataStoreKey: "hasCompanyInvolvement",
  required: true,
  role: "radio",
  testValue: "false",
  withinGroupName:
    "Does anyone on this application, or an immediate family member, have any involvement with a company that provides services for Medicaid, Medicare, or other health programs? Select one *",
});

const yesHasCompanyInvolvement: TestField = createTestField({
  name: "Yes",
  dataStoreKey: "hasCompanyInvolvement",
  required: true,
  role: "radio",
  testValue: "true",
  withinGroupName:
    "Does anyone on this application, or an immediate family member, have any involvement with a company that provides services for Medicaid, Medicare, or other health programs? Select one *",
});

export const companyInvolvementExplanationField = createTestField({
  name: "In a few words, explain your involvement with the company. *",
  dataStoreKey: "companyInvolvementExplanation",
  required: true,
  testValue: "Test explanation of company involvement",
  prerequisiteField: yesHasCompanyInvolvement,
  alternateRequiredFieldError: "This question is required",
});

export const path1TestFields: Array<TestField> = [noHasDisqualification, noHasCompanyInvolvement];
export const firstRadioOptionTestFields: Array<TestField> = [
  yesHasDisqualification,
  yesHasCompanyInvolvement,
];

export const path2TestFields: Array<TestField> = [
  yesHasDisqualification,
  disqualificationExplanationField,
  yesHasCompanyInvolvement,
  companyInvolvementExplanationField,
];
