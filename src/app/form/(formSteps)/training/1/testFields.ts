import {
  createTestField,
  createTestFields,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";

const trainingAddressGroupName = "What is the address of your training organization? *";

export const childrensFuturesTrainingOrganization: TestField = createTestField({
  name: "Which state-approved training did you complete? Select one *",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "combobox",
  testValue: "Children's Futures (Trenton)",
  dataStoreKey: "stateApprovedTraining",
});

export const noneTrainingOrganization: TestField = createTestField({
  name: "Which state-approved training did you complete? Select one *",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "combobox",
  testValue: "None of these",
  dataStoreKey: "stateApprovedTraining",
});

export const nameOfTrainingOrganization: TestField = createTestField({
  name: "What is the name of your training organization? *",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "textbox",
  testValue: "Test organization",
  dataStoreKey: "nameOfTrainingOrganization",
  prerequisiteField: noneTrainingOrganization,
});

export const yesDoulaTrainingInPerson: TestField = createTestField({
  name: "Yes, in person or hybrid",
  dataStoreKey: "isDoulaTrainingInPerson",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "radio",
  testValue: "true",
  withinGroupName: "Did you attend your doula training classes in person? Select one *",
});

export const noDoulaTrainingInPerson: TestField = createTestField({
  name: "No, it was virtual",
  dataStoreKey: "isDoulaTrainingInPerson",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "radio",
  testValue: "false",
  withinGroupName: "Did you attend your doula training classes in person? Select one *",
});

export const trainingAddressFields: TestField[] = createTestFields([
  {
    name: "Street address *",
    required: true,
    dataStoreKey: "trainingStreetAddress1",
    alternateRequiredFieldError: "Training street address is required",
    testValue: "Test address 1",
    withinGroupName: trainingAddressGroupName,
    prerequisiteField: yesDoulaTrainingInPerson,
  },
  {
    name: "Street address line 2",
    required: false,
    dataStoreKey: "trainingStreetAddress2",
    testValue: "Test address 2",
    withinGroupName: trainingAddressGroupName,
    prerequisiteField: yesDoulaTrainingInPerson,
  },
  {
    name: "City *",
    required: true,
    alternateRequiredFieldError: "Training city is required",
    dataStoreKey: "trainingCity",
    testValue: "Test city",
    withinGroupName: trainingAddressGroupName,
    prerequisiteField: yesDoulaTrainingInPerson,
  },
  {
    name: "State *",
    required: false,
    alternateRequiredFieldError: "Training state is required",
    role: "combobox",
    testValue: "NJ",
    dataStoreKey: "trainingState",
    withinGroupName: trainingAddressGroupName,
    prerequisiteField: yesDoulaTrainingInPerson,
  },
  {
    name: "ZIP Code *",
    required: true,
    alternateRequiredFieldError: "Training ZIP Code is required",
    dataStoreKey: "trainingZip",
    testValue: "12345",
    withinGroupName: trainingAddressGroupName,
    prerequisiteField: yesDoulaTrainingInPerson,
  },
]);

export const trainingInstructorFields: TestField[] = createTestFields([
  {
    name: "First name *",
    required: true,
    dataStoreKey: "instructorFirstName",
    testValue: "Jane",
  },
  {
    name: "Last name *",
    required: true,
    dataStoreKey: "instructorLastName",
    testValue: "Doe",
  },
  {
    name: "Email address *",
    required: true,
    dataStoreKey: "instructorEmail",
    testValue: "test@example.com",
  },
  {
    name: "Phone number",
    required: false,
    dataStoreKey: "instructorPhoneNumber",
    testValue: "111-111-1111",
  },
]);

export const minimalTestFields = [
  childrensFuturesTrainingOrganization,
  noDoulaTrainingInPerson,
  ...trainingInstructorFields,
];

export const maximalTestFields = [
  noneTrainingOrganization,
  nameOfTrainingOrganization,
  yesDoulaTrainingInPerson,
  ...trainingAddressFields,
  ...trainingInstructorFields,
];
