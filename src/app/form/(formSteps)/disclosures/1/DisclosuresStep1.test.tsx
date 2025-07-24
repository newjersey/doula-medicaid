import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getValue } from "../../../_utils/sessionStorage";
import { RouterPathnameProvider } from "../../../_utils/testUtils";
import DisclosuresStep1 from "./page";

describe("<DisclosuresStep1 />", () => {
  const renderWithRouter = () => {
    const mockPush = jest.fn();
    const mockRefresh = jest.fn();
    const router: Partial<AppRouterInstance> = {
      push: mockPush,
      refresh: mockRefresh,
    };
    render(
      <RouterPathnameProvider pathname="/form/disclosures/1" router={router as AppRouterInstance}>
        <DisclosuresStep1 />
      </RouterPathnameProvider>,
    );
  };

  const clickYesSPButton = async () => {
    const user = userEvent.setup();
    const yesSPButton = screen.getByTestId("soleProprietorshipYes");
    await user.click(yesSPButton);
    return { user, yesSPButton };
  };

  const clickYesSeparateAddressButton = async () => {
    const { user } = await clickYesSPButton();
    const yesButton = screen.getByTestId("separateBusinessAddressYes");
    await user.click(yesButton);
    return { user, yesButton };
  };

  it("saves natureOfDisclosingEntity as null when user selects no", async () => {
    const user = userEvent.setup();
    renderWithRouter();
    const noButton = screen.getByTestId("soleProprietorshipNo");
    await clickYesSPButton();
    expect(getValue("natureOfDisclosingEntity")).toBe("SoleProprietorship");
    await user.click(noButton);
    expect(noButton).toBeChecked();
    expect(getValue("natureOfDisclosingEntity")).toBe(null);
  });

  it("saves natureOfDisclosingEntity as SoleProprietorship when user selects yes", async () => {
    const user = userEvent.setup();
    renderWithRouter();
    const noButton = screen.getByTestId("soleProprietorshipNo");
    const yesButton = screen.getByTestId("soleProprietorshipYes");
    expect(yesButton).not.toBeChecked();
    expect(noButton).not.toBeChecked();
    expect(getValue("natureOfDisclosingEntity")).toBe(null);
    await user.click(yesButton);
    expect(yesButton).toBeChecked();
    expect(getValue("natureOfDisclosingEntity")).toBe("SoleProprietorship");
  });

  it("saves separateBusinessAddress as true when user selects yes", async () => {
    const user = userEvent.setup();
    renderWithRouter();
    const yesSPButton = await clickYesSPButton();
    expect(yesSPButton.yesSPButton).toBeChecked();
    const noButton = screen.getByTestId("separateBusinessAddressNo");
    const yesButton = screen.getByTestId("separateBusinessAddressYes");
    expect(yesButton).not.toBeChecked();
    expect(noButton).not.toBeChecked();
    expect(getValue("separateBusinessAddress")).toBe(null);
    await user.click(yesButton);
    expect(yesButton).toBeChecked();
    expect(getValue("separateBusinessAddress")).toBe("true");
  });

  it("saves separateBusinessAddress as false when user selects no", async () => {
    const user = userEvent.setup();
    renderWithRouter();
    const yesSPButton = await clickYesSPButton();
    expect(yesSPButton.yesSPButton).toBeChecked();
    const noButton = screen.getByTestId("separateBusinessAddressNo");
    await user.click(noButton);
    expect(noButton).toBeChecked();
    expect(getValue("separateBusinessAddress")).toBe("false");
  });

  it.each([
    { name: "Street address 1 *", key: "businessStreetAddress1", testValue: "123 Business Rd" },
    { name: "Street address line 2", key: "businessStreetAddress2", testValue: "Suite 100" },
    { name: "City *", key: "businessCity", testValue: "Seattle" },
    { name: "ZIP code *", key: "businessZip", testValue: "98101" },
  ])(
    "updates the text input for the $name input when user types, saves to session storage when user clicks the next button",
    async ({ name, key, testValue }) => {
      const user = userEvent.setup();
      renderWithRouter();

      await clickYesSPButton();
      await clickYesSeparateAddressButton();

      const nextButton = screen.getByRole("button", { name: "Next" });
      const inputField = screen.getByRole("textbox", {
        name: name,
      });
      expect(window.sessionStorage.getItem(key)).toEqual(null);

      await user.type(inputField, testValue);
      expect(inputField).toHaveValue(testValue);

      await user.click(nextButton);
      expect(window.sessionStorage.getItem(key)).toEqual(testValue);
    },
  );

  it("updates business address state when user clicks the next button", async () => {
    const user = userEvent.setup();
    renderWithRouter();

    await clickYesSPButton();
    await clickYesSeparateAddressButton();

    const nextButton = screen.getByRole("button", { name: "Next" });

    const combobox = screen.getByRole("combobox", {
      name: "State, territory, or military post *",
    });

    expect(combobox).toHaveValue("NJ");

    await user.selectOptions(combobox, "PA");
    expect(combobox).toHaveValue("PA");

    await user.click(nextButton);
    expect(window.sessionStorage.getItem("businessState")).toEqual("PA");
  });

  it.each([
    { label: "Street address 1 *", role: "textbox" },
    { label: "City *", role: "textbox" },
    { label: "ZIP code *", role: "textbox" },
    { label: "State, territory, or military post *", role: "combobox" },
  ])("input is marked as required", async ({ label, role }) => {
    renderWithRouter();

    await clickYesSPButton();
    await clickYesSeparateAddressButton();

    const field = screen.getByRole(role, {
      name: label,
    });

    expect(field).toBeRequired();
  });
});
