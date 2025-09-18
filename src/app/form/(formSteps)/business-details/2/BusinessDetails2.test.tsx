import BusinessDetails2 from "@/app/form/(formSteps)/business-details/2/page";
import { fillField, getInputField } from "@/app/form/_utils/testUtils/fillInputs";
import { RouterPathnameProvider } from "@/app/form/_utils/testUtils/RouterPathnameProvider";
import {
  testFillFromSessionStorage,
  testRequiredField,
  testSaveFieldsToSessionStorage,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const yesHasEin: TestField = {
  name: "Yes",
  sessionStorageKey: "hasEin",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "true",
  expectedValue: "true",
  withinGroupName: "Do you have an Employee Identification Number (EIN)? Select one *",
};
const noHasEin: TestField = {
  name: "No",
  sessionStorageKey: "hasEin",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "false",
  expectedValue: "false",
  withinGroupName: "Do you have an Employee Identification Number (EIN)? Select one *",
};

const minimalTestFields = [noHasEin];

const einField: TestField = {
  name: "EIN *",
  sessionStorageKey: "ein",
  required: true,
  requiredErrorMessage: "EIN is required",
  role: "textbox",
  testValue: "111111111",
  expectedValue: "11-1111111",
  prerequisiteField: yesHasEin,
};

const allTestFields = [yesHasEin, einField];

describe("<BusinessDetails2 />", () => {
  const renderWithRouter = () => {
    const mockRouter: Partial<AppRouterInstance> = {
      push: jest.fn(),
      refresh: jest.fn(),
    };
    render(
      <RouterPathnameProvider
        pathname="/form/business-details/2"
        router={mockRouter as AppRouterInstance}
      >
        <BusinessDetails2 />
      </RouterPathnameProvider>,
    );
    return mockRouter;
  };

  describe("saves fields to session storage on submit", () => {
    it("when the user does not have an EIN", async () => {
      await testSaveFieldsToSessionStorage(
        minimalTestFields,
        minimalTestFields,
        renderWithRouter,
        screen,
        "/form/business-details/3",
      );
    });
    it("when the user does has an EIN", async () => {
      await testSaveFieldsToSessionStorage(
        allTestFields,
        allTestFields,
        renderWithRouter,
        screen,
        "/form/business-details/3",
      );
    });
  });
  describe("marks fields as required and displays an error message", () => {
    it("when hasEin is not filled in", async () => {
      await testRequiredField(yesHasEin, minimalTestFields, renderWithRouter, screen);
    });

    it("when the user has an EIN and EIN is not filled in", async () => {
      await testRequiredField(einField, allTestFields, renderWithRouter, screen);
    });
  });

  it.each(allTestFields)(
    "fills $sessionStorageKey from session storage when page is loaded",
    async (field: TestField) => {
      await testFillFromSessionStorage(field, renderWithRouter, screen);
    },
  );

  it("shows/hides the EIN field based on the hasEin question and persists when toggled", async () => {
    const user = userEvent.setup();
    renderWithRouter();
    await fillField(screen, user, yesHasEin);

    const input = screen.getByRole("textbox", {
      name: "EIN *",
    });
    await user.type(input, "111111111");
    expect(input).toHaveValue("11-1111111");

    await fillField(screen, user, noHasEin);
    expect(input).not.toBeInTheDocument();

    await fillField(screen, user, yesHasEin);
    expect(input).toHaveValue("11-1111111");
  });

  it("validates EIN format", async () => {
    const user = userEvent.setup();
    renderWithRouter();
    await fillField(screen, user, yesHasEin);
    const input = screen.getByRole("textbox", {
      name: "EIN *",
    });

    await user.type(input, "aaa");
    expect(input).toHaveValue("");
    await user.type(input, "!!");
    expect(input).toHaveValue("");

    await user.type(input, "111");
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(input).toHaveAccessibleDescription(
      expect.stringContaining("Entered value does not match the EIN format"),
    );
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  describe("EIN explainer", () => {
    it("orders the EIN explainer immediately after the EIN input", async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const noHasEinInput = await getInputField(screen, noHasEin);
      await user.click(noHasEinInput);
      expect(noHasEinInput).toHaveFocus();

      await user.tab();
      const einExplainer = screen.getByRole("button", {
        name: "What is an Employee Identification Number (EIN)?",
      });
      expect(einExplainer).toHaveFocus();
    });

    it("has a heading level one greater than the section heading level", () => {
      renderWithRouter();
      const sectionHeadingLevel = 2;
      const einSectionHeading = screen.getByRole("heading", {
        name: "Tax ID",
        level: sectionHeadingLevel,
      });
      expect(einSectionHeading).toBeInTheDocument();
      const einExplainer = screen.getByRole("heading", {
        name: "What is an Employee Identification Number (EIN)?",
        level: sectionHeadingLevel + 1,
      });
      expect(einExplainer).toBeInTheDocument();
    });
  });
});
