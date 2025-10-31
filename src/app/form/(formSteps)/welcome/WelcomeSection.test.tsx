import WelcomeSection from "@/app/form/(formSteps)/welcome/WelcomeSection";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import * as nextThirdPartiesGoogle from "@next/third-parties/google";
import { screen } from "@testing-library/react";

describe("<WelcomeSection />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sends a GA event when Start Now is clicked", async () => {
    const mockSendGAEvent = jest.spyOn(nextThirdPartiesGoogle, "sendGAEvent");
    renderWithProviders(<WelcomeSection />, "/form/welcome");
    await screen.getByRole("link", { name: "Start now" }).click();
    expect(mockSendGAEvent).toHaveBeenCalledWith("event", "progressStart");
  });
});
