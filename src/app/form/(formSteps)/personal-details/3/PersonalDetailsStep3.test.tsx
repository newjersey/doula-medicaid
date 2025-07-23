import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { RouterPathnameProvider } from "../../../_utils/testUtils";
import PersonalDetailsStep3 from "./page";

describe("<PersonalDetailsStep3 />", () => {
  afterEach(() => {
    window.sessionStorage.clear();
  });

  const renderWithRouter = () => {
    const mockPush = jest.fn();
    const mockRefresh = jest.fn();
    const router: Partial<AppRouterInstance> = {
      push: mockPush,
      refresh: mockRefresh,
    };
    render(
      <RouterPathnameProvider
        pathname="/form/personal-details/3"
        router={router as AppRouterInstance}
      >
        <PersonalDetailsStep3 />
      </RouterPathnameProvider>,
    );
  };

  it.each([
    { name: "NPI number *", key: "npiNumber", testValue: "1111111111" },
    { name: "UPIN number (if applicable)", key: "upinNumber", testValue: "12345" },
    {
      name: "Medicaid provider ID (if applicable)",
      key: "medicaidProviderId",
      testValue: "ABC12345",
    },
  ])("updates the $name text input", async ({ name, key, testValue }) => {
    const user = userEvent.setup();
    renderWithRouter();
    const nextButton = screen.getByRole("button", { name: "Next" });
    const inputField = screen.getByRole("textbox", {
      name: name,
    });
    expect(window.sessionStorage.getItem(key)).toEqual(null);

    await user.type(inputField, testValue);
    expect(inputField).toHaveValue(testValue);

    await user.click(nextButton);
    expect(window.sessionStorage.getItem(key)).toEqual(testValue);
  });

  it("keeps all fields filled when reloading page", () => {
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
