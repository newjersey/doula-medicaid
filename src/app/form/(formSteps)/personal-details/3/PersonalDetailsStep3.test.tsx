import PersonalDetailsStep3 from "@form/(formSteps)/personal-details/3/page";
import { fillAllInputsExcept, RouterPathnameProvider } from "@form/_utils/testUtils";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const textInputFields = [
  { name: "National Provider Identifier (NPI) *", key: "npiNumber", testValue: "1111111111" },
  { name: "UPIN number (optional)", key: "upinNumber", testValue: "12345" },
  {
    name: "Medicare provider ID (optional)",
    key: "medicareProviderId",
    testValue: "ABC12345",
  },
];

describe("<PersonalDetailsStep3 />", () => {
  const renderWithRouter = () => {
    const mockPush = jest.fn();
    const mockRefresh = jest.fn();
    const mockRouter: Partial<AppRouterInstance> = {
      push: mockPush,
      refresh: mockRefresh,
    };
    render(
      <RouterPathnameProvider
        pathname="/form/personal-details/3"
        router={mockRouter as AppRouterInstance}
      >
        <PersonalDetailsStep3 />
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
  });

  describe("validation and error messages", () => {
    it("validates National Provider Identifier (NPI)", async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const input = screen.getByRole("textbox", {
        name: "National Provider Identifier (NPI) *",
      });
      expect(input).toBeRequired();

      await user.type(input, "aaa");
      expect(input).toHaveValue("");
      await user.type(input, "!!");
      expect(input).toHaveValue("");

      await user.click(screen.getByRole("button", { name: "Next" }));

      expect(input).toHaveAccessibleDescription(
        expect.stringContaining("National Provider Identifier (NPI) is required"),
      );
      expect(input).toHaveAttribute("aria-invalid", "true");

      await user.type(input, "1");
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(input).toHaveAccessibleDescription(
        expect.stringContaining("National Provider Identifier (NPI) must have 10 digits"),
      );
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });

  it("saves form data on submit", async () => {
    const user = userEvent.setup();
    const mockRouter = renderWithRouter();
    await fillAllInputsExcept(screen, user, textInputFields, new Set());
    await user.click(screen.getByRole("button", { name: "Next" }));

    for (const textInputField of textInputFields) {
      expect(window.sessionStorage.getItem(textInputField.key)).toEqual(textInputField.testValue);
    }

    expect(mockRouter.push).toHaveBeenCalledWith("/form/disclosures/1");
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("fills fields from session storage when page is loaded", () => {
    window.sessionStorage.setItem("npiNumber", "1234567890");
    window.sessionStorage.setItem("upinNumber", "12345");
    window.sessionStorage.setItem("medicareProviderId", "ABC12345");
    renderWithRouter();

    expect(
      screen.getByRole("textbox", { name: "National Provider Identifier (NPI) *" }),
    ).toHaveValue("1234567890");
    expect(screen.getByRole("textbox", { name: "UPIN number (optional)" })).toHaveValue("12345");
    expect(screen.getByRole("textbox", { name: "Medicare provider ID (optional)" })).toHaveValue(
      "ABC12345",
    );
  });

  describe("NPI explainer", () => {
    it("orders the NPI explainer immediately after the NPI input", async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const npiInput = screen.getByRole("textbox", {
        name: "National Provider Identifier (NPI) *",
      });
      const npiExplainer = screen.getByRole("button", { name: "What is an NPI?" });
      await user.type(npiInput, "1");
      expect(npiInput).toHaveFocus();

      await user.tab();
      expect(npiExplainer).toHaveFocus();
    });

    it("has a heading level one greater than the section heading level", () => {
      renderWithRouter();
      const sectionHeadingLevel = 2;
      const npiSectionHeading = screen.getByRole("heading", {
        name: "Doula provider identification",
        level: sectionHeadingLevel,
      });
      expect(npiSectionHeading).toBeInTheDocument();
      const npiExplainer = screen.getByRole("heading", {
        name: "What is an NPI?",
        level: sectionHeadingLevel + 1,
      });
      expect(npiExplainer).toBeInTheDocument();
    });
  });
});
