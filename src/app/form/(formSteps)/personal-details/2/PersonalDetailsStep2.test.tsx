import PersonalDetailsStep2 from "@/app/form/(formSteps)/personal-details/2/PersonalDetailsStep2";
import {
  billingAddressFields,
  mailingAddressFields,
  mailingAddressQuestion,
  minimalTestFields,
  noSameBillingMailingAddress,
  testFields,
  yesSameBillingMailingAddress,
  zipCodeField,
} from "@/app/form/(formSteps)/personal-details/2/testFields";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { expectAddressHasAutocomplete } from "@/app/form/_utils/testUtils/autocomplete";
import { getInputField } from "@/app/form/_utils/testUtils/fillInputs";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  testConditionalRender,
  type TestField,
  testFillFromDataStore,
  testInvalidField,
  testRequiredField,
  testSaveFieldsToDataStore,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<PersonalDetailsStep2 />", () => {
  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<PersonalDetailsStep2 />, "/form/personal-details/2", dataStore);

  describe("mailing address fields", () => {
    it("enables autocompleting the mailing address", () => {
      renderFunction();
      expectAddressHasAutocomplete(mailingAddressQuestion, "shipping");
    });

    it("saves fields to the data store on submit", async () => {
      await testSaveFieldsToDataStore(
        mailingAddressFields,
        minimalTestFields,
        renderFunction,
        screen,
      );
    });

    it.each(mailingAddressFields.filter((field) => field.required))(
      "marks $dataStoreKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, minimalTestFields, renderFunction, screen);
      },
    );

    it.each(mailingAddressFields)(
      "fills $dataStoreKey from the data store when page is loaded",
      async (field: TestField) => {
        await testFillFromDataStore(field, renderFunction, screen);
      },
    );

    it("defaults address state to NJ and updates it", async () => {
      const user = userEvent.setup();
      renderFunction();
      const combobox = screen.getByRole("combobox", {
        name: "State *",
      });
      expect(combobox).toHaveValue("NJ");

      await user.selectOptions(combobox, "PA");
      expect(combobox).toHaveValue("PA");
    });

    it("displays an error message if zip has less than five digits", async () => {
      await testInvalidField(
        { ...zipCodeField, testValue: "1" },
        "Billing zip code must have five digits",
        testFields,
        renderFunction,
        screen,
      );
    });

    it("prevents non-numeric inputs in ZIP Code", async () => {
      const user = userEvent.setup();
      renderFunction();
      const input = screen.getByRole("textbox", {
        name: "ZIP code *",
      });

      await user.type(input, "aaa");
      expect(input).toHaveValue("");
      await user.type(input, "!!");
      expect(input).toHaveValue("");
      await user.type(input, "11");
      expect(input).toHaveValue("11");
    });
  });

  describe("billing address fields", () => {
    describe("saves fields to the data store on submit", () => {
      it("when billing address is the same as mailing address", async () => {
        await testSaveFieldsToDataStore(
          [yesSameBillingMailingAddress],
          minimalTestFields,
          renderFunction,
          screen,
        );
      });
      it("when billing address is different from mailing address", async () => {
        await testSaveFieldsToDataStore(
          [noSameBillingMailingAddress, ...billingAddressFields],
          testFields,
          renderFunction,
          screen,
        );
      });
    });

    describe("marks fields as required and displays an error message", () => {
      it("when hasSameBillingMailingAddress is not filled in", async () => {
        await testRequiredField(
          yesSameBillingMailingAddress,
          minimalTestFields,
          renderFunction,
          screen,
        );
      });

      it.each(billingAddressFields.filter((field) => field.required))(
        "when mailing and billing address are different and $dataStoreKey is not filled in",
        async (field: TestField) => {
          await testRequiredField(field, testFields, renderFunction, screen);
        },
      );
    });

    it.each([noSameBillingMailingAddress, ...billingAddressFields])(
      "fills $dataStoreKey from the data store when page is loaded",
      async (field: TestField) => {
        await testFillFromDataStore(field, renderFunction, screen);
      },
    );

    it.each(billingAddressFields.filter((field) => field.required))(
      "conditionally renders $dataStoreKey based on hasSameBillingMailingAddress",
      async (field: TestField) => {
        await testConditionalRender(field, yesSameBillingMailingAddress, renderFunction, screen);
      },
    );
  });

  describe("Public information explainer", () => {
    it("orders the public information explainer immediately after the billing address question", async () => {
      const user = userEvent.setup();
      renderFunction();

      const input = await getInputField(screen, yesSameBillingMailingAddress);
      await user.click(input);
      expect(input).toHaveFocus();

      await user.tab();
      const publicInformationExplainer = screen.getByRole("button", {
        name: "Will my information be public?",
      });
      expect(publicInformationExplainer).toHaveFocus();
    });

    it("has a heading level one greater than the section heading level", () => {
      renderFunction();
      const sectionHeadingLevel = 2;
      const mailingAddressSectionHeading = screen.getByRole("heading", {
        name: "Mailing address",
        level: sectionHeadingLevel,
      });
      expect(mailingAddressSectionHeading).toBeInTheDocument();
      const billingAddressSectionHeading = screen.getByRole("heading", {
        name: "Billing address",
        level: sectionHeadingLevel,
      });
      expect(billingAddressSectionHeading).toBeInTheDocument();
      const publicInformationExplainer = screen.getByRole("heading", {
        name: "Will my information be public?",
        level: sectionHeadingLevel + 1,
      });
      expect(publicInformationExplainer).toBeInTheDocument();
    });
  });
});
