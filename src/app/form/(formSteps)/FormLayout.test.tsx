import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import { routes } from "@/app/form/clientRoutes";
import { within } from "@testing-library/dom";
import { screen } from "@testing-library/react";

describe("<FormLayout />", () => {
  it("shows the section progress bar", () => {
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

  it("shows heading 1 with the step indicator and section title when the title is different from the section name", () => {
    renderWithProviders(routes, "/form/finish");
    const progressBarTitle = "Finish";
    const sectionTitle = "Download forms";

    const progressSection = screen.getByRole("generic", { name: /progress/i });
    const progressBarTitles = within(progressSection)
      .getAllByRole("listitem")
      .map((section) => section.textContent);
    expect(progressBarTitles.includes(progressBarTitle)).toBe(true);

    const heading1 = screen.getByRole("heading", { level: 1 });
    expect(heading1).toHaveTextContent(sectionTitle);
  });

  it("shows heading 1 with only section title when the section has multiple steps", () => {
    renderWithProviders(routes, "/form/personal-details/2");
    const heading1 = screen.getByRole("heading", { level: 1 });
    expect(heading1).toHaveTextContent("2 of 3 Personal details");
  });

  it("shows heading 1 with the step indicator and section title when the section does not have steps", () => {
    renderWithProviders(routes, "/form/finish");
    const heading1 = screen.getByRole("heading", { level: 1 });
    expect(heading1).toHaveTextContent("Download forms");
  });

  it("shows required field indicator text with an asterisk", () => {
    renderWithProviders(routes, "/form/business-details/1");

    expect(screen.getByText(/A red asterisk.*indicates a required field/)).toBeInTheDocument();

    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
