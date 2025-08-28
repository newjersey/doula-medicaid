import ScreeningStep1 from "@/app/form/(formSteps)/screening/1/page";
import { getValue } from "@/app/form/_utils/sessionStorage";
import { RouterPathnameProvider } from "@/app/form/_utils/testUtils/RouterPathnameProvider";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const getYesSoleProprietorButton = () => {
  const soleProprietorGroup = screen.getByRole("group", {
    name: "Do you manage your business as an individual doula operating as a Sole Proprietor? Most NJ FamilyCare doulas operate as Sole Proprietor. Select one *",
  });
  const yesSoleProprietorButton = within(soleProprietorGroup).getByRole("radio", {
    name: "Yes",
  });
  return yesSoleProprietorButton;
};

const getNoSoleProprietorButton = () => {
  const soleProprietorGroup = screen.getByRole("group", {
    name: "Do you manage your business as an individual doula operating as a Sole Proprietor? Most NJ FamilyCare doulas operate as Sole Proprietor. Select one *",
  });
  const noSoleProprietorButton = within(soleProprietorGroup).getByRole("radio", {
    name: "No",
  });
  return noSoleProprietorButton;
};

describe("<ScreeningStep1 />", () => {
  const renderWithRouter = () => {
    const mockRouter: Partial<AppRouterInstance> = {
      push: jest.fn(),
      refresh: jest.fn(),
    };
    render(
      <RouterPathnameProvider pathname="/form/screening/1" router={mockRouter as AppRouterInstance}>
        <ScreeningStep1 />
      </RouterPathnameProvider>,
    );
    return mockRouter;
  };

  it("saves isSoleProprietor as true when user selects yes for sole proprietor and clicks Next", async () => {
    const user = userEvent.setup();
    const mockRouter = renderWithRouter();
    const yesSoleProprietorButton = getYesSoleProprietorButton();
    expect(yesSoleProprietorButton).not.toBeChecked();
    await user.click(yesSoleProprietorButton);
    expect(yesSoleProprietorButton).toBeChecked();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(getValue("isSoleProprietor", true)).toBe("true");
    expect(mockRouter.push).toHaveBeenCalledWith("/form/screening/2");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("shows an error message when user selects no for sole proprietor and clicks Next", async () => {
    const user = userEvent.setup();
    const mockRouter = renderWithRouter();
    const noSoleProprietorButton = getNoSoleProprietorButton();
    expect(noSoleProprietorButton).not.toBeChecked();
    await user.click(noSoleProprietorButton);
    expect(noSoleProprietorButton).toBeChecked();

    await user.click(screen.getByRole("button", { name: "Next" }));

    const yesSoleProprietorButton = getYesSoleProprietorButton();
    expect(yesSoleProprietorButton).toHaveFocus();
    expect(yesSoleProprietorButton).toHaveAccessibleDescription(
      expect.stringContaining(
        "Currently this site is only for Sole Proprietors. Please use the standard FFS application",
      ),
    );
    expect(getValue("isSoleProprietor", false)).toBe(null);
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(mockRouter.refresh).not.toHaveBeenCalled();
  });
});
