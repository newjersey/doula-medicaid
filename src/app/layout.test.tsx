import RootLayout from "@/app/layout";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<RootLayout />", () => {
  it("it has a skip nav that is the first item in the body and skips to main content when clicked", async () => {
    const user = userEvent.setup();
    render(
      <RootLayout>
        <div>Test child</div>
      </RootLayout>,
    );
    await user.tab();
    const skipNavigationButton = screen.getByRole("link", { name: "Skip to main content" });
    expect(skipNavigationButton).toHaveFocus();

    const skipNavigationHref = skipNavigationButton.getAttribute("href") as string;
    expect(skipNavigationHref.substring(0, 1)).toEqual("#");
    expect(document.getElementById(skipNavigationHref.substring(1))?.tagName).toEqual("MAIN");
  });
});
