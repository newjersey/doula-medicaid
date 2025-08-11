import PersonalDetailsStep2 from "@form/(formSteps)/personal-details/2/page";
import {
  fillAllInputsExcept,
  RouterPathnameProvider,
  type InputField,
} from "@form/_utils/testUtils";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const textInputFields = [
  { name: "Street address 1 *", key: "streetAddress1", testValue: "Test address 1" },
  { name: "Street address line 2", key: "streetAddress2", testValue: "Test address 2" },
  { name: "City *", key: "city", testValue: "Test city" },
  { name: "ZIP code *", key: "zip", testValue: "12345" },
];

const allInputFields: Array<InputField> = [
  ...textInputFields,
  { name: "State *", role: "combobox", testValue: "PA" },
];

const requiredFields = [
  { labelWithoutAsterisk: "Street address 1" },
  { labelWithoutAsterisk: "City" },
  { labelWithoutAsterisk: "ZIP code" },
];

describe("<PersonalDetailsStep2 />", () => {
  const renderWithRouter = () => {
    const mockPush = jest.fn();
    const mockRefresh = jest.fn();
    const mockRouter: Partial<AppRouterInstance> = {
      push: mockPush,
      refresh: mockRefresh,
    };
    render(
      <RouterPathnameProvider
        pathname="/form/personal-details/2"
        router={mockRouter as AppRouterInstance}
      >
        <PersonalDetailsStep2 />
      </RouterPathnameProvider>,
    );
    return mockRouter;
  };

  describe("input updates", () => {
    it.each(textInputFields)("updates the $name text input", async ({ name, testValue }) => {
      const user = userEvent.setup();
      renderWithRouter();
      const input = screen.getByRole("textbox", {
        name: name,
      });
      expect(input).toHaveValue("");

      await user.type(input, testValue);
      expect(input).toHaveValue(testValue);
    });

    it("defaults address state to NJ and updates it", async () => {
      const user = userEvent.setup();
      renderWithRouter();
      const combobox = screen.getByRole("combobox", {
        name: "State *",
      });
      expect(combobox).toHaveValue("NJ");

      await user.selectOptions(combobox, "PA");
      expect(combobox).toHaveValue("PA");
    });
  });

  describe("individual input validation and error messages", () => {
    it.each(requiredFields)(
      "marks $labelWithoutAsterisk as required and displays an error message if it is not filled in",
      async ({ labelWithoutAsterisk }) => {
        const user = userEvent.setup();
        renderWithRouter();

        const name = `${labelWithoutAsterisk} *`;
        const input = screen.getByRole("textbox", {
          name: name,
        });
        expect(input).toBeRequired();
        await fillAllInputsExcept(screen, user, allInputFields, new Set([name]));
        await user.click(screen.getByRole("button", { name: "Next" }));

        expect(input).toHaveAccessibleDescription(
          expect.stringContaining(`${labelWithoutAsterisk} is required`),
        );
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input).toHaveFocus();
      },
    );

    it("validates ZIP code", async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const input = screen.getByRole("textbox", {
        name: "ZIP code *",
      });

      await user.type(input, "aaa");
      expect(input).toHaveValue("");
      await user.type(input, "!!");
      expect(input).toHaveValue("");

      await user.type(input, "1");
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(input).toHaveAccessibleDescription(
        expect.stringContaining("ZIP code must have five digits"),
      );
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("error summary", () => {
    it("shows an error summary if there are 3 or more errors", async () => {
      const user = userEvent.setup();
      renderWithRouter();
      await user.click(screen.getByRole("button", { name: "Next" }));

      const focusedElement = document.activeElement as HTMLElement;
      expect(
        within(focusedElement).getByRole("heading", {
          name: "There is a problem",
        }),
      ).toBeInTheDocument();

      const expectedErrorMessages = [
        "Street address 1 is required",
        "City is required",
        "ZIP code is required",
      ];
      for (const errorMessage of expectedErrorMessages) {
        expect(focusedElement).toHaveTextContent(errorMessage);
      }
    });

    it.each(requiredFields)(
      "clicking on the $name error focuses on the input",
      async ({ labelWithoutAsterisk }) => {
        const user = userEvent.setup();
        renderWithRouter();
        await user.click(screen.getByRole("button", { name: "Next" }));
        await user.click(screen.getByRole("link", { name: `${labelWithoutAsterisk} is required` }));

        const input = screen.getByRole("textbox", {
          name: `${labelWithoutAsterisk} *`,
        });
        expect(input).toHaveFocus();
      },
    );

    it("does not show an error summary if there are fewer than 3 errors", async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const requiredInputsToLeaveEmpty = [
        { label: "Street address 1 *", errorMessage: "Street address is required" },
      ];
      const requiredInputsToLeaveEmptyNames = new Set(
        requiredInputsToLeaveEmpty.map((x) => x.label),
      );
      await fillAllInputsExcept(screen, user, allInputFields, requiredInputsToLeaveEmptyNames);
      await user.click(screen.getByRole("button", { name: "Next" }));

      expect(screen.queryByRole("alert", { name: "There is a problem" })).not.toBeInTheDocument();
      expect(
        screen.getByRole("textbox", {
          name: "Street address 1 *",
        }),
      ).toHaveFocus();
    });
  });

  it("saves form data on submit", async () => {
    const user = userEvent.setup();
    const mockRouter = renderWithRouter();
    await fillAllInputsExcept(screen, user, allInputFields, new Set());
    await user.click(screen.getByRole("button", { name: "Next" }));

    for (const textInputField of textInputFields) {
      expect(window.sessionStorage.getItem(textInputField.key)).toEqual(textInputField.testValue);
    }
    expect(window.sessionStorage.getItem("state")).toEqual("PA");

    expect(mockRouter.push).toHaveBeenCalledWith("/form/personal-details/3");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("fills fields from session storage when page is loaded", () => {
    window.sessionStorage.setItem("streetAddress1", "123 Main St");
    window.sessionStorage.setItem("streetAddress2", "Apt 4B");
    window.sessionStorage.setItem("city", "Newark");
    window.sessionStorage.setItem("state", "NJ");
    window.sessionStorage.setItem("zip", "12345");
    renderWithRouter();

    expect(screen.getByRole("textbox", { name: "Street address 1 *" })).toHaveValue("123 Main St");
    expect(screen.getByRole("textbox", { name: "Street address line 2" })).toHaveValue("Apt 4B");
    expect(screen.getByRole("textbox", { name: "City *" })).toHaveValue("Newark");
    expect(screen.getByRole("combobox", { name: "State *" })).toHaveValue("NJ");
    expect(screen.getByRole("textbox", { name: "ZIP code *" })).toHaveValue("12345");
  });

  describe("Public information explainer", () => {
    it("orders the public information explainer immediately after the address input", async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const zipCodeInput = screen.getByRole("textbox", {
        name: "ZIP code *",
      });
      const publicInformationExplainer = screen.getByRole("button", {
        name: "Will my information be public?",
      });
      await user.type(zipCodeInput, "1");
      expect(zipCodeInput).toHaveFocus();

      await user.tab();
      expect(publicInformationExplainer).toHaveFocus();
    });

    it("has a heading level one greater than the section heading level", () => {
      renderWithRouter();
      const sectionHeadingLevel = 2;
      const addressSectionHeading = screen.getByRole("heading", {
        name: "Mailing address",
        level: sectionHeadingLevel,
      });
      expect(addressSectionHeading).toBeInTheDocument();
      const publicInformationExplainer = screen.getByRole("heading", {
        name: "Will my information be public?",
        level: sectionHeadingLevel + 1,
      });
      expect(publicInformationExplainer).toBeInTheDocument();
    });
  });
});
