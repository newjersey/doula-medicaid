import InsuranceStep1 from "@/app/form/(formSteps)/insurance/1/InsuranceStep1";
import {
  amountPerAggregateField,
  amountPerOccurrenceField,
  coverageAmountFields,
  insuranceCoverageFields,
  insuranceEndDateDayField,
  insuranceEndDateYearField,
  insuranceStartDateDayField,
  insuranceStartDateYearField,
  testFields,
} from "@/app/form/(formSteps)/insurance/1/testFields";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { getInputField } from "@/app/form/_utils/testUtils/fillInputs";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  type TestField,
  testFillFromDataStore,
  testInvalidField,
  testRequiredField,
  testSaveFieldsToDataStore,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<InsuranceStep1 />", () => {
  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<InsuranceStep1 />, "/form/insurance/1", dataStore);

  describe("insurance coverage fields", () => {
    it("saves fields to the data store on submit", async () => {
      await testSaveFieldsToDataStore(insuranceCoverageFields, testFields, renderFunction, screen);
    });

    it.each(insuranceCoverageFields.filter((field) => field.required))(
      "marks $dataStoreKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, testFields, renderFunction, screen);
      },
    );

    it.each(insuranceCoverageFields)(
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
      "displays an error message if insurance start day is the invalid format %s",
      async ({ invalidTestValue, expectedErrorMessage }) => {
        await testInvalidField(
          { ...insuranceStartDateDayField, testValue: invalidTestValue },
          expectedErrorMessage,
          testFields,
          renderFunction,
          screen,
        );
      },
    );

    it.each([
      { invalidTestValue: "test", expectedErrorMessage: "Day must be a number" },
      { invalidTestValue: "0", expectedErrorMessage: "Day must be between 1 and 31" },
      { invalidTestValue: "50", expectedErrorMessage: "Day must be between 1 and 31" },
    ])(
      "displays an error message if insurance end day is the invalid format %s",
      async ({ invalidTestValue, expectedErrorMessage }) => {
        await testInvalidField(
          { ...insuranceEndDateDayField, testValue: invalidTestValue },
          expectedErrorMessage,
          testFields,
          renderFunction,
          screen,
        );
      },
    );

    it.each([
      { invalidTestValue: "test", expectedErrorMessage: "Year must be a number" },
      { invalidTestValue: "1", expectedErrorMessage: "Year must have four digits" },
    ])(
      "displays an error message if insurance start year is the invalid format %s",
      async ({ invalidTestValue, expectedErrorMessage }) => {
        await testInvalidField(
          { ...insuranceStartDateYearField, testValue: invalidTestValue },
          expectedErrorMessage,
          testFields,
          renderFunction,
          screen,
        );
      },
    );

    it.each([
      { invalidTestValue: "test", expectedErrorMessage: "Year must be a number" },
      { invalidTestValue: "1", expectedErrorMessage: "Year must have four digits" },
    ])(
      "displays an error message if insurance end year is the invalid format %s",
      async ({ invalidTestValue, expectedErrorMessage }) => {
        await testInvalidField(
          { ...insuranceEndDateYearField, testValue: invalidTestValue },
          expectedErrorMessage,
          testFields,
          renderFunction,
          screen,
        );
      },
    );
  });

  describe("coverage amount fields", () => {
    it("saves fields to the data store on submit", async () => {
      await testSaveFieldsToDataStore(coverageAmountFields, testFields, renderFunction, screen);
    });

    it.each(coverageAmountFields.filter((field) => field.required))(
      "marks $dataStoreKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, testFields, renderFunction, screen);
      },
    );

    it.each(coverageAmountFields)(
      "fills $dataStoreKey from the data store when page is loaded",
      async (field: TestField) => {
        await testFillFromDataStore(field, renderFunction, screen);
      },
    );

    it.each([
      {
        invalidTestValue: "999999",
        expectedErrorMessage:
          "Your coverage is not enough. You need $1,000,000 minimum coverage per occurrence to qualify.",
      },
    ])(
      "displays an error message if amount per aggregate is the invalid format %s",
      async ({ invalidTestValue, expectedErrorMessage }) => {
        await testInvalidField(
          { ...amountPerOccurrenceField, testValue: invalidTestValue },
          expectedErrorMessage,
          testFields,
          renderFunction,
          screen,
        );
      },
    );

    it.each([
      {
        invalidTestValue: "2999999",
        expectedErrorMessage:
          "Your coverage is not enough. You need a minimum aggregate coverage of $3,000,000 to qualify.",
      },
    ])(
      "displays an error message if amount per aggregate is the invalid format %s",
      async ({ invalidTestValue, expectedErrorMessage }) => {
        await testInvalidField(
          { ...amountPerAggregateField, testValue: invalidTestValue },
          expectedErrorMessage,
          testFields,
          renderFunction,
          screen,
        );
      },
    );

    it.each([amountPerOccurrenceField, amountPerAggregateField])(
      "prevents non-numeric inputs in $dataStoreKey",
      async (testField) => {
        const user = userEvent.setup();
        renderFunction();
        const input = await getInputField(screen, testField);

        await user.type(input, "aaa");
        expect(input).toHaveValue("");
        await user.type(input, "!!");
        expect(input).toHaveValue("");
        await user.type(input, "11");
        expect(input).toHaveValue("11");
      },
    );
  });

  describe("insurance coverage explainer", () => {
    it("orders the insurance coverage explainer immediately after the end date year question", async () => {
      const user = userEvent.setup();
      renderFunction();

      const insuranceEndDateYear = await getInputField(screen, insuranceEndDateYearField);
      await user.click(insuranceEndDateYear);
      expect(insuranceEndDateYear).toHaveFocus();
      await user.tab();
      const insuranceCoverageExplainer = screen.getByRole("button", {
        name: "Where should I get my doula liability insurance?",
      });
      expect(insuranceCoverageExplainer).toHaveFocus();
    });

    it("has a heading level one greater than the section heading level", () => {
      renderFunction();
      const sectionHeadingLevel = 2;
      const insuranceCoverageSectionHeading = screen.getByRole("heading", {
        name: "Your insurance coverage",
        level: sectionHeadingLevel,
      });
      expect(insuranceCoverageSectionHeading).toBeInTheDocument();
      const coverageAmountSectionHeading = screen.getByRole("heading", {
        name: "Coverage amount",
        level: sectionHeadingLevel,
      });
      expect(coverageAmountSectionHeading).toBeInTheDocument();
      const insuranceCoverageExplainer = screen.getByRole("heading", {
        name: "Where should I get my doula liability insurance?",
        level: sectionHeadingLevel + 1,
      });
      expect(insuranceCoverageExplainer).toBeInTheDocument();
    });
  });

  describe("coverage amount explainer", () => {
    it("orders the insurance coverage explainer immediately after the end date year question", async () => {
      const user = userEvent.setup();
      renderFunction();

      const amountPerAggregate = await getInputField(screen, amountPerAggregateField);
      await user.click(amountPerAggregate);
      expect(amountPerAggregate).toHaveFocus();
      await user.tab();
      const coverageAmountExplainer = screen.getByRole("button", {
        name: `What is "amount per occurrence" and "amount per aggregate"?`,
      });
      expect(coverageAmountExplainer).toHaveFocus();
    });

    it("has a heading level one greater than the section heading level", () => {
      renderFunction();
      const sectionHeadingLevel = 2;
      const insuranceCoverageSectionHeading = screen.getByRole("heading", {
        name: "Your insurance coverage",
        level: sectionHeadingLevel,
      });
      expect(insuranceCoverageSectionHeading).toBeInTheDocument();
      const coverageAmountSectionHeading = screen.getByRole("heading", {
        name: "Coverage amount",
        level: sectionHeadingLevel,
      });
      expect(coverageAmountSectionHeading).toBeInTheDocument();
      const coverageAmountExplainer = screen.getByRole("heading", {
        name: `What is "amount per occurrence" and "amount per aggregate"?`,
        level: sectionHeadingLevel + 1,
      });
      expect(coverageAmountExplainer).toBeInTheDocument();
    });
  });
});
