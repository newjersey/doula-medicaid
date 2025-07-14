import { within } from "@testing-library/dom";
import { render, screen } from "@testing-library/react";
import { FormLayout } from "./layout";

describe("<FormLayout />", () => {
  it("shows the section progress bar", () => {
    render(
      <FormLayout pathname="/form/disclosures/1">
        <div>Test content</div>
      </FormLayout>,
    );
    const progressSection = screen.getByRole("generic", { name: /progress/i });
    const sections = within(progressSection).getAllByRole("listitem");
    expect(sections.length).toEqual(3);
    expect(sections[0]).toHaveTextContent("Personal details");
    expect(sections[0]).toHaveTextContent("completed");
    expect(sections[1]).toHaveTextContent("Disclosures");
    expect(sections[1].getAttribute("aria-current")).toEqual("true");
    expect(sections[2]).toHaveTextContent("Download forms");
    expect(sections[2]).toHaveTextContent("not completed");
  });

  it("shows heading 1 with the step indicator and section title when the title is different from the section name", () => {
    render(
      <FormLayout pathname="/form/disclosures/1">
        <div>Test content</div>
      </FormLayout>,
    );
    const sectionName = "Disclosures";
    const sectionTitle = "Disclosure of ownership";

    const progressSection = screen.getByRole("generic", { name: /progress/i });
    const sectionNames = within(progressSection)
      .getAllByRole("listitem")
      .map((section) => section.textContent);
    expect(sectionNames.includes(sectionName)).toBe(true);

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
});
