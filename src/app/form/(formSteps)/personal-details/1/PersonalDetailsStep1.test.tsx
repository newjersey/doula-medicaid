import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { RouterPathnameProvider } from "../../../_utils/testUtils";
import PersonalDetailsStep1 from "./page";

describe("<PersonalDetailsStep1 />", () => {
  afterEach(() => {
    window.sessionStorage.clear();
  });

  const renderWithRouter = () => {
    const mockPush = jest.fn();
    const mockRefresh = jest.fn();
    const router: Partial<AppRouterInstance> = {
      push: mockPush,
      refresh: mockRefresh,
    };
    render(
      <RouterPathnameProvider
        pathname="/form/personal-details/1"
        router={router as AppRouterInstance}
      >
        <PersonalDetailsStep1 />
      </RouterPathnameProvider>,
    );
  };

  it.each([
    { name: "First name *", key: "firstName", testValue: "Test first name" },
    { name: "Middle name (optional)", key: "middleName", testValue: "Test middle name" },
    { name: "Last name *", key: "lastName", testValue: "Test last name" },
    { name: "Date of birth *", key: "dateOfBirth", testValue: "01/01/1990" },
    {
      name: "Social security number *",
      key: "socialSecurityNumber",
      testValue: "123456789",
      type: "ssn",
    },
    { name: "Email address *", key: "email", testValue: "test@test.com" },
    { name: "NPI number *", key: "npiNumber", testValue: "2222222222" },
    { name: "Phone number *", key: "phoneNumber", testValue: "1111111111", type: "tel" },
    { name: "Street address 1 *", key: "streetAddress1", testValue: "Test address 1" },
    { name: "Street address 2 (optional)", key: "streetAddress2", testValue: "Test address 2" },
    { name: "City *", key: "city", testValue: "Test city" },
    { name: "ZIP code *", key: "zip", testValue: "12345" },
  ])("updates the $name text input", async ({ name, key, testValue, type }) => {
    const user = userEvent.setup();
    renderWithRouter();
    const nextButton = screen.getByRole("button", { name: "Next" });
    const inputField = screen.getByRole("textbox", {
      name: name,
    });
    expect(window.sessionStorage.getItem(key)).toEqual(null);

    await user.type(inputField, testValue);
    await user.click(nextButton);

    if (type === "tel") {
      const formattedValue = testValue.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      expect(inputField).toHaveValue(formattedValue);
      expect(window.sessionStorage.getItem(key)).toEqual(formattedValue);
    } else if (type === "ssn") {
      const formattedValue = testValue.replace(/(\d{3})(\d{2})(\d{4})/, "$1-$2-$3");
      expect(inputField).toHaveValue(formattedValue);
      expect(window.sessionStorage.getItem(key)).toEqual(formattedValue);
    } else {
      expect(inputField).toHaveValue(testValue);
      expect(window.sessionStorage.getItem(key)).toEqual(testValue);
    }
  });

  it("updates address state", async () => {
    const user = userEvent.setup();
    renderWithRouter();
    const nextButton = screen.getByRole("button", { name: "Next" });
    const combobox = screen.getByRole("combobox", {
      name: "State *",
    });
    expect(combobox).toHaveValue("NJ");

    await user.selectOptions(combobox, "PA");
    await user.click(nextButton);

    expect(combobox).toHaveValue("PA");
    expect(window.sessionStorage.getItem("state")).toEqual("PA");
  });

  it("keeps all fields filled when reloading page", () => {
    window.sessionStorage.setItem("firstName", "Jane");
    window.sessionStorage.setItem("middleName", "A");
    window.sessionStorage.setItem("lastName", "Doe");
    window.sessionStorage.setItem("dateOfBirth", "01/01/1990");
    window.sessionStorage.setItem("socialSecurityNumber", "123-45-6789");
    window.sessionStorage.setItem("email", "example@test.com");
    window.sessionStorage.setItem("npiNumber", "1234567890");
    window.sessionStorage.setItem("phoneNumber", "123-456-7890");
    window.sessionStorage.setItem("streetAddress1", "123 Main St");
    window.sessionStorage.setItem("streetAddress2", "Apt 4B");
    window.sessionStorage.setItem("city", "Newark");
    window.sessionStorage.setItem("state", "NJ");
    window.sessionStorage.setItem("zip", "12345");
    renderWithRouter();

    expect(screen.getByRole("textbox", { name: "First name *" })).toHaveValue("Jane");
    expect(screen.getByRole("textbox", { name: "Middle name (optional)" })).toHaveValue("A");
    expect(screen.getByRole("textbox", { name: "Last name *" })).toHaveValue("Doe");
    expect(screen.getByRole("textbox", { name: "Date of birth *" })).toHaveValue("01/01/1990");
    expect(screen.getByRole("textbox", { name: "Social security number *" })).toHaveValue(
      "123-45-6789",
    );
    expect(screen.getByRole("textbox", { name: "Email address *" })).toHaveValue("example@test.com");
    expect(screen.getByRole("textbox", { name: "NPI number *" })).toHaveValue("1234567890");
    expect(screen.getByRole("textbox", { name: "Phone number *" })).toHaveValue("123-456-7890");
    expect(screen.getByRole("textbox", { name: "Street address 1 *" })).toHaveValue("123 Main St");
    expect(screen.getByRole("textbox", { name: "Street address 2 (optional)" })).toHaveValue(
      "Apt 4B",
    );
    expect(screen.getByRole("textbox", { name: "City *" })).toHaveValue("Newark");
    expect(screen.getByRole("combobox", { name: "State *" })).toHaveValue("NJ");
    expect(screen.getByRole("textbox", { name: "ZIP code *" })).toHaveValue("12345");
  });

  describe("<PersonalDetailsStep1 /> required fields", () => {
    it.each([
      { label: "First name *", role: "textbox" },
      { label: "Last name *", role: "textbox" },
      { label: "Date of birth *", role: "textbox" },
      { label: "Phone number *", role: "textbox" },
      { label: "Email address *", role: "textbox" },
      { label: "Social security number *", role: "textbox" },
      { label: "NPI number *", role: "textbox" },
      { label: "Street address 1 *", role: "textbox" },
      { label: "City *", role: "textbox" },
      { label: "ZIP code *", role: "textbox" },
      { label: "State *", role: "combobox" },
    ])("checks that $label is marked as required", ({ label, role }) => {
      renderWithRouter();

      const input = screen.getByRole(role, {
        name: label,
      });

      expect(input).toBeRequired();
    });
  });
});
