import PersonalDetailsStep3 from "@/app/form/(formSteps)/personal-details/3/PersonalDetailsStep3";
import {
  doulaProviderIdentificationFields,
  npiNumberField,
  otherIdentificationFields,
  testFields,
} from "@/app/form/(formSteps)/personal-details/3/testFields";
import type { DataStore } from "@/app/form/_utils/dataStore";
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

describe("<PersonalDetailsStep3 />", () => {
  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<PersonalDetailsStep3 />, "/form/personal-details/3", dataStore);

  describe("Doula provider identification fields", () => {
    it("saves fields to the data store on submit", async () => {
      await testSaveFieldsToDataStore(
        doulaProviderIdentificationFields,
        testFields,
        renderFunction,
        screen,
      );
    });

    it.each(doulaProviderIdentificationFields.filter((field) => field.required))(
      "marks $dataStoreKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, testFields, renderFunction, screen);
      },
    );

    it.each(doulaProviderIdentificationFields)(
      "fills $dataStoreKey from the data store when page is loaded",
      async (field: TestField) => {
        await testFillFromDataStore(field, renderFunction, screen);
      },
    );

    it("displays an error message if npiNumber is invalid", async () => {
      await testInvalidField(
        { ...npiNumberField, testValue: "1" },
        "National Provider Identifier (NPI) must have 10 digits",
        testFields,
        renderFunction,
        screen,
      );
    });

    it("prevents non-numeric inputs in NPI Number", async () => {
      const user = userEvent.setup();
      renderFunction();
      const input = screen.getByRole("textbox", {
        name: "National Provider Identifier (NPI) *",
      });

      await user.type(input, "aaa");
      expect(input).toHaveValue("");
      await user.type(input, "!!");
      expect(input).toHaveValue("");
    });
  });

  describe("Other identification fields", () => {
    it("saves fields to the data store on submit", async () => {
      await testSaveFieldsToDataStore(
        otherIdentificationFields,
        testFields,
        renderFunction,
        screen,
      );
    });

    // No fields in this section are required, skipping testRequiredField

    it.each(otherIdentificationFields)(
      "fills $dataStoreKey from the data store when page is loaded",
      async (field: TestField) => {
        await testFillFromDataStore(field, renderFunction, screen);
      },
    );
  });

  describe("NPI explainer", () => {
    it("orders the NPI explainer immediately after the NPI input", async () => {
      const user = userEvent.setup();
      renderFunction();

      const npiInput = screen.getByRole("textbox", {
        name: "National Provider Identifier (NPI) *",
      });
      const npiExplainer = screen.getByRole("button", { name: "What is an NPI?" });
      await user.type(npiInput, "1");
      expect(npiInput).toHaveFocus();

      await user.tab();
      expect(npiExplainer).toHaveFocus();
    });

    it("has a heading level one greater than the section heading level", () => {
      renderFunction();
      const sectionHeadingLevel = 2;
      const npiSectionHeading = screen.getByRole("heading", {
        name: "Doula provider identification",
        level: sectionHeadingLevel,
      });
      expect(npiSectionHeading).toBeInTheDocument();
      const npiExplainer = screen.getByRole("heading", {
        name: "What is an NPI?",
        level: sectionHeadingLevel + 1,
      });
      expect(npiExplainer).toBeInTheDocument();
    });
  });
});
