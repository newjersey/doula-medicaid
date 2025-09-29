import InsuranceStep1 from "@/app/form/(formSteps)/insurance/1/InsuranceStep1";
import { getInputField } from "@/app/form/_utils/testUtils/fillInputs";
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

const insuranceStartDateDayField = createTestField({
  name: "Day *",
  dataStoreKey: "insuranceStartDateDay",
  required: true,
  testValue: "6",
  withinGroupName: "Start date *",
});

const insuranceStartDateMonthField = createTestField({
  name: "Month *",
  dataStoreKey: "insuranceStartDateMonth",
  required: true,
  testValue: "07 - July",
  expectedValue: "7",
  role: "combobox",
  withinGroupName: "Start date *",
});

const insuranceStartDateYearField = createTestField({
  name: "Year *",
  dataStoreKey: "insuranceStartDateYear",
  required: true,
  testValue: "1988",
  withinGroupName: "Start date *",
});

const insuranceEndDateDayField = createTestField({
  name: "Day *",
  dataStoreKey: "insuranceEndDateDay",
  required: true,
  testValue: "30",
  withinGroupName: "End date *",
});

const insuranceEndDateMonthField = createTestField({
  name: "Month *",
  dataStoreKey: "insuranceEndDateMonth",
  required: true,
  testValue: "02 - February",
  expectedValue: "2",
  role: "combobox",
  withinGroupName: "End date *",
});

const insuranceEndDateYearField = createTestField({
  name: "Year *",
  dataStoreKey: "insuranceEndDateYear",
  required: true,
  testValue: "2025",
  withinGroupName: "End date *",
});

const insuranceCoverageFields: Array<TestField> = createTestFields([
  insuranceStartDateDayField,
  insuranceStartDateMonthField,
  insuranceStartDateYearField,
  insuranceEndDateDayField,
  insuranceEndDateMonthField,
  insuranceEndDateYearField,
]);

const amountPerOccurrenceField: TestField = {
  name: "Amount per occurrence *",
  dataStoreKey: "insuranceOccurenceAmount",
  requiredErrorMessage: "Amount per occurrence is required",
  role: "textbox",
  required: true,
  testValue: "1000005",
  expectedValue: "1000005",
};

const amountPerAggregateField: TestField = {
  name: "Amount per aggregate *",
  dataStoreKey: "insuranceAggregateAmount",
  requiredErrorMessage: "Amount per aggregate is required",
  role: "textbox",
  required: true,
  testValue: "3000300",
  expectedValue: "3000300",
};

const coverageAmountFields: Array<TestField> = createTestFields([
  amountPerOccurrenceField,
  amountPerAggregateField,
]);

const testFields: Array<TestField> = [...insuranceCoverageFields, ...coverageAmountFields];

describe("<InsuranceStep1 />", () => {
  const renderFunction = () => renderWithRouter(<InsuranceStep1 />, "/form/insurance/1");

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
      { invalidTestValue: "test", expectedErrorMessage: "Amount per occurrence must be a number" },
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
      { invalidTestValue: "test", expectedErrorMessage: "Amount per aggregate must be a number" },
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
