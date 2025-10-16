import { createTestField, type TestField } from "@/app/form/_utils/testUtils/sharedTests";

export const dateOfBirthDayField = createTestField({
  name: "Day *",
  dataStoreKey: "dateOfBirthDay",
  required: true,
  testValue: "6",
});
const dateOfBirthMonthField = createTestField({
  name: "Month *",
  dataStoreKey: "dateOfBirthMonth",
  required: true,
  testValue: "07 - July",
  expectedValue: "7",
  role: "combobox",
});
export const dateOfBirthYearField = createTestField({
  name: "Year *",
  dataStoreKey: "dateOfBirthYear",
  required: true,
  testValue: "1988",
});

export const socialSecurityNumberField = createTestField({
  name: "Social security number *",
  dataStoreKey: "socialSecurityNumber",
  required: true,
  testValue: "123456789",
  expectedValue: "123-45-6789",
  role: "textbox",
});

export const firstNameField = createTestField({
  name: "First name *",
  dataStoreKey: "firstName",
  required: true,
  testValue: "Test first name",
});
export const middleNameField = createTestField({
  name: "Middle name",
  dataStoreKey: "middleName",
  required: false,
  testValue: "Test middle name",
});
export const lastNameField = createTestField({
  name: "Last name *",
  dataStoreKey: "lastName",
  required: true,
  testValue: "Test last name",
});

export const personalIdentificationFields: Array<TestField> = [
  firstNameField,
  middleNameField,
  lastNameField,
  dateOfBirthDayField,
  dateOfBirthMonthField,
  dateOfBirthYearField,
  socialSecurityNumberField,
];

export const emailField = createTestField({
  name: "Email address *",
  dataStoreKey: "email",
  testValue: "test@test.com",
  required: true,
});

export const phoneNumberField = createTestField({
  name: "Phone number *",
  dataStoreKey: "phoneNumber",
  testValue: "3211234567",
  expectedValue: "321-123-4567",
  required: true,
});

export const contactInformationFields: Array<TestField> = [emailField, phoneNumberField];

export const testFields: Array<TestField> = [
  ...personalIdentificationFields,
  ...contactInformationFields,
];
