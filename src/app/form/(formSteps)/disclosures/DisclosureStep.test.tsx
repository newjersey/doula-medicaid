import { RouterPathnameProvider } from "@/app/form/_utils/testUtils";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    render(
      <RouterPathnameProvider pathname="/form/disclosures" router={router as AppRouterInstance}>
        <DisclosuresStep />
      </RouterPathnameProvider>,
    );
  };

  it("Only shows the tasty lunch question when the user has had breakfast", async () => {
    const user = userEvent.setup();
    renderWithRouter();

    const hadBreakfastQuestion = screen.getByRole("group", {
      name: "Have you had breakfast today?",
    });

    expect(
      screen.queryByRole("group", { name: "Was your breakfast tasty?" }),
    ).not.toBeInTheDocument();

    await user.click(within(hadBreakfastQuestion).getByRole("radio", { name: "No" }));
    expect(
      screen.queryByRole("group", { name: "Was your breakfast tasty?" }),
    ).not.toBeInTheDocument();

    await user.click(within(hadBreakfastQuestion).getByRole("radio", { name: "Yes" }));
    expect(screen.getByRole("group", { name: "Was your breakfast tasty?" })).toBeInTheDocument();
  });
});
