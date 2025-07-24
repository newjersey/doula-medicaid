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

  const clickYesSPButton = async () => {
    const user = userEvent.setup();
    const yesSPButton = screen.getByTestId("soleProprietorshipYes");
    await user.click(yesSPButton);
    return { user, yesSPButton };
  };

  const clickYesSeparateAddressButton = async () => {
    const { user } = await clickYesSPButton();
    const yesSeparateAddressButton = screen.getByTestId("separateBusinessAddressYes");
    await user.click(yesSeparateAddressButton);
    return { user, yesSPButton: yesSeparateAddressButton };
  };

  it("prompts the separate address question when user selects yes for sole proprietorship", async () => {
    const user = userEvent.setup();
    renderWithRouter();
    const yesSPButton = screen.getByTestId("soleProprietorshipYes");
    expect(yesSPButton).not.toBeChecked();
    await user.click(yesSPButton);
    expect(yesSPButton).toBeChecked();

    const separateBusinessAddressQuestion = screen.getByText(
      "Is your business address the same as your residential and billing address?",
    );
    expect(separateBusinessAddressQuestion).toBeInTheDocument();
  });

  it("saves isSoleProprietorship as false when user selects no for sole proprietorship and submits", async () => {
    const user = userEvent.setup();
    const mockRouter = renderWithRouter();
    const noSPButton = screen.getByTestId("soleProprietorshipNo");
    expect(noSPButton).not.toBeChecked();
    await user.click(noSPButton);
    expect(noSPButton).toBeChecked();

    const nextButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextButton);
    expect(getValue("isSoleProprietorship")).toBe("false");

    expect(mockRouter.push).toHaveBeenCalledWith("/form/step-3");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("prompts to fill in the separate business address when user selects yes for separate business address", async () => {
    const user = userEvent.setup();
    renderWithRouter();

    const yesSPButton = screen.getByTestId("soleProprietorshipYes");
    expect(yesSPButton).not.toBeChecked();
    await user.click(yesSPButton);
    expect(yesSPButton).toBeChecked();

    const businessAddressInput = screen.getByRole("heading", {
      name: "Business address",
    });
    expect(businessAddressInput).toBeInTheDocument();
  });

  it("saves hasSeparateBusinessAddress as false when user selects no for separate business address and submits", async () => {
    const user = userEvent.setup();
    const mockRouter = renderWithRouter();
    const yesSPButton = await clickYesSPButton();
    expect(yesSPButton.yesSPButton).toBeChecked();
    const noSPButton = screen.getByTestId("separateBusinessAddressNo");
    await user.click(noSPButton);
    expect(noSPButton).toBeChecked();

    const nextButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextButton);

    expect(getValue("isSoleProprietorship")).toBe("true");
    expect(getValue("hasSeparateBusinessAddress")).toBe("false");

    expect(mockRouter.push).toHaveBeenCalledWith("/form/step-3");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("updates and saves the separate business address when user submits", async () => {
    const user = userEvent.setup();
    const mockRouter = renderWithRouter();
    await clickYesSPButton();
    await clickYesSeparateAddressButton();

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
    expect(getValue("hasSeparateBusinessAddress")).toBe("true");

    for (const addressTextInputField of addressTextInputFields) {
      expect(window.sessionStorage.getItem(addressTextInputField.key)).toEqual(
        addressTextInputField.testValue,
      );
    }
    expect(window.sessionStorage.getItem("businessState")).toEqual("PA");

    expect(mockRouter.push).toHaveBeenCalledWith("/form/step-3");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });
});
