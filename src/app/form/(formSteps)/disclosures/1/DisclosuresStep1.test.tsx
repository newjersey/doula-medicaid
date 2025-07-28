import DisclosuresStep1 from "@form/(formSteps)/disclosures/1/page";
import { getValue } from "@form/_utils/sessionStorage";
import { RouterPathnameProvider } from "@form/_utils/testUtils";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

describe("<DisclosuresStep1 />", () => {
  const renderWithRouter = () => {
    const mockPush = jest.fn();
    const mockRefresh = jest.fn();
    const mockRouter: Partial<AppRouterInstance> = {
      push: mockPush,
      refresh: mockRefresh,
    };
    render(
      <RouterPathnameProvider
        pathname="/form/disclosures/1"
        router={mockRouter as AppRouterInstance}
      >
        <DisclosuresStep1 />
      </RouterPathnameProvider>,
    );
    return mockRouter;
  };

  const getYesSoleProprietorButton = () => {
    const soleProprietorGroup = screen.getByRole("group", {
      name: "Are you the sole proprietor of your business? Select one *",
    });
    const yesSoleProprietorButton = within(soleProprietorGroup).getByRole("radio", {
      name: "Yes",
    });
    return yesSoleProprietorButton;
  };

  const getNoSoleProprietorButton = () => {
    const soleProprietorGroup = screen.getByRole("group", {
      name: "Are you the sole proprietor of your business? Select one *",
    });
    const noSoleProprietorButton = within(soleProprietorGroup).getByRole("radio", {
      name: "No",
    });
    return noSoleProprietorButton;
  };

  const getYesSameAddressButton = () => {
    const separateAddressGroup = screen.getByRole("group", {
      name: "Is your business address the same as your residential and billing address? Select one *",
    });
    const getYesSeparateAddressButton = within(separateAddressGroup).getByRole("radio", {
      name: "Yes",
    });
    return getYesSeparateAddressButton;
  };

  const getNoSameAddressButton = () => {
    const separateAddressGroup = screen.getByRole("group", {
      name: "Is your business address the same as your residential and billing address? Select one *",
    });
    const getNoSeparateAddressButton = within(separateAddressGroup).getByRole("radio", {
      name: "No",
    });
    return getNoSeparateAddressButton;
  };

  const clickYesSoleProprietorButton = async () => {
    const user = userEvent.setup();
    const yesSPButton = getYesSoleProprietorButton();
    await user.click(yesSPButton);
    return { user, yesSPButton };
  };

  const clickNoSameAddressButton = async () => {
    const user = userEvent.setup();
    const noSeperateAddressButton = getNoSameAddressButton();
    await user.click(noSeperateAddressButton);
    return { user, noSeperateAddressButton };
  };

  it("saves isSoleProprietorship as false when user selects no for sole proprietorship and submits", async () => {
    const user = userEvent.setup();
    const mockRouter = renderWithRouter();
    const noSoleProprietorButton = getNoSoleProprietorButton();
    expect(noSoleProprietorButton).not.toBeChecked();
    await user.click(noSoleProprietorButton);
    expect(noSoleProprietorButton).toBeChecked();

    const nextButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextButton);
    expect(getValue("isSoleProprietorship")).toBe("false");

    expect(mockRouter.push).toHaveBeenCalledWith("/form/section-3");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("prompts to fill in the separate business address when user selects yes for separate business address", async () => {
    const user = userEvent.setup();
    renderWithRouter();

    const yesSoleProprietorButton = getYesSoleProprietorButton();
    expect(yesSoleProprietorButton).not.toBeChecked();
    await user.click(yesSoleProprietorButton);
    expect(yesSoleProprietorButton).toBeChecked();

    const businessAddressInput = screen.getByRole("heading", {
      name: "Business address",
    });
    // TODO: JOHN ADD the business address input fields
    expect(businessAddressInput).toBeInTheDocument();
  });

  it("saves hasSameBusinessAddress as true when user selects yes for same business address and submits", async () => {
    const user = userEvent.setup();
    const mockRouter = renderWithRouter();
    const yesSoleProprietorButton = getYesSoleProprietorButton();
    expect(yesSoleProprietorButton).not.toBeChecked();
    await user.click(yesSoleProprietorButton);
    expect(yesSoleProprietorButton).toBeChecked();

    const yesSameAddressButton = getYesSameAddressButton();
    await user.click(yesSameAddressButton);
    expect(yesSameAddressButton).toBeChecked();

    const nextButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextButton);

    expect(getValue("isSoleProprietorship")).toBe("true");
    expect(getValue("hasSameBusinessAddress")).toBe("true");

    expect(mockRouter.push).toHaveBeenCalledWith("/form/section-3");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("updates business address fields when user clicks the next button", async () => {
    const user = userEvent.setup();
    const mockRouter = renderWithRouter();

    await clickYesSoleProprietorButton();
    await clickNoSameAddressButton();

    const addressTextInputFields = [
      { name: "Street address 1 *", key: "businessStreetAddress1", testValue: "123 Business Rd" },
      {
        name: "Street address line 2",
        key: "businessStreetAddress2",
        testValue: "Suite 100",
      },
      { name: "City *", key: "businessCity", testValue: "Seattle" },
      { name: "ZIP code *", key: "businessZip", testValue: "98101" },
    ];

    for (const addressTextInputField of addressTextInputFields) {
      const inputField = screen.getByRole("textbox", {
        name: addressTextInputField.name,
      });
      await user.type(inputField, addressTextInputField.testValue);
      expect(inputField).toHaveValue(addressTextInputField.testValue);
    }

    const combobox = screen.getByRole("combobox", {
      name: "State, territory, or military post *",
    });
    expect(combobox).toHaveValue("NJ");
    await user.selectOptions(combobox, "PA");
    expect(combobox).toHaveValue("PA");

    const nextButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextButton);

    expect(getValue("isSoleProprietorship")).toBe("true");
    expect(getValue("hasSameBusinessAddress")).toBe("false");

    for (const addressTextInputField of addressTextInputFields) {
      expect(window.sessionStorage.getItem(addressTextInputField.key)).toEqual(
        addressTextInputField.testValue,
      );
    }
    expect(window.sessionStorage.getItem("businessState")).toEqual("PA");
    expect(mockRouter.push).toHaveBeenCalledWith("/form/section-3");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it.each([
    { label: "Street address 1 *", role: "textbox" },
    { label: "City *", role: "textbox" },
    { label: "ZIP code *", role: "textbox" },
    { label: "State, territory, or military post *", role: "combobox" },
  ])("input is marked as required", async ({ label, role }) => {
    renderWithRouter();

    await clickYesSoleProprietorButton();
    await clickNoSameAddressButton();

    const field = screen.getByRole(role, {
      name: label,
    });

    expect(field).toBeRequired();
  });
});
