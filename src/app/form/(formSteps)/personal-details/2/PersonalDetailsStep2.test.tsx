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
  },
  {
    name: "Street address line 2",
    sessionStorageKey: "streetAddress2",
    required: false,
    testValue: "Test address 2",
  },
  { name: "City *", sessionStorageKey: "city", required: true, testValue: "Test city" },
  {
    name: "State *",
    sessionStorageKey: "state",
    required: false,
    role: "combobox",
    testValue: "PA",
  },
  { name: "ZIP code *", sessionStorageKey: "zip", required: true, testValue: "12345" },
]);

const minimalFields = [
  ...mailingAddressFields,
  ...createTestFields([
    {
      name: "Yes",
      sessionStorageKey: "hasSameBillingMailingAddress",
      required: true,
      role: "radio",
      testValue: "true",
    },
  ]),
];

const billingAddressFields = createTestFields([
  {
    name: "No",
    sessionStorageKey: "hasSameBillingMailingAddress",
    required: true,
    role: "radio",
    testValue: "false",
  },
  {
    name: "Street address *",
    sessionStorageKey: "billingStreetAddress1",
    required: true,
    testValue: "Test address 1",
    withinGroupName: "What's your billing address?",
  },
  {
    name: "Street address line 2",
    sessionStorageKey: "billingStreetAddress2",
    required: false,
    testValue: "Test address 2",
    withinGroupName: "What's your billing address?",
  },
  {
    name: "City *",
    sessionStorageKey: "billingCity",
    required: true,
    testValue: "Houston",
    withinGroupName: "What's your billing address?",
  },
  {
    name: "State *",
    sessionStorageKey: "state",
    required: false,
    role: "combobox",
    testValue: "TX",
    withinGroupName: "What's your billing address?",
  },
  {
    name: "ZIP code *",
    sessionStorageKey: "billingZip",
    required: true,
    testValue: "12345",
    withinGroupName: "What's your billing address?",
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
      expectAddressHasAutocomplete("Mailing address", "shipping");
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
      async ({ name, role, sessionStorageKey }: TestField) => {
        await testRequiredField(
          name,
          role,
          sessionStorageKey,
          minimalFields,
          renderWithRouter,
          screen,
        );
      },
    );

    it.each(mailingAddressFields.filter((field) => field.required))(
      "fills $sessionStorageKey from session storage when page is loaded",
      async ({ name, role, sessionStorageKey, expectedValue }: TestField) => {
        await testFillFromSessionStorage(
          name,
          role,
          sessionStorageKey,
          expectedValue,
          renderWithRouter,
          screen,
        );
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
      async ({ name, role, sessionStorageKey }: TestField) => {
        await testRequiredField(
          name,
          role,
          sessionStorageKey,
          allTestFields,
          renderWithRouter,
          screen,
        );
      },
    );

    it.each(billingAddressFields.filter((field) => field.required))(
      "fills $sessionStorageKey from session storage when page is loaded",
      async ({ name, role, sessionStorageKey, expectedValue }: TestField) => {
        await testFillFromSessionStorage(
          name,
          role,
          sessionStorageKey,
          expectedValue,
          renderWithRouter,
          screen,
        );
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
        allTestFields,
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
        await fillAllInputs(screen, user, allTestFields);
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
          within(billingAddressGroup).getByRole("textbox", { name: field.name }),
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
          within(billingAddressGroup).getByRole("textbox", { name: field.name }),
        ).toBeInTheDocument();
        expect(within(billingAddressGroup).getByRole("textbox", { name: field.name })).toHaveValue(
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

  it("saves form data on submit", async () => {
    const user = userEvent.setup();
    const mockRouter = renderWithRouter();
    await fillAllInputsExcept(screen, user, minimalSetOfInputFields, new Set());
    await user.click(screen.getByRole("button", { name: "Next" }));
    await clickSameBillingMailingAddressNo();

    await fillAllInputsExcept(screen, user, billingAddressFields, new Set());
    await user.click(screen.getByRole("button", { name: "Next" }));

    for (const textInputField of textInputFields) {
      expect(window.sessionStorage.getItem(textInputField.sessionStorageKey)).toEqual(
        textInputField.testValue,
      );
    }

    for (const textInputField of billingAddressFields) {
      expect(window.sessionStorage.getItem(textInputField.sessionStorageKey)).toEqual(
        textInputField.testValue,
      );
    }
    expect(window.sessionStorage.getItem("billingState")).toEqual("NJ");
    expect(window.sessionStorage.getItem("state")).toEqual("PA");

    expect(mockRouter.push).toHaveBeenCalledWith("/form/personal-details/3");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("fills fields from session storage when page is loaded", () => {
    window.sessionStorage.setItem("streetAddress1", "123 Main St");
    window.sessionStorage.setItem("streetAddress2", "Apt 4B");
    window.sessionStorage.setItem("city", "Newark");
    window.sessionStorage.setItem("state", "NJ");
    window.sessionStorage.setItem("zip", "12345");
    window.sessionStorage.setItem("hasSameBillingMailingAddress", "true");
    renderWithRouter();

    expect(screen.getByRole("textbox", { name: "Street address *" })).toHaveValue("123 Main St");
    expect(screen.getByRole("textbox", { name: "Street address line 2" })).toHaveValue("Apt 4B");
    expect(screen.getByRole("textbox", { name: "City *" })).toHaveValue("Newark");
    expect(screen.getByRole("combobox", { name: "State *" })).toHaveValue("NJ");
    expect(screen.getByRole("textbox", { name: "ZIP code *" })).toHaveValue("12345");
    expect(screen.getByRole("radio", { name: "Yes" })).toBeChecked();
  });
});
