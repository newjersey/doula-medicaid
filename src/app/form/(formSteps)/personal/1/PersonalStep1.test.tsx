import PersonalStep1 from "@/app/form/(formSteps)/personal/1/PersonalStep1";
import {
  contactInformationFields,
  emailField,
  personalIdentificationFields,
  phoneNumberField,
  socialSecurityNumberField,
  testFields,
} from "@/app/form/(formSteps)/personal/1/testFields";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  testFillFromDataStore,
  testInvalidField,
  testRequiredField,
  testSaveFieldsToDataStore,
} from "@/app/form/_utils/testUtils/sharedTests";
import type { TestField } from "@/app/form/_utils/testUtils/testFields";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<PersonalStep1 />", () => {
  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<PersonalStep1 />, "/form/personal/1", dataStore);

  describe("personal identification fields", () => {
    it("saves fields to the data store on submit", async () => {
      await testSaveFieldsToDataStore(
        personalIdentificationFields,
        testFields,
        renderFunction,
        screen,
      );
    });

    it.each(personalIdentificationFields.filter((field) => field.required))(
      "marks $dataStoreKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, testFields, renderFunction, screen);
      },
    );

    it.each(personalIdentificationFields)(
      "fills $dataStoreKey from the data store when page is loaded",
      async (field: TestField) => {
        await testFillFromDataStore(field, renderFunction, screen);
      },
    );
  });

  describe("contact info fields", () => {
    it("saves fields to the data store on submit", async () => {
      await testSaveFieldsToDataStore(contactInformationFields, testFields, renderFunction, screen);
    });

    it.each(contactInformationFields.filter((field) => field.required))(
      "marks $dataStoreKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, testFields, renderFunction, screen);
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
        testFields,
        renderFunction,
        screen,
      );
    });

    it("displays an error message if socialSecurityNumber has too few digits", async () => {
      await testInvalidField(
        { ...socialSecurityNumberField, testValue: "123" },
        "Entered value does not match Social Security Number format",
        testFields,
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
          testFields,
          renderFunction,
          screen,
        );
      },
    );
  });

  it.each([
    {
      name: "Social Security Number *",
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
