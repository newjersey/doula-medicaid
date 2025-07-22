import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { RouterPathnameProvider } from "../../../_utils/testUtils";
import PersonalDetailsStep2 from "./page";

describe("<PersonalDetailsStep2 />", () => {
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
        pathname="/form/personal-details/2"
        router={router as AppRouterInstance}
      >
        <PersonalDetailsStep2 />
      </RouterPathnameProvider>,
    );
  };

  it.each([
    { name: "Street address 1 *", key: "streetAddress1", testValue: "Test address 1" },
    { name: "Street address 2 (optional)", key: "streetAddress2", testValue: "Test address 2" },
    { name: "City *", key: "city", testValue: "Test city" },
    { name: "ZIP code *", key: "zip", testValue: "12345" },
  ])("updates the $name text input", async ({ name, key, testValue }) => {
    const user = userEvent.setup();
    renderWithRouter();
    const nextButton = screen.getByRole("button", { name: "Next" });
    const inputField = screen.getByRole("textbox", {
      name: name,
    });
    expect(window.sessionStorage.getItem(key)).toEqual(null);

    await user.type(inputField, testValue);
    expect(inputField).toHaveValue(testValue);

    await user.click(nextButton);
    expect(window.sessionStorage.getItem(key)).toEqual(testValue);
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
    expect(combobox).toHaveValue("PA");

    await user.click(nextButton);
    expect(window.sessionStorage.getItem("state")).toEqual("PA");
  });

  it("keeps all fields filled when reloading page", () => {
    window.sessionStorage.setItem("streetAddress1", "123 Main St");
    window.sessionStorage.setItem("streetAddress2", "Apt 4B");
    window.sessionStorage.setItem("city", "Newark");
    window.sessionStorage.setItem("state", "NJ");
    window.sessionStorage.setItem("zip", "12345");
    renderWithRouter();

    expect(screen.getByRole("textbox", { name: "Street address 1 *" })).toHaveValue("123 Main St");
    expect(screen.getByRole("textbox", { name: "Street address 2 (optional)" })).toHaveValue(
      "Apt 4B",
    );
    expect(screen.getByRole("textbox", { name: "City *" })).toHaveValue("Newark");
    expect(screen.getByRole("combobox", { name: "State *" })).toHaveValue("NJ");
    expect(screen.getByRole("textbox", { name: "ZIP code *" })).toHaveValue("12345");
  });

  describe("<PersonalDetailsStep2 /> required fields", () => {
    it.each([
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
