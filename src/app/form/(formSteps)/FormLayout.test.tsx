import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import { routes } from "@/app/form/ClientRoutes";
import { waitFor } from "@testing-library/dom";
import { screen } from "@testing-library/react";

describe("<FormLayout />", () => {
  let scrollToSpy: jest.SpyInstance;
  beforeEach(() => {
    scrollToSpy = jest.spyOn(window, "scrollTo");
  });

  afterEach(() => {
    scrollToSpy.mockRestore();
  });

  it("does not show progress bar when shouldShowProgressBar is false", async () => {
    const name = "Welcome";
    renderWithProviders(routes, "/form/welcome");
    await waitFor(() => expect(document.title).toBe(`${name} | NJ Doula Assistant`));
    expect(screen.queryByRole("generic", { name: /progress/i })).not.toBeInTheDocument();

    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
    expect(scrollToSpy).toHaveBeenCalledTimes(1);
  });

  it("shows the progress bar when shouldShowProgressBar is true", async () => {
    const name = "Review";
    renderWithProviders(routes, "/form/review");
    await waitFor(() => expect(document.title).toBe(`${name} | NJ Doula Assistant`));
    expect(screen.queryByRole("generic", { name: /progress/i })).toBeInTheDocument();

    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
    expect(scrollToSpy).toHaveBeenCalledTimes(1);
  });

  it("shows heading 1 and page title with the step number and section title", async () => {
    renderWithProviders(routes, "/form/personal/2");
    const heading1 = screen.getByRole("heading", { level: 1 });
    expect(heading1).toHaveTextContent("2 of 4 Personal");
    await waitFor(() => expect(document.title).toBe("Personal 2 of 4 | NJ Doula Assistant"));

    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
    expect(scrollToSpy).toHaveBeenCalledTimes(1);
  });

  it("shows required field indicator text with an asterisk", () => {
    renderWithProviders(routes, "/form/business/1");
    expect(screen.getByText(/A red asterisk.*indicates a required field/)).toBeInTheDocument();

    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
    expect(scrollToSpy).toHaveBeenCalledTimes(1);
  });
});
