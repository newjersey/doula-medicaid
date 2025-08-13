import PersonalDetailsStep2 from "@form/(formSteps)/personal-details/2/page";
import {
  fillAllInputsExcept,
  getInputField,
  RouterPathnameProvider,
  type InputField,
} from "@form/_utils/testUtils";
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
};

const getBillingAddressGroup = () => {
  const billingAddressGroup = screen.getByRole("group", {
    name: "What's your billing address?",
  });
  return billingAddressGroup;
};

const mailingAddressFields = [
  { name: "Street address *", key: "streetAddress1", testValue: "Test address 1" },
  { name: "Street address line 2", key: "streetAddress2", testValue: "Test address 2" },
  { name: "City *", key: "city", testValue: "Test city" },
  { name: "ZIP code *", key: "zip", testValue: "12345" },
];

const billingAddressFields = [
  {
    name: "Street address *",
    key: "billingStreetAddress1",
    testValue: "Test address 1",
    within: "What's your billing address?",
  },
  {
    name: "Street address line 2",
    key: "billingStreetAddress2",
    testValue: "Test address 2",
    within: "What's your billing address?",
  },
  {
    name: "City *",
    key: "billingCity",
    testValue: "Test city",
    within: "What's your billing address?",
  },
  {
    name: "ZIP code *",
    key: "billingZip",
    testValue: "12345",
    within: "What's your billing address?",
  },
];

const textInputFields = [...mailingAddressFields, ...billingAddressFields];

const minimalSetOfInputFields: Array<InputField> = [
  ...mailingAddressFields,
  { name: "State *", key: "state", role: "combobox", testValue: "PA" },
  { name: "Yes", key: "hasSameBillingMailingAddress", role: "radio", testValue: "true" },
];

const requiredKeys = [
  "streetAddress1",
  "city",
  "zip",
  "billingStreetAddress1",
  "billingCity",
  "billingZip",
];

const requiredFields: Array<InputField> = textInputFields.filter((field) =>
  requiredKeys.includes(field.key),
);

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

  describe("input updates", () => {
    it.each(textInputFields)("updates the $name text input", async ({ name, testValue }) => {
      const user = userEvent.setup();
      renderWithRouter();
      const input = screen.getByRole("textbox", {
        name: name,
      });
      expect(input).toHaveValue("");

      await user.type(input, testValue);
      expect(input).toHaveValue(testValue);
    });

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
  });

  describe("individual input validation and error messages", () => {
    it.each(requiredFields)(
      "marks $labelWithoutAsterisk as required and displays an error message if it is not filled in",
      async ({ name, key }) => {
        if (key.startsWith("billing")) {
          return;
        }
        const user = userEvent.setup();
        renderWithRouter();

        const input = await getInputField(screen, { name, key });
        expect(input).toBeRequired();
        await fillAllInputsExcept(screen, user, minimalSetOfInputFields, new Set([key]));
        console.log(key);
        await user.click(screen.getByRole("button", { name: "Next" }));

        expect(input).toHaveAccessibleDescription(
          expect.stringContaining(`${name.replace(" *", "")} is required`),
        );
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input).toHaveFocus();
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
        minimalSetOfInputFields,
        new Set(["hasSameBillingMailingAddress"]),
      );
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(group).toHaveAccessibleDescription(
        expect.stringContaining("This question is required"),
      );
      expect(group).toHaveAttribute("aria-invalid", "true");
      expect(inputYes).toHaveFocus();
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

    describe("when user answers no to sameMailingBilling", () => {
      it("errors if billing address fields are unfilled", async () => {
        const user = userEvent.setup();

        renderWithRouter();
        await fillAllInputsExcept(screen, user, minimalSetOfInputFields, new Set());
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

      it.each(requiredFields)(
        "clicking on the $name error focuses on the input",
        async ({ name, key, within }) => {
          if (!key.startsWith("billing")) {
            return;
          }

          const user = userEvent.setup();
          renderWithRouter();
          await fillAllInputsExcept(screen, user, minimalSetOfInputFields, new Set());
          await clickSameBillingMailingAddressNo();
          await user.click(screen.getByRole("button", { name: "Next" }));
          await user.click(
            screen.getByRole("link", {
              name: `Billing ${name.replace(" *", "").toLowerCase()} is required`,
            }),
          );

          const input = await getInputField(screen, { name, key, within });
          expect(input).toHaveFocus();
        },
      );
    });
  });

  describe("error summary", () => {
    it("shows an error summary if there are 3 or more errors", async () => {
      const user = userEvent.setup();
      renderWithRouter();
      await user.click(screen.getByRole("button", { name: "Next" }));

      const focusedElement = document.activeElement as HTMLElement;
      expect(
        within(focusedElement).getByRole("heading", {
          name: "There is a problem",
        }),
      ).toBeInTheDocument();

      const expectedErrorMessages = [
        "Street address is required",
        "City is required",
        "ZIP code is required",
      ];
      for (const errorMessage of expectedErrorMessages) {
        expect(focusedElement).toHaveTextContent(errorMessage);
      }
    });

    it.each(requiredFields)(
      "clicking on the $name error focuses on the input",
      async ({ name, key }) => {
        if (key.startsWith("billing")) {
          return;
        }

        const labelWithoutAsterisk = name.replace(" *", "");
        const user = userEvent.setup();
        renderWithRouter();
        await user.click(screen.getByRole("button", { name: "Next" }));
        await user.click(screen.getByRole("link", { name: `${labelWithoutAsterisk} is required` }));

        const input = screen.getByRole("textbox", {
          name: `${labelWithoutAsterisk} *`,
        });
        expect(input).toHaveFocus();
      },
    );

    it("does not show an error summary if there are fewer than 3 errors", async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const requiredInputsToLeaveEmpty = [
        {
          label: "Street address *",
          errorMessage: "Street address is required",
          key: "streetAddress1",
        },
      ];
      const requiredInputsToLeaveEmptyNames = new Set(requiredInputsToLeaveEmpty.map((x) => x.key));
      await fillAllInputsExcept(
        screen,
        user,
        minimalSetOfInputFields,
        requiredInputsToLeaveEmptyNames,
      );
      await user.click(screen.getByRole("button", { name: "Next" }));

      expect(screen.queryByRole("alert", { name: "There is a problem" })).not.toBeInTheDocument();
      expect(
        screen.getByRole("textbox", {
          name: "Street address *",
        }),
      ).toHaveFocus();
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
      expect(window.sessionStorage.getItem(textInputField.key)).toEqual(textInputField.testValue);
    }

    for (const textInputField of billingAddressFields) {
      expect(window.sessionStorage.getItem(textInputField.key)).toEqual(textInputField.testValue);
    }
    expect(window.sessionStorage.getItem("billingState")).toEqual("NJ");
    expect(window.sessionStorage.getItem("state")).toEqual("PA");

    expect(mockRouter.push).toHaveBeenCalledWith("/form/personal-details/3");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  describe("billing address fields", () => {
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

  describe("Public information explainer", () => {
    it("orders the public information explainer immediately after the address input", async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const zipCodeInput = screen.getByRole("textbox", {
        name: "ZIP code *",
      });
      const publicInformationExplainer = screen.getByRole("button", {
        name: "Will my information be public?",
      });
      await user.type(zipCodeInput, "1");
      expect(zipCodeInput).toHaveFocus();

      await user.tab();
      expect(publicInformationExplainer).toHaveFocus();
    });

    it("has a heading level one greater than the section heading level", () => {
      renderWithRouter();
      const sectionHeadingLevel = 2;
      const addressSectionHeading = screen.getByRole("heading", {
        name: "Mailing address",
        level: sectionHeadingLevel,
      });
      expect(addressSectionHeading).toBeInTheDocument();
      const publicInformationExplainer = screen.getByRole("heading", {
        name: "Will my information be public?",
        level: sectionHeadingLevel + 1,
      });
      expect(publicInformationExplainer).toBeInTheDocument();
    });
  });
});
