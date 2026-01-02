import WelcomeSection from "@/app/form/(formSteps)/welcome/WelcomeSection";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<WelcomeSection />", () => {
  it("sends a GA event when Start Now is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WelcomeSection />, "/form/welcome");
    await user.click(screen.getByRole("link", { name: "Start now" }));
    expect(window.gtag).toHaveBeenCalledWith("event", "progressStart");
  });
});
