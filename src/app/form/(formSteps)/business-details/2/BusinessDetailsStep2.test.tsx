import BusinessDetailsStep2 from "@/app/form/(formSteps)/business-details/2/BusinessDetailsStep2";
import { fillField, getInputField } from "@/app/form/_utils/testUtils/fillInputs";
import { renderWithRouter } from "@/app/form/_utils/testUtils/renderWithRouter";
import {
  testConditionalRender,
  testFillFromDataStore,
  testInvalidField,
  testRequiredField,
  testSaveFieldsToDataStore,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const yesHasEin: TestField = {
  name: "Yes",
  dataStoreKey: "hasEin",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "true",
  expectedValue: "true",
  withinGroupName: "Do you have an Employee Identification Number (EIN)? Select one *",
};
const noHasEin: TestField = {
  name: "No",
  dataStoreKey: "hasEin",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "false",
  expectedValue: "false",
  withinGroupName: "Do you have an Employee Identification Number (EIN)? Select one *",
};

const minimalTestFields = [noHasEin];

const einField: TestField = {
  name: "EIN *",
  dataStoreKey: "ein",
  required: true,
  requiredErrorMessage: "EIN is required",
  role: "textbox",
  testValue: "111111111",
  expectedValue: "11-1111111",
  prerequisiteField: yesHasEin,
};

const allTestFields = [yesHasEin, einField];

describe("<BusinessDetailsStep2 />", () => {
  const renderFunction = () =>
    renderWithRouter(<BusinessDetailsStep2 />, "/form/business-details/2");

  describe("saves fields to the data store on submit", () => {
    it("when the user does not have an EIN", async () => {
      await testSaveFieldsToDataStore(minimalTestFields, minimalTestFields, renderFunction, screen);
    });
    it("when the user does has an EIN", async () => {
      await testSaveFieldsToDataStore(allTestFields, allTestFields, renderFunction, screen);
    });
  });
  describe("marks fields as required and displays an error message", () => {
    it("when hasEin is not filled in", async () => {
      await testRequiredField(yesHasEin, minimalTestFields, renderFunction, screen);
    });

    it("when the user has an EIN and EIN is not filled in", async () => {
      await testRequiredField(einField, allTestFields, renderFunction, screen);
    });
  });

  it.each(allTestFields)(
    "fills $dataStoreKey from the data store when page is loaded",
    async (field: TestField) => {
      await testFillFromDataStore(field, renderFunction, screen);
    },
  );

  it("conditionally renders EIN based on hasEin", async () => {
    await testConditionalRender(einField, noHasEin, renderFunction, screen);
  });

  it("displays an error message if EIN has too few digits", async () => {
    await testInvalidField(
      { ...einField, testValue: "111" },
      "Entered value does not match the EIN format",
      allTestFields,
      renderFunction,
      screen,
    );
  });

  it("prevents non-numeric inputs in EIN", async () => {
    const user = userEvent.setup();
    renderFunction();
    await fillField(screen, user, yesHasEin);
    const input = screen.getByRole("textbox", {
      name: "EIN *",
    });

    await user.type(input, "aaa");
    expect(input).toHaveValue("");
    await user.type(input, "!!");
    expect(input).toHaveValue("");
  });

  describe("EIN explainer", () => {
    it("orders the EIN explainer immediately after the EIN input", async () => {
      const user = userEvent.setup();
      renderFunction();

      const noHasEinInput = await getInputField(screen, noHasEin);
      await user.click(noHasEinInput);
      expect(noHasEinInput).toHaveFocus();

      await user.tab();
      const einExplainer = screen.getByRole("button", {
        name: "What is an Employee Identification Number (EIN)?",
      });
      expect(einExplainer).toHaveFocus();
    });

    it("has a heading level one greater than the section heading level", () => {
      renderFunction();
      const sectionHeadingLevel = 2;
      const einSectionHeading = screen.getByRole("heading", {
        name: "Tax ID",
        level: sectionHeadingLevel,
      });
      expect(einSectionHeading).toBeInTheDocument();
      const einExplainer = screen.getByRole("heading", {
        name: "What is an Employee Identification Number (EIN)?",
        level: sectionHeadingLevel + 1,
      });
      expect(einExplainer).toBeInTheDocument();
    });
  });
});
