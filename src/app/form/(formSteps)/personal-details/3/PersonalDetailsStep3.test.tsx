import PersonalDetailsStep3 from "@form/(formSteps)/personal-details/3/page";
import { RouterPathnameProvider } from "@form/_utils/testUtils";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const textInputFields = [
  { name: "NPI number *", key: "npiNumber", testValue: "1111111111" },
  { name: "UPIN number (if applicable)", key: "upinNumber", testValue: "12345" },
  {
    name: "Medicaid provider ID (if applicable)",
    key: "medicaidProviderId",
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

  it.each(textInputFields)("updates the $name text input", async ({ name, testValue }) => {
    const user = userEvent.setup();
    renderWithRouter();
    const inputField = screen.getByRole("textbox", {
      name: name,
    });
    expect(inputField).toHaveValue("");

    await user.type(inputField, testValue);
    expect(inputField).toHaveValue(testValue);
  });

  it("saves form data on submit", async () => {
    const user = userEvent.setup();
    const mockRouter = renderWithRouter();
    for (const textInputField of textInputFields) {
      const inputField = screen.getByRole("textbox", {
        name: textInputField.name,
      });
      expect(window.sessionStorage.getItem(textInputField.key)).toEqual(null);
      await user.type(inputField, textInputField.testValue);
    }

    const nextButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextButton);

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
    window.sessionStorage.setItem("medicaidProviderId", "ABC12345");
    renderWithRouter();

    expect(screen.getByRole("textbox", { name: "NPI number *" })).toHaveValue("1234567890");
    expect(screen.getByRole("textbox", { name: "UPIN number (if applicable)" })).toHaveValue(
      "12345",
    );
    expect(
      screen.getByRole("textbox", { name: "Medicaid provider ID (if applicable)" }),
    ).toHaveValue("ABC12345");
  });

  describe("<PersonalDetailsStep3 /> required fields", () => {
    it.each([{ label: "NPI number *", role: "textbox" }])(
      "checks that $label is marked as required",
      ({ label, role }) => {
        renderWithRouter();

        const input = screen.getByRole(role, {
          name: label,
        });

        expect(input).toBeRequired();
      },
    );
  });
});
