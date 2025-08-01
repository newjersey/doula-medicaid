import PersonalDetailsStep1 from "@form/(formSteps)/personal-details/1/page";
import {
  fillAllInputsExcept,
  RouterPathnameProvider,
  type InputField,
} from "@form/_utils/testUtils";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const textInputFields = [
  { name: "First name *", key: "firstName", testValue: "Test first name" },
  { name: "Middle name", key: "middleName", testValue: "Test middle name" },
  { name: "Last name *", key: "lastName", testValue: "Test last name" },
  { name: "Day *", key: "dateOfBirthDay", testValue: "6" },
  { name: "Year *", key: "dateOfBirthYear", testValue: "1988" },
  { name: "Email address *", key: "email", testValue: "test@test.com" },
  {
    name: "Social security number *",
    key: "socialSecurityNumber",
    testValue: "123456789",
    expectedValue: "123-45-6789",
  },
  {
    name: "Phone number *",
    key: "phoneNumber",
    testValue: "3211234567",
    expectedValue: "321-123-4567",
  },
];

const allInputFields: Array<InputField> = [
  ...textInputFields,
  { name: "Month *", role: "combobox", testValue: "07 - July" },
];

const requiredInputs = [
  { labelWithoutAsterisk: "First name", role: "textbox" },
  { labelWithoutAsterisk: "Last name", role: "textbox" },
  { labelWithoutAsterisk: "Month", role: "combobox" },
  { labelWithoutAsterisk: "Day", role: "textbox" },
  { labelWithoutAsterisk: "Year", role: "textbox" },
  { labelWithoutAsterisk: "Phone number", role: "textbox" },
  { labelWithoutAsterisk: "Email address", role: "textbox" },
  { labelWithoutAsterisk: "Social security number", role: "textbox" },
];

describe("<PersonalDetailsStep1 />", () => {
  const renderWithRouter = () => {
    const mockPush = jest.fn();
    const mockRefresh = jest.fn();
    const mockRouter: Partial<AppRouterInstance> = {
      push: mockPush,
      refresh: mockRefresh,
    };
    render(
      <RouterPathnameProvider
        pathname="/form/personal-details/1"
        router={mockRouter as AppRouterInstance}
      >
        <PersonalDetailsStep1 />
      </RouterPathnameProvider>,
    );
    return mockRouter;
  };

  describe("input updates", () => {
    it.each(textInputFields)(
      "updates the $name text input",
      async ({ name, testValue, expectedValue }) => {
        const user = userEvent.setup();
        renderWithRouter();
        const input = screen.getByRole("textbox", {
          name: name,
        });
        expect(input).toHaveValue("");

        await user.type(input, testValue);
        expect(input).toHaveValue(expectedValue ?? testValue);
      },
    );

    it("updates the date of birth month", async () => {
      const user = userEvent.setup();
      renderWithRouter();
      const combobox = screen.getByRole("combobox", {
        name: "Month *",
      });
      await user.selectOptions(combobox, "07 - July");
      expect(combobox).toHaveValue("7");
    });
  });

  describe("individual input validation and error messages", () => {
    it.each(requiredInputs)(
      "marks $labelWithoutAsterisk as required and displays an error message if it is not filled in",
      async ({ labelWithoutAsterisk, role }) => {
        const user = userEvent.setup();
        renderWithRouter();

        const name = `${labelWithoutAsterisk} *`;
        const input = screen.getByRole(role, {
          name: name,
        });
        expect(input).toBeRequired();
        await fillAllInputsExcept(screen, user, allInputFields, new Set([name]));
        await user.click(screen.getByRole("button", { name: "Next" }));

        expect(input).toHaveAccessibleDescription(
          expect.stringContaining(`${labelWithoutAsterisk} is required`),
        );
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input).toHaveFocus();
      },
    );

    it("validates date of birth day", async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const input = screen.getByRole("textbox", {
        name: "Day *",
      });

      await user.type(input, "test");
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(input).toHaveAccessibleDescription(expect.stringContaining("Day must be a number"));
      expect(input).toHaveAttribute("aria-invalid", "true");

      await user.clear(input);
      await user.type(input, "0");
      expect(input).toHaveAccessibleDescription(
        expect.stringContaining(`Day must be between 1 and 31`),
      );
      expect(input).toHaveAttribute("aria-invalid", "true");

      await user.clear(input);
      await user.type(input, "50");
      expect(input).toHaveAccessibleDescription(
        expect.stringContaining(`Day must be between 1 and 31`),
      );
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("validates date of birth year", async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const input = screen.getByRole("textbox", {
        name: "Year *",
      });

      await user.type(input, "test");
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(input).toHaveAccessibleDescription(expect.stringContaining("Year must be a number"));
      expect(input).toHaveAttribute("aria-invalid", "true");

      await user.clear(input);
      await user.type(input, "1");
      expect(input).toHaveAccessibleDescription(
        expect.stringContaining("Year must have four digits"),
      );
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it.each([
      {
        name: "Social security number *",
        lowercaseName: "social security number",
      },
      {
        name: "Phone number *",
        lowercaseName: "phone number",
      },
    ])("validates $lowercaseName", async ({ name, lowercaseName }) => {
      const user = userEvent.setup();
      renderWithRouter();
      const input = screen.getByRole("textbox", {
        name: name,
      });

      await user.type(input, "aaa");
      expect(input).toHaveValue("");
      await user.type(input, "!!");
      expect(input).toHaveValue("");

      await user.type(input, "123");
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(input).toHaveAccessibleDescription(
        expect.stringContaining(`Entered value does not match ${lowercaseName} format`),
      );
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it.each([["invalid-email"], ["invalid@email"], ["invalid.email"]])(
      "displays an error message if the invalid email format %s is submitted",
      async () => {
        const user = userEvent.setup();
        renderWithRouter();

        const input = screen.getByRole("textbox", {
          name: `Email address *`,
        });
        await user.type(input, "invalid-email");
        await user.click(screen.getByRole("button", { name: "Next" }));

        expect(input).toHaveAccessibleDescription(
          expect.stringContaining("Entered value does not match email format"),
        );
        expect(input).toHaveAttribute("aria-invalid", "true");
      },
    );
  });

  describe("error summary", () => {
    it("shows an error summary if there are 3 or more errors", async () => {
      const user = userEvent.setup();
      renderWithRouter();
      const requiredInputsToLeaveEmpty = [
        { name: "First name *", errorMessage: "First name is required" },
        { name: "Day *", errorMessage: "Day is required" },
        { name: "Email address *", errorMessage: "Email address is required" },
      ];

      const requiredInputsToLeaveEmptyNames = new Set(
        requiredInputsToLeaveEmpty.map((x) => x.name),
      );
      await fillAllInputsExcept(screen, user, allInputFields, requiredInputsToLeaveEmptyNames);
      await user.click(screen.getByRole("button", { name: "Next" }));

      const focusedElement = document.activeElement as HTMLElement;
      expect(
        within(focusedElement).getByRole("heading", {
          name: "There is a problem",
        }),
      ).toBeInTheDocument();

      for (const field of requiredInputsToLeaveEmpty) {
        expect(focusedElement).toHaveTextContent(field.errorMessage);
      }
    });

    it.each(requiredInputs)(
      "clicking on the $name error focuses on the input",
      async ({ labelWithoutAsterisk, role }) => {
        const user = userEvent.setup();
        renderWithRouter();
        await user.click(screen.getByRole("button", { name: "Next" }));
        await user.click(screen.getByRole("link", { name: `${labelWithoutAsterisk} is required` }));

        const input = screen.getByRole(role, {
          name: `${labelWithoutAsterisk} *`,
        });
        expect(input).toHaveFocus();
      },
    );

    it("does not show an error summary if there are fewer than 3 errors", async () => {
      const user = userEvent.setup();
      renderWithRouter();
      const requiredInputsToLeaveEmpty = [
        { name: "First name *", errorMessage: "First name is required" },
        { name: "Day *", errorMessage: "Day is required" },
      ];

      const requiredInputsToLeaveEmptyNames = new Set(
        requiredInputsToLeaveEmpty.map((x) => x.name),
      );
      await fillAllInputsExcept(screen, user, allInputFields, requiredInputsToLeaveEmptyNames);
      await user.click(screen.getByRole("button", { name: "Next" }));

      expect(screen.queryByRole("alert", { name: "There is a problem" })).not.toBeInTheDocument();
      expect(
        screen.getByRole("textbox", {
          name: "First name *",
        }),
      ).toHaveFocus();
    });
  });

  it("saves form data on submit", async () => {
    const user = userEvent.setup();
    const mockRouter = renderWithRouter();
    await fillAllInputsExcept(screen, user, allInputFields, new Set());
    await user.click(screen.getByRole("button", { name: "Next" }));

    for (const textInputField of textInputFields) {
      expect(window.sessionStorage.getItem(textInputField.key)).toEqual(
        textInputField.expectedValue ?? textInputField.testValue,
      );
    }

    expect(mockRouter.push).toHaveBeenCalledWith("/form/personal-details/2");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("fills fields from session storage when page is loaded", () => {
    window.sessionStorage.setItem("firstName", "Jane");
    window.sessionStorage.setItem("middleName", "A");
    window.sessionStorage.setItem("lastName", "Doe");
    window.sessionStorage.setItem("dateOfBirthMonth", "1");
    window.sessionStorage.setItem("dateOfBirthDay", "8");
    window.sessionStorage.setItem("dateOfBirthYear", "1990");
    window.sessionStorage.setItem("socialSecurityNumber", "123-45-6789");
    window.sessionStorage.setItem("email", "example@test.com");
    window.sessionStorage.setItem("phoneNumber", "123-456-7890");
    renderWithRouter();

    expect(screen.getByRole("textbox", { name: "First name *" })).toHaveValue("Jane");
    expect(screen.getByRole("textbox", { name: "Middle name" })).toHaveValue("A");
    expect(screen.getByRole("textbox", { name: "Last name *" })).toHaveValue("Doe");
    expect(
      screen.getByRole("combobox", {
        name: "Month *",
      }),
    ).toHaveDisplayValue("01 - January");
    expect(screen.getByRole("textbox", { name: "Day *" })).toHaveValue("8");
    expect(screen.getByRole("textbox", { name: "Year *" })).toHaveValue("1990");
    expect(screen.getByRole("textbox", { name: "Social security number *" })).toHaveValue(
      "123-45-6789",
    );
    expect(screen.getByRole("textbox", { name: "Email address *" })).toHaveValue(
      "example@test.com",
    );
    expect(screen.getByRole("textbox", { name: "Phone number *" })).toHaveValue("123-456-7890");
  });
});
