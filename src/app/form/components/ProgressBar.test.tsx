import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import { routes } from "@/app/form/ClientRoutes";
import { waitFor, within } from "@testing-library/dom";
import { screen } from "@testing-library/react";

describe("<ProgressBar />", () => {
  let scrollToSpy: jest.SpyInstance;
  beforeEach(() => {
    scrollToSpy = jest.spyOn(window, "scrollTo");
  });

  afterEach(() => {
    scrollToSpy.mockRestore();
  });

  it("shows the progress bar", () => {
    renderWithProviders(routes, "/form/business/1");
    const progressSection = screen.getByRole("generic", { name: /progress/i });
    const sections = within(progressSection).getAllByRole("listitem");
    expect(sections.length).toEqual(6);
    expect(sections[0]).toHaveTextContent("Screening");
    expect(sections[0]).toHaveTextContent("completed");
    expect(sections[1]).toHaveTextContent("Insurance");
    expect(sections[1]).toHaveTextContent("completed");
    expect(sections[2]).toHaveTextContent("Training");
    expect(sections[2]).toHaveTextContent("completed");
    expect(sections[3]).toHaveTextContent("Personal");
    expect(sections[3]).toHaveTextContent("completed");
    expect(sections[4]).toHaveTextContent("Business");
    expect(sections[4].getAttribute("aria-current")).toEqual("true");
    expect(sections[5]).toHaveTextContent("Review");
    expect(sections[5]).toHaveTextContent("not completed");
  });

  describe("when NEXT_PUBLIC_FLAG_LEGAL is set", () => {
    const oldProcessEnv = process.env;
    beforeEach(() => {
      jest.resetModules();
      process.env = { ...oldProcessEnv, NEXT_PUBLIC_FLAG_LEGAL: "1" };
    });
    afterEach(() => {
      process.env = oldProcessEnv;
    });

    it("shows the legal section ", () => {
      renderWithProviders(routes, "/form/business/1");
      const progressSection = screen.getByRole("generic", { name: /progress/i });
      const sections = within(progressSection).getAllByRole("listitem");
      expect(sections.length).toEqual(7);
      expect(sections[0]).toHaveTextContent("Screening");
      expect(sections[1]).toHaveTextContent("Insurance");
      expect(sections[2]).toHaveTextContent("Training");
      expect(sections[3]).toHaveTextContent("Personal");
      expect(sections[4]).toHaveTextContent("Business");
      expect(sections[5]).toHaveTextContent("Legal");
      expect(sections[6]).toHaveTextContent("Review");
    });
  });

  it("shows the progress bar and page title but not the heading or required indicator when shouldShowProgressHeadingAndRequiredMessage is false", async () => {
    renderWithProviders(routes, "/form/review");
    const name = "Review";

    const progressSection = screen.getByRole("generic", { name: /progress/i });
    const names = within(progressSection)
      .getAllByRole("listitem")
      .map((section) => section.textContent);
    expect(names.includes(name)).toBe(true);
    await waitFor(() => expect(document.title).toBe(`${name} | NJ Doula Assistant`));

    const heading1 = screen.getByRole("heading", { level: 1 });
    expect(heading1).not.toHaveTextContent(name);
    expect(
      screen.queryByText(/A red asterisk.*indicates a required field/),
    ).not.toBeInTheDocument();
  });
});
