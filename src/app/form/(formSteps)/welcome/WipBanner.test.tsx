import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import { screen } from "@testing-library/react";
import WipBanner from "./WipBanner";

describe("WipBanner", () => {
  it("renders the banner when on the welcome section", () => {
    renderWithProviders(<WipBanner />, "/form/welcome");

    expect(screen.getByText(/This tool is a work in progress/)).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "Medicaid Fee-for-Service application" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://www.njmmis.com/providerEnrollment.aspx");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
  });

  it("does not render the banner when not on the welcome section", () => {
    renderWithProviders(<WipBanner />, "/form/screening/1");
    expect(screen.queryByText(/This tool is a work in progress/)).not.toBeInTheDocument();
  });
});
