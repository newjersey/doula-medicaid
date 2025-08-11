import RootLayout from "@/app/layout";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<RootLayout />", () => {
  it("it has a skip nav that works", async () => {
    const user = userEvent.setup();
    render(
      <RootLayout>
        <div>Test child</div>
      </RootLayout>,
    );
    await user.tab();

    const skipNavigationButton = screen.getByRole("link", { name: "Skip to main content" });
    expect(skipNavigationButton).toHaveFocus();
  });
});
