import PersonalDetailsStep1 from "@/app/form/(formSteps)/personal-details/1/PersonalDetailsStep1";
import { renderWithRouter } from "@/app/form/_utils/testUtils/renderWithRouter";
import {
  createTestField,
  createTestFields,
  type TestField,
  testFillFromDataStore,
  testInvalidField,
  testRequiredField,
  testSaveFieldsToDataStore,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const dateOfBirthDayField = createTestField({
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
const dateOfBirthYearField = createTestField({
  name: "Year *",
  dataStoreKey: "dateOfBirthYear",
  required: true,
  testValue: "1988",
});

const socialSecurityNumberField = createTestField({
  name: "Social security number *",
  dataStoreKey: "socialSecurityNumber",
  required: true,
  testValue: "123456789",
  expectedValue: "123-45-6789",
  role: "textbox",
});

const personalIdentificationFields: Array<TestField> = [
  ...createTestFields([
    {
      name: "First name *",
      dataStoreKey: "firstName",
      required: true,
      testValue: "Test first name",
    },
    {
      name: "Middle name",
      dataStoreKey: "middleName",
      required: false,
      testValue: "Test middle name",
    },
    {
      name: "Last name *",
      dataStoreKey: "lastName",
      required: true,
      testValue: "Test last name",
    },
  ]),
  dateOfBirthDayField,
  dateOfBirthMonthField,
  dateOfBirthYearField,
  socialSecurityNumberField,
];

const emailField = createTestField({
  name: "Email address *",
  dataStoreKey: "email",
  testValue: "test@test.com",
  required: true,
});

const phoneNumberField = createTestField({
  name: "Phone number *",
  dataStoreKey: "phoneNumber",
  testValue: "3211234567",
  expectedValue: "321-123-4567",
  required: true,
});

const contactInformationFields: Array<TestField> = [emailField, phoneNumberField];

const allTestFields: Array<TestField> = [
  ...personalIdentificationFields,
  ...contactInformationFields,
];

describe("<PersonalDetailsStep1 />", () => {
  const renderFunction = () =>
    renderWithRouter(<PersonalDetailsStep1 />, "/form/personal-details/1");

  describe("personal identification fields", () => {
    it("saves fields to the data store on submit", async () => {
      await testSaveFieldsToDataStore(
        personalIdentificationFields,
        allTestFields,
        renderFunction,
        screen,
      );
    });

    it.each(personalIdentificationFields.filter((field) => field.required))(
      "marks $dataStoreKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, allTestFields, renderFunction, screen);
      },
    );

    it.each(personalIdentificationFields)(
      "fills $dataStoreKey from the data store when page is loaded",
      async (field: TestField) => {
        await testFillFromDataStore(field, renderFunction, screen);
      },
    );

    it.each([
      { invalidTestValue: "test", expectedErrorMessage: "Day must be a number" },
      { invalidTestValue: "0", expectedErrorMessage: "Day must be between 1 and 31" },
      { invalidTestValue: "50", expectedErrorMessage: "Day must be between 1 and 31" },
    ])(
      "displays an error message if date of birth day is the invalid format %s",
      async ({ invalidTestValue, expectedErrorMessage }) => {
        await testInvalidField(
          { ...dateOfBirthDayField, testValue: invalidTestValue },
          expectedErrorMessage,
          allTestFields,
          renderFunction,
          screen,
        );
      },
    );

    it.each([
      { invalidTestValue: "test", expectedErrorMessage: "Year must be a number" },
      { invalidTestValue: "1", expectedErrorMessage: "Year must have four digits" },
    ])(
      "displays an error message if date of birth year is the invalid format %s",
      async ({ invalidTestValue, expectedErrorMessage }) => {
        await testInvalidField(
          { ...dateOfBirthYearField, testValue: invalidTestValue },
          expectedErrorMessage,
          allTestFields,
          renderFunction,
          screen,
        );
      },
    );
  });

  describe("contact info fields", () => {
    it("saves fields to the data store on submit", async () => {
      await testSaveFieldsToDataStore(
        contactInformationFields,
        allTestFields,
        renderFunction,
        screen,
      );
    });

    it.each(contactInformationFields.filter((field) => field.required))(
      "marks $dataStoreKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, allTestFields, renderFunction, screen);
      },
    );

    it.each(contactInformationFields)(
      "fills $dataStoreKey from the data store when page is loaded",
      async (field: TestField) => {
        await testFillFromDataStore(field, renderFunction, screen);
      },
    );

    it("displays an error message if phoneNumber has too few digits", async () => {
      await testInvalidField(
        { ...phoneNumberField, testValue: "123" },
        "Entered value does not match phone number format",
        allTestFields,
        renderFunction,
        screen,
      );
    });

    it("displays an error message if socialSecurityNumber has too few digits", async () => {
      await testInvalidField(
        { ...socialSecurityNumberField, testValue: "123" },
        "Entered value does not match social security number format",
        allTestFields,
        renderFunction,
        screen,
      );
    });

    it.each([["invalid-email"], ["invalid@email"], ["invalid.email"]])(
      "displays an error message if email is the invalid format %s",
      async (invalidTestValue) => {
        await testInvalidField(
          { ...emailField, testValue: invalidTestValue },
          "Entered value does not match email format",
          allTestFields,
          renderFunction,
          screen,
        );
      },
    );
  });

  it.each([
    {
      name: "Social security number *",
      lowercaseName: "social security number",
    },
    {
      name: "Phone number *",
      lowercaseName: "phone number",
    },
  ])("prevents non-numeric inputs in $lowercaseName", async ({ name }) => {
    const user = userEvent.setup();
    renderFunction();
    const input = screen.getByRole("textbox", {
      name: name,
    });

    await user.type(input, "aaa");
    expect(input).toHaveValue("");
    await user.type(input, "!!");
    expect(input).toHaveValue("");
  });
});
