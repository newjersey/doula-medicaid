import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import { routes } from "@/app/form/clientRoutes";
import { waitFor } from "@testing-library/dom";
import { screen } from "@testing-library/react";

describe("<FormLayout />", () => {
  it("does not show progress bar when shouldShowProgressBar is false", async () => {
    const name = "Welcome";
    renderWithProviders(routes, "/form/welcome");
    await waitFor(() => expect(document.title).toBe(`${name} | Doula Common App`));
    expect(screen.queryByRole("generic", { name: /progress/i })).not.toBeInTheDocument();
  });

  it("shows the progress bar when shouldShowProgressBar is true", async () => {
    const name = "Finish";
    renderWithProviders(routes, "/form/finish");
    await waitFor(() => expect(document.title).toBe(`${name} | Doula Common App`));
    expect(screen.queryByRole("generic", { name: /progress/i })).toBeInTheDocument();
  });

  it("shows heading 1 and page title with the step number and section title", async () => {
    renderWithProviders(routes, "/form/personal-details/2");
    const heading1 = screen.getByRole("heading", { level: 1 });
    expect(heading1).toHaveTextContent("2 of 3 Personal details");
    await waitFor(() => expect(document.title).toBe("Personal details 2 of 3 | Doula Common App"));
  });

  it("shows required field indicator text with an asterisk", () => {
    renderWithProviders(routes, "/form/business-details/1");
    expect(screen.getByText(/A red asterisk.*indicates a required field/)).toBeInTheDocument();
  });
});
