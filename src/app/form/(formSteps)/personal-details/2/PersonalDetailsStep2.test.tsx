import PersonalDetailsStep2 from "@form/(formSteps)/personal-details/2/page";
import { RouterPathnameProvider } from "@form/_utils/testUtils";
import { render, screen } from "@testing-library/react";
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

  it("updates address state", async () => {
    const user = userEvent.setup();
    renderWithRouter();
    const combobox = screen.getByRole("combobox", {
      name: "State, territory, or military post *",
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
      name: "State, territory, or military post *",
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
    expect(
      screen.getByRole("combobox", { name: "State, territory, or military post *" }),
    ).toHaveValue("NJ");
    expect(screen.getByRole("textbox", { name: "ZIP code *" })).toHaveValue("12345");
  });

  describe("<PersonalDetailsStep2 /> required fields", () => {
    it.each([
      { label: "Street address 1 *", role: "textbox" },
      { label: "City *", role: "textbox" },
      { label: "ZIP code *", role: "textbox" },
      { label: "State, territory, or military post *", role: "combobox" },
    ])("checks that $label is marked as required", ({ label, role }) => {
      renderWithRouter();

      const input = screen.getByRole(role, {
        name: label,
      });

      expect(input).toBeRequired();
    });
  });
});
