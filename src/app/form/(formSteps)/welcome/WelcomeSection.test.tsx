import WelcomeSection from "@/app/form/(formSteps)/welcome/WelcomeSection";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import * as nextThirdPartiesGoogle from "@next/third-parties/google";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<WelcomeSection />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sends a GA event when Start Now is clicked", async () => {
    const user = userEvent.setup();
    const mockSendGAEvent = jest.spyOn(nextThirdPartiesGoogle, "sendGAEvent");
    renderWithProviders(<WelcomeSection />, "/form/welcome");
    await user.click(screen.getByRole("link", { name: "Start now" }));
    expect(mockSendGAEvent).toHaveBeenCalledWith("event", "progressStart");
  });
});
