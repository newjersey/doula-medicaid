import PersonalStep2 from "@/app/form/(formSteps)/personal/2/PersonalStep2";
import {
  billingAddressFields,
  billingStateField,
  mailingAddressFields,
  mailingAddressQuestion,
  minimalTestFields,
  noSameBillingMailingAddress,
  stateField,
  testFields,
  yesSameBillingMailingAddress,
} from "@/app/form/(formSteps)/personal/2/testFields";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { expectAddressHasAutocomplete } from "@/app/form/_utils/testUtils/autocomplete";
import {
  fillAllInputsExcept,
  fillField,
  getInputField,
} from "@/app/form/_utils/testUtils/fillInputs";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  testConditionalRender,
  type TestField,
  testFillFromDataStore,
  testRequiredField,
  testSaveFieldsToDataStore,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<PersonalStep2 />", () => {
  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<PersonalStep2 />, "/form/personal/2", dataStore);

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

    it("defaults address state to New Jersey", async () => {
      const user = userEvent.setup();
      const { mockUpdateDataStore } = renderFunction();
      const stateInput = await getInputField(screen, stateField);
      expect(stateInput).toHaveDisplayValue("New Jersey");
      expect(stateInput).toHaveValue("NJ");

      await fillAllInputsExcept(screen, user, minimalTestFields, new Set(["state"]));
      await user.click(screen.getByRole("button", { name: "Next" }));

      expect(mockUpdateDataStore).toHaveBeenCalledWith(expect.objectContaining({ state: "NJ" }));
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

    it("defaults address state to New Jersey", async () => {
      const user = userEvent.setup();
      const { mockUpdateDataStore } = renderFunction();

      await fillField(screen, user, noSameBillingMailingAddress);
      const billingStateInput = await getInputField(screen, billingStateField);
      expect(billingStateInput).toHaveDisplayValue("New Jersey");
      expect(billingStateInput).toHaveValue("NJ");

      await fillAllInputsExcept(screen, user, testFields, new Set(["billingState"]));
      await user.click(screen.getByRole("button", { name: "Next" }));

      expect(mockUpdateDataStore).toHaveBeenCalledWith(
        expect.objectContaining({ billingState: "NJ" }),
      );
    });
  });

  describe("Public information explainer", () => {
    it("orders the public information explainer immediately after the last billing address question", async () => {
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
