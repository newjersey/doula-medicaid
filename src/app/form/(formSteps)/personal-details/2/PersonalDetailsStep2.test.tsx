import PersonalDetailsStep2 from "@/app/form/(formSteps)/personal-details/2/PersonalDetailsStep2";
import { expectAddressHasAutocomplete } from "@/app/form/_utils/testUtils/autocomplete";
import { getInputField } from "@/app/form/_utils/testUtils/fillInputs";
import { renderWithRouter } from "@/app/form/_utils/testUtils/renderWithRouter";
import {
  createTestField,
  createTestFields,
  testConditionalRender,
  type TestField,
  testFillFromSessionStorage,
  testInvalidField,
  testRequiredField,
  testSaveFieldsToSessionStorage,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mailingAddressQuestion =
  "Mailing address We will send official mail here. It can be your home address.";
const billingAddressQuestion = "What is your billing address?";

const mailingAddressFields = createTestFields([
  {
    name: "Street address *",
    sessionStorageKey: "streetAddress1",
    required: true,
    testValue: "Test address 1",
    withinGroupName: mailingAddressQuestion,
  },
  {
    name: "Street address line 2",
    sessionStorageKey: "streetAddress2",
    required: false,
    testValue: "Test address 2",
    withinGroupName: mailingAddressQuestion,
  },
  {
    name: "City *",
    sessionStorageKey: "city",
    required: true,
    testValue: "Test city",
    withinGroupName: mailingAddressQuestion,
  },
  {
    name: "State *",
    sessionStorageKey: "state",
    required: false,
    role: "combobox",
    testValue: "PA",
    withinGroupName: mailingAddressQuestion,
  },
  {
    name: "ZIP code *",
    sessionStorageKey: "zip",
    required: true,
    testValue: "12345",
    withinGroupName: mailingAddressQuestion,
  },
]);

const yesSameBillingMailingAddress: TestField = {
  name: "Yes",
  sessionStorageKey: "hasSameBillingMailingAddress",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "true",
  expectedValue: "true",
  withinGroupName: "Are your billing and residential addresses the same? Select one *",
};
const noSameBillingMailingAddress: TestField = {
  name: "No",
  sessionStorageKey: "hasSameBillingMailingAddress",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "false",
  expectedValue: "false",
  withinGroupName: "Are your billing and residential addresses the same? Select one *",
};

const minimalTestFields = [...mailingAddressFields, yesSameBillingMailingAddress];

const zipCodeField = createTestField({
  name: "ZIP code *",
  sessionStorageKey: "billingZip",
  required: true,
  testValue: "12345",
  withinGroupName: billingAddressQuestion,
  alternateRequiredFieldError: "Billing zip code is required",
  prerequisiteField: noSameBillingMailingAddress,
});

const billingAddressFields = [
  ...createTestFields([
    {
      name: "Street address *",
      sessionStorageKey: "billingStreetAddress1",
      required: true,
      testValue: "Test address 1",
      withinGroupName: billingAddressQuestion,
      alternateRequiredFieldError: "Billing street address is required",
      prerequisiteField: noSameBillingMailingAddress,
    },
    {
      name: "Street address line 2",
      sessionStorageKey: "billingStreetAddress2",
      required: false,
      testValue: "Test address 2",
      withinGroupName: billingAddressQuestion,
      prerequisiteField: noSameBillingMailingAddress,
    },
    {
      name: "City *",
      sessionStorageKey: "billingCity",
      required: true,
      testValue: "Houston",
      withinGroupName: billingAddressQuestion,
      alternateRequiredFieldError: "Billing city is required",
      prerequisiteField: noSameBillingMailingAddress,
    },
    {
      name: "State *",
      sessionStorageKey: "billingState",
      required: false,
      role: "combobox",
      testValue: "TX",
      withinGroupName: billingAddressQuestion,
      prerequisiteField: noSameBillingMailingAddress,
    },
  ]),
  zipCodeField,
];

const allTestFields = [
  ...mailingAddressFields,
  noSameBillingMailingAddress,
  ...billingAddressFields,
];

describe("<PersonalDetailsStep2 />", () => {
  const renderFunction = () =>
    renderWithRouter(<PersonalDetailsStep2 />, "/form/personal-details/2");

  describe("mailing address fields", () => {
    it("enables autocompleting the mailing address", () => {
      renderFunction();
      expectAddressHasAutocomplete(mailingAddressQuestion, "shipping");
    });

    it("saves fields to session storage on submit", async () => {
      await testSaveFieldsToSessionStorage(
        mailingAddressFields,
        minimalTestFields,
        renderFunction,
        screen,
      );
    });

    it.each(mailingAddressFields.filter((field) => field.required))(
      "marks $sessionStorageKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, minimalTestFields, renderFunction, screen);
      },
    );

    it.each(mailingAddressFields)(
      "fills $sessionStorageKey from session storage when page is loaded",
      async (field: TestField) => {
        await testFillFromSessionStorage(field, renderFunction, screen);
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
        allTestFields,
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
    });
  });

  describe("billing address fields", () => {
    describe("saves fields to session storage on submit", () => {
      it("when billing address is the same as mailing address", async () => {
        await testSaveFieldsToSessionStorage(
          [yesSameBillingMailingAddress],
          minimalTestFields,
          renderFunction,
          screen,
        );
      });
      it("when billing address is different from mailing address", async () => {
        await testSaveFieldsToSessionStorage(
          [noSameBillingMailingAddress, ...billingAddressFields],
          allTestFields,
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
        "when mailing and billing address are different and $sessionStorageKey is not filled in",
        async (field: TestField) => {
          await testRequiredField(field, allTestFields, renderFunction, screen);
        },
      );
    });

    it.each([noSameBillingMailingAddress, ...billingAddressFields])(
      "fills $sessionStorageKey from session storage when page is loaded",
      async (field: TestField) => {
        await testFillFromSessionStorage(field, renderFunction, screen);
      },
    );

    it.each(billingAddressFields.filter((field) => field.required))(
      "conditionally renders $sessionStorageKey based on hasSameBillingMailingAddress",
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
