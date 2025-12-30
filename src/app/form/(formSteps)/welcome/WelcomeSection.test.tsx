import WelcomeSection from "@/app/form/(formSteps)/welcome/WelcomeSection";
import * as googleAnalytics from "@/app/form/_utils/googleAnalytics";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<WelcomeSection />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends a GA event when Start Now is clicked", async () => {
    const user = userEvent.setup();
    const mockSendGAEvent = vi.spyOn(googleAnalytics, "sendGAEvent");
    renderWithProviders(<WelcomeSection />, "/form/welcome");
    await user.click(screen.getByRole("link", { name: "Start now" }));
    expect(mockSendGAEvent).toHaveBeenCalledWith("event", "progressStart");
  });
});
