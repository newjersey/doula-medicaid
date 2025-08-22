import { RouterPathnameProvider } from "@/app/form/_utils/testUtils";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import DisclosuresStep from "./page";

describe("<DisclosuresStep />", () => {
  const renderWithRouter = () => {
    const mockPush = jest.fn();
    const mockRefresh = jest.fn();
    const router: Partial<AppRouterInstance> = {
      push: mockPush,
      refresh: mockRefresh,
    };
    return render(
      <RouterPathnameProvider pathname="/form/disclosures" router={router as AppRouterInstance}>
        <DisclosuresStep />
      </RouterPathnameProvider>,
    );
  };

  it("Only shows the tasty breakfast question when the user has had breakfast", async () => {
    const user = userEvent.setup();
    renderWithRouter();

    expect(screen.queryByText("Was your breakfast tasty?")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("hadBreakfastNo"));
    expect(screen.queryByText("Was your breakfast tasty?")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("hadBreakfastYes"));
    expect(screen.getByText("Was your breakfast tasty?")).toBeInTheDocument();
  });

  it("does not have axe violations", async () => {
    const { container } = renderWithRouter();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
