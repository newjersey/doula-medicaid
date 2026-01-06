import PersonalStep4 from "@/app/form/(formSteps)/personal/4/PersonalStep4";
import {
  bankAccountNumberField,
  bankRoutingNumberField,
  directDepositDetailsFields,
  hasJointBankAccountField,
  oneNameAccountInformationFields,
  path1TestFields,
  path2TestFields,
  secondNameOnJointBankAccountField,
  twoNamesAccountInformationFields,
} from "@/app/form/(formSteps)/personal/4/testFields";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { getInputField } from "@/app/form/_utils/testUtils/fillInputs";
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

describe("<PersonalStep4 />", () => {
  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<PersonalStep4 />, "/form/personal/4", dataStore);

  describe("Direct deposit details fields", () => {
    it("saves fields to the data store on submit", async () => {
      await testSaveFieldsToDataStore(
        directDepositDetailsFields,
        path1TestFields,
        renderFunction,
        screen,
      );
    });

    it.each(directDepositDetailsFields)(
      "marks $dataStoreKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, path1TestFields, renderFunction, screen);
      },
    );

    it.each(directDepositDetailsFields)(
      "fills $dataStoreKey from the data store when page is loaded",
      async (field: TestField) => {
        await testFillFromDataStore(field, renderFunction, screen);
      },
    );
  });

  describe("direct deposit explainer", () => {
    it("orders the direct deposit explainer immediately after the last direct deposit input", async () => {
      const user = userEvent.setup();
      renderFunction();

      const zipInput = screen.getByRole("textbox", { name: "ZIP Code *" });
      const directDepositExplainer = screen.getByRole("button", {
        name: "When will I receive my first direct deposit payment?",
      });
      await user.type(zipInput, "1");
      expect(zipInput).toHaveFocus();

      await user.tab();
      expect(directDepositExplainer).toHaveFocus();
    });

    it("has a heading level one greater than the section heading level", () => {
      renderFunction();
      const sectionHeadingLevel = 2;
      const directDepositSectionHeading = screen.getByRole("heading", {
        name: "Direct deposit details",
        level: sectionHeadingLevel,
      });
      expect(directDepositSectionHeading).toBeInTheDocument();
      const directDepositExplainer = screen.getByRole("heading", {
        name: "When will I receive my first direct deposit payment?",
        level: sectionHeadingLevel + 1,
      });
      expect(directDepositExplainer).toBeInTheDocument();
    });
  });

  describe("Account information fields", () => {
    describe("saves fields to the data store on submit", () => {
      it("when there is only one name on the bank account", async () => {
        await testSaveFieldsToDataStore(
          oneNameAccountInformationFields,
          path1TestFields,
          renderFunction,
          screen,
        );
      });
      it("when there is a joint bank account", async () => {
        await testSaveFieldsToDataStore(
          twoNamesAccountInformationFields,
          path2TestFields,
          renderFunction,
          screen,
        );
      });
    });

    describe("marks fields as required and displays an error message", () => {
      it.each(oneNameAccountInformationFields)(
        "when $dataStoreKey is not filled in",
        async (field) => {
          await testRequiredField(field, path1TestFields, renderFunction, screen);
        },
      );

      it("when hasJointBankAccountField is checked and secondNameOnJointBankAccountField is not filled in", async () => {
        await testRequiredField(
          secondNameOnJointBankAccountField,
          path2TestFields,
          renderFunction,
          screen,
        );
      });
    });

    it.each([...oneNameAccountInformationFields, secondNameOnJointBankAccountField])(
      "fills $dataStoreKey from the data store when page is loaded",
      async (field: TestField) => {
        await testFillFromDataStore(field, renderFunction, screen);
      },
    );

    // There was a weird bug where defaultChecked was not populated correctly
    it("does not fill hasJointBankAccountField when it is false", async () => {
      const dataStore: DataStore = {};
      dataStore[hasJointBankAccountField.dataStoreKey] = "false";
      renderFunction(dataStore);
      const input = await getInputField(screen, hasJointBankAccountField);
      expect(input).not.toBeChecked();
    });

    it("displays an error message if bank routing number is invalid", async () => {
      await testInvalidField(
        { ...bankRoutingNumberField, testValue: "1" },
        "Bank routing number must have 9 digits",
        path1TestFields,
        renderFunction,
        screen,
      );
    });
    it("prevents non-numeric inputs in bank routing number", async () => {
      const user = userEvent.setup();
      renderFunction();
      const input = await getInputField(screen, bankRoutingNumberField);

      await user.type(input, "aaa");
      expect(input).toHaveValue("");
      await user.type(input, "!!");
      expect(input).toHaveValue("");
      await user.type(input, "11");
      expect(input).toHaveValue("11");
    });

    it("displays an error message if bank account number is invalid", async () => {
      await testInvalidField(
        { ...bankAccountNumberField, testValue: "1" },
        "Bank account number must have between 4 and 18 digits",
        path1TestFields,
        renderFunction,
        screen,
      );
    });
    it("prevents non-numeric inputs in bank account number", async () => {
      const user = userEvent.setup();
      renderFunction();
      const input = await getInputField(screen, bankAccountNumberField);

      await user.type(input, "aaa");
      expect(input).toHaveValue("");
      await user.type(input, "!!");
      expect(input).toHaveValue("");
      await user.type(input, "11");
      expect(input).toHaveValue("11");
    });
  });

  describe("bank account explainer", () => {
    it("orders the bank account explainer immediately after the last bank account input", async () => {
      const user = userEvent.setup();
      renderFunction();

      const bankAccountInput = await getInputField(screen, bankAccountNumberField);
      const bankAccountExplainer = screen.getByRole("button", {
        name: "What documents can I use to verify my bank account information?",
      });
      await user.type(bankAccountInput, "1");
      expect(bankAccountInput).toHaveFocus();

      await user.tab();
      expect(bankAccountExplainer).toHaveFocus();
    });

    it("has a heading level one greater than the section heading level", () => {
      renderFunction();
      const sectionHeadingLevel = 2;
      const accountInformationSectionHeading = screen.getByRole("heading", {
        name: "Account information",
        level: sectionHeadingLevel,
      });
      expect(accountInformationSectionHeading).toBeInTheDocument();
      const bankAccountExplainer = screen.getByRole("heading", {
        name: "What documents can I use to verify my bank account information?",
        level: sectionHeadingLevel + 1,
      });
      expect(bankAccountExplainer).toBeInTheDocument();
    });
  });
});
