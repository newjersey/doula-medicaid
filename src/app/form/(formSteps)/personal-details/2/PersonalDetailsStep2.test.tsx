import PersonalDetailsStep2 from "@form/(formSteps)/personal-details/2/page";
import { RouterPathnameProvider } from "@form/_utils/testUtils";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const textInputFields = [
  { name: "Street address 1 *", key: "streetAddress1", testValue: "Test address 1" },
  { name: "Street address line 2", key: "streetAddress2", testValue: "Test address 2" },
  { name: "City *", key: "city", testValue: "Test city" },
  { name: "ZIP code *", key: "zip", testValue: "12345" },
];

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
      name: "State *",
    });
    await user.selectOptions(combobox, "PA");

    const nextButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextButton);

    for (const textInputField of textInputFields) {
      expect(window.sessionStorage.getItem(textInputField.key)).toEqual(textInputField.testValue);
    }
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
    renderWithRouter();

    expect(screen.getByRole("textbox", { name: "Street address 1 *" })).toHaveValue("123 Main St");
    expect(screen.getByRole("textbox", { name: "Street address line 2" })).toHaveValue("Apt 4B");
    expect(screen.getByRole("textbox", { name: "City *" })).toHaveValue("Newark");
    expect(screen.getByRole("combobox", { name: "State *" })).toHaveValue("NJ");
    expect(screen.getByRole("textbox", { name: "ZIP code *" })).toHaveValue("12345");
  });

  it.each([
    { labelWithoutAsterisk: "Street address 1" },
    { labelWithoutAsterisk: "City" },
    { labelWithoutAsterisk: "ZIP code" },
  ])(
    "marks $labelWithoutAsterisk as required and displays an error message if it is not filled in",
    async ({ labelWithoutAsterisk }) => {
      const user = userEvent.setup();
      renderWithRouter();

      const input = screen.getByRole("textbox", {
        name: `${labelWithoutAsterisk} *`,
      });
      expect(input).toBeRequired();

      const nextButton = screen.getByRole("button", { name: "Next" });
      await user.click(nextButton);

      expect(input).toHaveAccessibleDescription(
        expect.stringContaining(`${labelWithoutAsterisk} is required`),
      );
      expect(input).toHaveAttribute("aria-invalid", "true");
    },
  );

  it("shows an error summary if there are 3 or more errors", async () => {
    const user = userEvent.setup();
    renderWithRouter();
    const nextButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextButton);

    const focusedElement = document.activeElement as HTMLElement;
    const errorSummary = within(focusedElement).getByRole("alert", { name: "There is a problem" });

    const expectedErrorMessages = [
      "Street address 1 is required",
      "City is required",
      "ZIP code is required",
    ];
    for (const errorMessage of expectedErrorMessages) {
      expect(errorSummary).toHaveTextContent(errorMessage);
    }
  });

  it("does not show an error summary if there are fewer than 3 errors", async () => {
    const user = userEvent.setup();
    renderWithRouter();

    const requiredInputsToLeaveEmpty = [
      { label: "Street address 1 *", errorMessage: "Street address is required" },
    ];
    const requiredInputsToLeaveEmptyLabels = new Set(
      requiredInputsToLeaveEmpty.map((x) => x.label),
    );
    for (const textInputField of textInputFields) {
      if (!requiredInputsToLeaveEmptyLabels.has(textInputField.name)) {
        const inputField = screen.getByRole("textbox", {
          name: textInputField.name,
        });
        await user.type(inputField, textInputField.testValue);
      }
    }
    const nextButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextButton);

    expect(screen.queryByRole("alert", { name: "There is a problem" })).not.toBeInTheDocument();
  });
});
