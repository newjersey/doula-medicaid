import InsuranceStep1 from "@/app/form/(formSteps)/insurance/1/page";
import { getInputField } from "@/app/form/_utils/testUtils/fillInputs";
import { RouterPathnameProvider } from "@/app/form/_utils/testUtils/RouterPathnameProvider";
import {
  createTestField,
  createTestFields,
  type TestField,
  testFillFromSessionStorage,
  testInvalidField,
  testRequiredField,
  testSaveFieldsToSessionStorage,
} from "@/app/form/_utils/testUtils/sharedTests";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const insuranceStartDateDayField = createTestField({
  name: "Day *",
  sessionStorageKey: "insuranceStartDateDay",
  required: true,
  testValue: "6",
  withinGroupName: "Start date *",
});

const insuranceStartDateMonthField = createTestField({
  name: "Month *",
  sessionStorageKey: "insuranceStartDateMonth",
  required: true,
  testValue: "07 - July",
  expectedValue: "7",
  role: "combobox",
  withinGroupName: "Start date *",
});

const insuranceStartDateYearField = createTestField({
  name: "Year *",
  sessionStorageKey: "insuranceStartDateYear",
  required: true,
  testValue: "1988",
  withinGroupName: "Start date *",
});

const insuranceEndDateDayField = createTestField({
  name: "Day *",
  sessionStorageKey: "insuranceEndDateDay",
  required: true,
  testValue: "30",
  withinGroupName: "End date *",
});

const insuranceEndDateMonthField = createTestField({
  name: "Month *",
  sessionStorageKey: "insuranceEndDateMonth",
  required: true,
  testValue: "02 - February",
  expectedValue: "2",
  role: "combobox",
  withinGroupName: "End date *",
});

const insuranceEndDateYearField = createTestField({
  name: "Year *",
  sessionStorageKey: "insuranceEndDateYear",
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
  sessionStorageKey: "insuranceOccurenceAmount",
  requiredErrorMessage: "Amount per occurrence is required",
  role: "textbox",
  required: true,
  testValue: "1000005",
  expectedValue: "1000005",
};

const amountPerAggregateField: TestField = {
  name: "Amount per aggregate *",
  sessionStorageKey: "insuranceAggregateAmount",
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
  const renderWithRouter = () => {
    const mockRouter: Partial<AppRouterInstance> = {
      push: jest.fn(),
      refresh: jest.fn(),
    };
    render(
      <RouterPathnameProvider pathname="/form/insurance/1" router={mockRouter as AppRouterInstance}>
        <InsuranceStep1 />
      </RouterPathnameProvider>,
    );
    return mockRouter;
  };

  describe("insurance coverage fields", () => {
    it("saves fields to session storage on submit", async () => {
      await testSaveFieldsToSessionStorage(
        insuranceCoverageFields,
        testFields,
        renderWithRouter,
        screen,
        "/form/insurance/2",
      );
    });

    it.each(insuranceCoverageFields.filter((field) => field.required))(
      "marks $sessionStorageKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, testFields, renderWithRouter, screen);
      },
    );

    it.each(insuranceCoverageFields)(
      "fills $sessionStorageKey from session storage when page is loaded",
      async (field: TestField) => {
        await testFillFromSessionStorage(field, renderWithRouter, screen);
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
          renderWithRouter,
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
          renderWithRouter,
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
          renderWithRouter,
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
          renderWithRouter,
          screen,
        );
      },
    );
  });

  describe("coverage amount fields", () => {
    it("saves fields to session storage on submit", async () => {
      await testSaveFieldsToSessionStorage(
        coverageAmountFields,
        testFields,
        renderWithRouter,
        screen,
        "/form/insurance/2",
      );
    });

    it.each(coverageAmountFields.filter((field) => field.required))(
      "marks $sessionStorageKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, testFields, renderWithRouter, screen);
      },
    );

    it.each(coverageAmountFields)(
      "fills $sessionStorageKey from session storage when page is loaded",
      async (field: TestField) => {
        await testFillFromSessionStorage(field, renderWithRouter, screen);
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
          renderWithRouter,
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
          renderWithRouter,
          screen,
        );
      },
    );
  });

  describe("insurance coverage explainer", () => {
    it("orders the insurance coverage explainer immediately after the end date year question", async () => {
      const user = userEvent.setup();
      renderWithRouter();

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
      renderWithRouter();
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
      renderWithRouter();

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
      renderWithRouter();
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
