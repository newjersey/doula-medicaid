import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { RouterPathnameProvider } from "../../../_utils/testUtils";
import PersonalDetailsStep1 from "./page";

const textInputFields = [
  { name: "First name *", key: "firstName", testValue: "Test first name" },
  { name: "Middle name (optional)", key: "middleName", testValue: "Test middle name" },
  { name: "Last name *", key: "lastName", testValue: "Test last name" },
  { name: "Date of birth *", key: "dateOfBirth", testValue: "01/01/1990" },
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
    window.sessionStorage.setItem("dateOfBirth", "01/01/1990");
    window.sessionStorage.setItem("socialSecurityNumber", "123-45-6789");
    window.sessionStorage.setItem("email", "example@test.com");
    window.sessionStorage.setItem("phoneNumber", "123-456-7890");
    renderWithRouter();

    expect(screen.getByRole("textbox", { name: "First name *" })).toHaveValue("Jane");
    expect(screen.getByRole("textbox", { name: "Middle name (optional)" })).toHaveValue("A");
    expect(screen.getByRole("textbox", { name: "Last name *" })).toHaveValue("Doe");
    expect(screen.getByRole("textbox", { name: "Date of birth *" })).toHaveValue("01/01/1990");
    expect(screen.getByRole("textbox", { name: "Social security number *" })).toHaveValue(
      "123-45-6789",
    );
    expect(screen.getByRole("textbox", { name: "Email address *" })).toHaveValue(
      "example@test.com",
    );
    expect(screen.getByRole("textbox", { name: "Phone number *" })).toHaveValue("123-456-7890");
  });

  describe("<PersonalDetailsStep1 /> required fields", () => {
    it.each([
      { label: "First name *", role: "textbox" },
      { label: "Last name *", role: "textbox" },
      { label: "Date of birth *", role: "textbox" },
      { label: "Phone number *", role: "textbox" },
      { label: "Email address *", role: "textbox" },
      { label: "Social security number *", role: "textbox" },
    ])("checks that $label is marked as required", ({ label, role }) => {
      renderWithRouter();

      const input = screen.getByRole(role, {
        name: label,
      });

      expect(input).toBeRequired();
    });
  });
});
