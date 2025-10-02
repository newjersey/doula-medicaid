import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import { routes } from "@/app/form/clientRoutes";
import { waitFor, within } from "@testing-library/dom";
import { screen } from "@testing-library/react";

describe("<FormLayout />", () => {
  it("shows the progress bar", () => {
    renderWithProviders(routes, "/form/business-details/1");
    const progressSection = screen.getByRole("generic", { name: /progress/i });
    const sections = within(progressSection).getAllByRole("listitem");
    expect(sections.length).toEqual(6);
    expect(sections[0]).toHaveTextContent("Screening");
    expect(sections[0]).toHaveTextContent("completed");
    expect(sections[1]).toHaveTextContent("Insurance");
    expect(sections[1]).toHaveTextContent("completed");
    expect(sections[2]).toHaveTextContent("Training");
    expect(sections[2]).toHaveTextContent("completed");
    expect(sections[3]).toHaveTextContent("Personal details");
    expect(sections[3]).toHaveTextContent("completed");
    expect(sections[4]).toHaveTextContent("Business details");
    expect(sections[4].getAttribute("aria-current")).toEqual("true");
    expect(sections[5]).toHaveTextContent("Finish");
    expect(sections[5]).toHaveTextContent("not completed");
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

  it("shows the progress bar and page title but not the heading or required indicator when shouldHideProgressHeadingAndRequiredMessage is true", async () => {
    renderWithProviders(routes, "/form/finish");
    const name = "Finish";

    const progressSection = screen.getByRole("generic", { name: /progress/i });
    const names = within(progressSection)
      .getAllByRole("listitem")
      .map((section) => section.textContent);
    expect(names.includes(name)).toBe(true);
    await waitFor(() => expect(document.title).toBe(`${name} | Doula Common App`));

    const heading1 = screen.getByRole("heading", { level: 1 });
    expect(heading1).not.toHaveTextContent(name);
    expect(
      screen.queryByText(/A red asterisk.*indicates a required field/),
    ).not.toBeInTheDocument();
  });
});
