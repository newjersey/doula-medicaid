import { expectAddressHasAutocomplete } from "@/app/form/_utils/testUtils/autocomplete";
import { fillAllInputs, fillAllInputsExcept } from "@/app/form/_utils/testUtils/fillInputs";
import { RouterPathnameProvider } from "@/app/form/_utils/testUtils/RouterPathnameProvider";
import {
  createTestFields,
  type TestField,
  testFillFromSessionStorage,
  testRequiredField,
  testSaveFieldsToSessionStorage,
} from "@/app/form/_utils/testUtils/sharedTests";
import PersonalDetailsStep2 from "@form/(formSteps)/personal-details/2/page";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const clickSameBillingMailingAddressNo = async () => {
  const user = userEvent.setup();
  const group = screen.getByRole("group", {
    name: "Are your billing and residential addresses the same? Select one *",
  });
  const inputNo = within(group).getByRole("radio", {
    name: "No",
  });
  await user.click(inputNo);
  return inputNo;
};

const clickSameBillingMailingAddressYes = async () => {
  const user = userEvent.setup();
  const group = screen.getByRole("group", {
    name: "Are your billing and residential addresses the same? Select one *",
  });
  const inputYes = within(group).getByRole("radio", {
    name: "Yes",
  });
  await user.click(inputYes);
  return inputYes;
};

const getBillingAddressGroup = () => {
  const billingAddressGroup = screen.getByRole("group", {
    name: "What's your billing address?",
  });
  return billingAddressGroup;
};

const mailingAddressFields = createTestFields([
  {
    name: "Street address *",
    sessionStorageKey: "streetAddress1",
    required: true,
    testValue: "Test address 1",
    withinGroupName:
      "Mailing address We will send official mail here. It can be your home address.",
  },
  {
    name: "Street address line 2",
    sessionStorageKey: "streetAddress2",
    required: false,
    testValue: "Test address 2",
    withinGroupName:
      "Mailing address We will send official mail here. It can be your home address.",
  },
  {
    name: "City *",
    sessionStorageKey: "city",
    required: true,
    testValue: "Test city",
    withinGroupName:
      "Mailing address We will send official mail here. It can be your home address.",
  },
  {
    name: "State *",
    sessionStorageKey: "state",
    required: false,
    role: "combobox",
    testValue: "PA",
    withinGroupName:
      "Mailing address We will send official mail here. It can be your home address.",
  },
  {
    name: "ZIP code *",
    sessionStorageKey: "zip",
    required: true,
    testValue: "12345",
    withinGroupName:
      "Mailing address We will send official mail here. It can be your home address.",
  },
]);

const minimalFields = [
  ...mailingAddressFields,
  ...createTestFields([
    {
      name: "Yes",
      sessionStorageKey: "hasSameBillingMailingAddress",
      required: true,
      alternateRequiredFieldError: "This question is required",
      role: "radio",
      testValue: "true",
    },
  ]),
];

const noSameBillingMailingAddress: TestField = {
  name: "No",
  sessionStorageKey: "hasSameBillingMailingAddress",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "false",
  expectedValue: "false",
};

const billingAddressFields = createTestFields([
  {
    name: "Street address *",
    sessionStorageKey: "billingStreetAddress1",
    required: true,
    testValue: "Test address 1",
    withinGroupName: "What's your billing address?",
    alternateRequiredFieldError: "Billing street address is required",
    prerequisiteField: noSameBillingMailingAddress,
  },
  {
    name: "Street address line 2",
    sessionStorageKey: "billingStreetAddress2",
    required: false,
    testValue: "Test address 2",
    withinGroupName: "What's your billing address?",
    prerequisiteField: noSameBillingMailingAddress,
  },
  {
    name: "City *",
    sessionStorageKey: "billingCity",
    required: true,
    testValue: "Houston",
    withinGroupName: "What's your billing address?",
    alternateRequiredFieldError: "Billing city is required",
    prerequisiteField: noSameBillingMailingAddress,
  },
  {
    name: "State *",
    sessionStorageKey: "billingState",
    required: false,
    role: "combobox",
    testValue: "TX",
    withinGroupName: "What's your billing address?",
    prerequisiteField: noSameBillingMailingAddress,
  },
  {
    name: "ZIP code *",
    sessionStorageKey: "billingZip",
    required: true,
    testValue: "12345",
    withinGroupName: "What's your billing address?",
    alternateRequiredFieldError: "Billing zip code is required",
    prerequisiteField: noSameBillingMailingAddress,
  },
]);

const allTestFields = [...mailingAddressFields, ...billingAddressFields];

describe("<PersonalDetailsStep2 />", () => {
  const renderWithRouter = () => {
    const mockPush = jest.fn();
    const mockRefresh = jest.fn();
    const mockRouter: Partial<AppRouterInstance> = {
      push: mockPush,
      refresh: mockRefresh,
    };
    render(
      <RouterPathnameProvider
        pathname="/form/personal-details/2"
        router={mockRouter as AppRouterInstance}
      >
        <PersonalDetailsStep2 />
      </RouterPathnameProvider>,
    );
    return mockRouter;
  };

  describe("mailing address fields", () => {
    it("enables autocompleting the mailing address", () => {
      renderWithRouter();
      expectAddressHasAutocomplete(
        "Mailing address We will send official mail here. It can be your home address.",
        "shipping",
      );
    });

    it("saves fields to session storage on submit", async () => {
      await testSaveFieldsToSessionStorage(
        mailingAddressFields,
        minimalFields,
        renderWithRouter,
        screen,
        "/form/personal-details/3",
      );
    });

    it.each(mailingAddressFields.filter((field) => field.required))(
      "marks $sessionStorageKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, minimalFields, renderWithRouter, screen);
      },
    );

    it.each(mailingAddressFields)(
      "fills $sessionStorageKey from session storage when page is loaded",
      async (field: TestField) => {
        await testFillFromSessionStorage(field, renderWithRouter, screen);
      },
    );

    it("defaults address state to NJ and updates it", async () => {
      const user = userEvent.setup();
      renderWithRouter();
      const combobox = screen.getByRole("combobox", {
        name: "State *",
      });
      expect(combobox).toHaveValue("NJ");

      await user.selectOptions(combobox, "PA");
      expect(combobox).toHaveValue("PA");
    });

    it("validates ZIP code", async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const input = screen.getByRole("textbox", {
        name: "ZIP code *",
      });

      await user.type(input, "aaa");
      expect(input).toHaveValue("");
      await user.type(input, "!!");
      expect(input).toHaveValue("");

      await user.type(input, "1");
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(input).toHaveAccessibleDescription(
        expect.stringContaining("ZIP code must have five digits"),
      );
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("billing address fields", () => {
    it("saves fields to session storage on submit", async () => {
      await testSaveFieldsToSessionStorage(
        billingAddressFields,
        allTestFields,
        renderWithRouter,
        screen,
        "/form/personal-details/3",
      );
    });

    it.each(billingAddressFields.filter((field) => field.required))(
      "marks $sessionStorageKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, allTestFields, renderWithRouter, screen);
      },
    );

    it.each(billingAddressFields)(
      "fills $sessionStorageKey from session storage when page is loaded",
      async (field: TestField) => {
        await testFillFromSessionStorage(field, renderWithRouter, screen);
      },
    );

    it("validates same billing and mailing address radio buttons", async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const group = screen.getByRole("group", {
        name: "Are your billing and residential addresses the same? Select one *",
      });
      const inputYes = within(group).getByRole("radio", {
        name: "Yes",
      });
      const inputNo = within(group).getByRole("radio", {
        name: "No",
      });
      expect(inputYes).toBeRequired();
      expect(inputNo).toBeRequired();
      await fillAllInputsExcept(
        screen,
        user,
        minimalFields,
        new Set(["hasSameBillingMailingAddress"]),
      );
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(inputYes).toHaveAccessibleDescription(
        expect.stringContaining("This question is required"),
      );
      expect(inputYes).toHaveAttribute("aria-invalid", "true");
      expect(inputNo).toHaveAccessibleDescription(
        expect.stringContaining("This question is required"),
      );
      expect(inputNo).toHaveAttribute("aria-invalid", "true");
      expect(inputYes).toHaveFocus();
    });

    describe("when user answers no to sameMailingBilling", () => {
      it("errors if billing address fields are unfilled", async () => {
        const user = userEvent.setup();

        renderWithRouter();
        await fillAllInputs(screen, user, minimalFields);
        await clickSameBillingMailingAddressNo();
        await user.click(screen.getByRole("button", { name: "Next" }));

        const focusedElement = document.activeElement as HTMLElement;
        expect(
          within(focusedElement).getByRole("heading", {
            name: "There is a problem",
          }),
        ).toBeInTheDocument();

        const expectedErrorMessages = [
          "Billing street address is required",
          "Billing city is required",
          "Billing zip code is required",
        ];
        for (const errorMessage of expectedErrorMessages) {
          expect(focusedElement).toHaveTextContent(errorMessage);
        }
      });
    });

    it("shows/hides billing address fields based on user response", async () => {
      const user = userEvent.setup();
      renderWithRouter();
      await clickSameBillingMailingAddressNo();
      let billingAddressGroup = getBillingAddressGroup();

      for (const field of billingAddressFields) {
        expect(
          within(billingAddressGroup).getByRole(field.role, { name: field.name }),
        ).toBeInTheDocument();
      }
      expect(
        within(billingAddressGroup).getByRole("combobox", { name: "State *" }),
      ).toBeInTheDocument();
      await fillAllInputsExcept(screen, user, billingAddressFields, new Set());

      await clickSameBillingMailingAddressYes();
      expect(
        screen.queryByRole("group", {
          name: "What's your billing address?",
        }),
      ).not.toBeInTheDocument();

      await clickSameBillingMailingAddressNo();
      billingAddressGroup = getBillingAddressGroup();
      for (const field of billingAddressFields) {
        expect(
          within(billingAddressGroup).getByRole(field.role, { name: field.name }),
        ).toBeInTheDocument();
        expect(within(billingAddressGroup).getByRole(field.role, { name: field.name })).toHaveValue(
          field.testValue,
        );
      }
    });
  });

  describe("Public information explainer", () => {
    it("orders the public information explainer immediately after the billing address question", async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const sameBillingMailingAddressYes = await clickSameBillingMailingAddressYes();
      expect(sameBillingMailingAddressYes).toHaveFocus();

      await user.tab();
      const publicInformationExplainer = screen.getByRole("button", {
        name: "Will my information be public?",
      });
      expect(publicInformationExplainer).toHaveFocus();
    });

    it("has a heading level one greater than the section heading level", () => {
      renderWithRouter();
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
