import PersonalDetailsStep3 from "@form/(formSteps)/personal-details/3/page";
import { fillAllInputsExcept, RouterPathnameProvider } from "@form/_utils/testUtils";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const textInputFields = [
  { name: "NPI number *", key: "npiNumber", testValue: "1111111111" },
  { name: "UPIN number (if applicable)", key: "upinNumber", testValue: "12345" },
  {
    name: "Medicare provider ID (if applicable)",
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
    it("marks NPI as required and displays error messages if it is not filled in", async () => {
      const user = userEvent.setup();
      renderWithRouter();

      const input = screen.getByRole("textbox", {
        name: "NPI number *",
      });
      expect(input).toBeRequired();

      await user.click(screen.getByRole("button", { name: "Next" }));

      expect(input).toHaveAccessibleDescription(expect.stringContaining(`NPI number is required`));
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

    expect(screen.getByRole("textbox", { name: "NPI number *" })).toHaveValue("1234567890");
    expect(screen.getByRole("textbox", { name: "UPIN number (if applicable)" })).toHaveValue(
      "12345",
    );
    expect(
      screen.getByRole("textbox", { name: "Medicare provider ID (if applicable)" }),
    ).toHaveValue("ABC12345");
  });
});
