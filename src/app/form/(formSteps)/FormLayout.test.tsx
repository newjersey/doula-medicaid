import { FormLayout } from "@form/(formSteps)/FormLayout";
import { within } from "@testing-library/dom";
import { render, screen } from "@testing-library/react";

describe("<FormLayout />", () => {
  it("shows the section progress bar", () => {
    render(
      <FormLayout pathname="/form/disclosures/1">
        <div>Test content</div>
      </FormLayout>,
    );
    const progressSection = screen.getByRole("generic", { name: /progress/i });
    const sections = within(progressSection).getAllByRole("listitem");
    expect(sections.length).toEqual(6);
    expect(sections[0]).toHaveTextContent("Personal details");
    expect(sections[0]).toHaveTextContent("completed");
    expect(sections[1]).toHaveTextContent("Disclosures");
    expect(sections[1].getAttribute("aria-current")).toEqual("true");
    expect(sections[2]).toHaveTextContent("Section 3");
    expect(sections[2]).toHaveTextContent("not completed");
    expect(sections[3]).toHaveTextContent("Section 4");
    expect(sections[3]).toHaveTextContent("not completed");
    expect(sections[4]).toHaveTextContent("Section 5");
    expect(sections[4]).toHaveTextContent("not completed");
    expect(sections[5]).toHaveTextContent("Download forms");
    expect(sections[5]).toHaveTextContent("not completed");
  });

  it("shows heading 1 with the step indicator and section title when the title is different from the section name", () => {
    render(
      <FormLayout pathname="/form/disclosures/1">
        <div>Test content</div>
      </FormLayout>,
    );
    const progressBarTitle = "Disclosures";
    const sectionTitle = "Disclosure of ownership";

    const progressSection = screen.getByRole("generic", { name: /progress/i });
    const progressBarTitles = within(progressSection)
      .getAllByRole("listitem")
      .map((section) => section.textContent);
    expect(progressBarTitles.includes(progressBarTitle)).toBe(true);

    const heading1 = screen.getByRole("heading", { level: 1 });
    expect(heading1).toHaveTextContent(`1 of 1 ${sectionTitle}`);
  });

  it("shows heading 1 with only section title when the section has multiple steps", () => {
    render(
      <FormLayout pathname="/form/personal-details/2">
        <div>Test content</div>
      </FormLayout>,
    );
    const heading1 = screen.getByRole("heading", { level: 1 });
    expect(heading1).toHaveTextContent("2 of 3 Personal details");
  });

  it("shows heading 1 with the step indicator and section title when the section does not have steps", () => {
    render(
      <FormLayout pathname="/form/download">
        <div>Test content</div>
      </FormLayout>,
    );
    const heading1 = screen.getByRole("heading", { level: 1 });
    expect(heading1).toHaveTextContent("Download forms");
  });

  it("shows required field indicator text with an asterisk", () => {
    render(
      <FormLayout pathname="/form/disclosures/1">
        <div>Test content</div>
      </FormLayout>,
    );

    expect(screen.getByText(/A red asterisk.*indicates a required field/)).toBeInTheDocument();

    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
