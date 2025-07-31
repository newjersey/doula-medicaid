import PersonalDetailsStep1 from "@form/(formSteps)/personal-details/1/page";
import { RouterPathnameProvider } from "@form/_utils/testUtils";
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
  { name: "Social security number *", key: "socialSecurityNumber", testValue: "123456789" },
  { name: "Phone number *", key: "phoneNumber", testValue: "3211234567" },
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

  it.each(textInputFields)("updates the $name text input", async ({ name, testValue }) => {
    const user = userEvent.setup();
    renderWithRouter();
    const inputField = screen.getByRole("textbox", {
      name: name,
    });
    expect(inputField).toHaveValue("");

    await user.type(inputField, testValue);
    expect(inputField).toHaveValue(testValue);
  });

  it("updates the date of birth month", async () => {
    const user = userEvent.setup();
    renderWithRouter();
    const combobox = screen.getByRole("combobox", {
      name: "Month *",
    });
    await user.selectOptions(combobox, "07 - July");
    expect(combobox).toHaveValue("7");
  });

  it("saves form data on submit", async () => {
    const user = userEvent.setup();
    const mockRouter = renderWithRouter();
    for (const textInputField of textInputFields) {
      const inputField = screen.getByRole("textbox", {
        name: textInputField.name,
      });
      expect(window.sessionStorage.getItem(textInputField.key)).toEqual(null);
      await user.type(inputField, textInputField.testValue);
    }
    const combobox = screen.getByRole("combobox", {
      name: "Month *",
    });
    await user.selectOptions(combobox, "07 - July");

    const nextButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextButton);

    for (const textInputField of textInputFields) {
      expect(window.sessionStorage.getItem(textInputField.key)).toEqual(textInputField.testValue);
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

  it.each([
    { labelWithoutAsterisk: "First name", role: "textbox" },
    { labelWithoutAsterisk: "Last name", role: "textbox" },
    { labelWithoutAsterisk: "Month", role: "combobox" },
    { labelWithoutAsterisk: "Day", role: "textbox" },
    { labelWithoutAsterisk: "Year", role: "textbox" },
    { labelWithoutAsterisk: "Phone number", role: "textbox" },
    { labelWithoutAsterisk: "Email address", role: "textbox" },
    { labelWithoutAsterisk: "Social security number", role: "textbox" },
  ])(
    "marks $labelWithoutAsterisk as required and displays an error message if it is not filled in",
    async ({ labelWithoutAsterisk, role }) => {
      const user = userEvent.setup();
      renderWithRouter();

      const input = screen.getByRole(role, {
        name: `${labelWithoutAsterisk} *`,
      });
      expect(input).toBeRequired();

      const nextButton = screen.getByRole("button", { name: "Next" });
      await user.click(nextButton);

      expect(input).toHaveAccessibleDescription(
        expect.stringContaining(`${labelWithoutAsterisk} is required`),
      );
    },
  );

  it.each([{ labelWithoutAsterisk: "Day" }, { labelWithoutAsterisk: "Year" }])(
    "it validates that $labelWithoutAsterisk is a number",
    async ({ labelWithoutAsterisk }) => {
      const user = userEvent.setup();
      renderWithRouter();

      const input = screen.getByRole("textbox", {
        name: `${labelWithoutAsterisk} *`,
      });

      await user.type(input, "test");
      const nextButton = screen.getByRole("button", { name: "Next" });
      await user.click(nextButton);

      expect(input).toHaveAccessibleDescription(
        expect.stringContaining(`${labelWithoutAsterisk} must be a number`),
      );
    },
  );

  it("displays an error message if the email format is invalid", async () => {
    const user = userEvent.setup();
    renderWithRouter();

    const input = screen.getByRole("textbox", {
      name: `Email address *`,
    });
    await user.type(input, "invalid-email");
    const nextButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextButton);

    expect(input).toHaveAccessibleDescription(
      expect.stringContaining("Entered value does not match email format"),
    );
  });

  it("shows an error summary if there are 3 or more errors", async () => {
    const user = userEvent.setup();
    renderWithRouter();
    const requiredInputsToLeaveEmpty = [
      { label: "First name *", errorMessage: "First name is required" },
      { label: "Day *", errorMessage: "Day is required" },
      { label: "Email address *", errorMessage: "Email address is required" },
    ];

    const requiredInputsToLeaveEmptyLabels = new Set(
      requiredInputsToLeaveEmpty.map((x) => x.label),
    );
    for (const textInputField of textInputFields) {
      if (!requiredInputsToLeaveEmptyLabels.has(textInputField.name)) {
        const inputField = screen.getByRole("textbox", {
          name: textInputField.name,
        });
        expect(window.sessionStorage.getItem(textInputField.key)).toEqual(null);
        await user.type(inputField, textInputField.testValue);
      }
    }
    const combobox = screen.getByRole("combobox", {
      name: "Month *",
    });
    await user.selectOptions(combobox, "07 - July");

    const nextButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextButton);

    const focusedElement = document.activeElement as HTMLElement;
    const errorSummary = within(focusedElement).getByRole("alert", { name: "There is a problem" });

    for (const field of requiredInputsToLeaveEmpty) {
      expect(errorSummary).toHaveTextContent(field.errorMessage);
    }
  });

  it("does not show an error summary if there are fewer than 3 errors", async () => {
    const user = userEvent.setup();
    renderWithRouter();
    const requiredInputsToLeaveEmpty = [
      { label: "First name *", errorMessage: "First name is required" },
      { label: "Day *", errorMessage: "Day is required" },
    ];

    const requiredInputsToLeaveEmptyLabels = new Set(
      requiredInputsToLeaveEmpty.map((x) => x.label),
    );
    for (const textInputField of textInputFields) {
      if (!requiredInputsToLeaveEmptyLabels.has(textInputField.name)) {
        const inputField = screen.getByRole("textbox", {
          name: textInputField.name,
        });
        expect(window.sessionStorage.getItem(textInputField.key)).toEqual(null);
        await user.type(inputField, textInputField.testValue);
      }
    }
    const combobox = screen.getByRole("combobox", {
      name: "Month *",
    });
    await user.selectOptions(combobox, "07 - July");

    const nextButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextButton);

    expect(screen.queryByRole("alert", { name: "There is a problem" })).not.toBeInTheDocument();
  });
});
