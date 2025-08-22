import { RouterPathnameProvider } from "@/app/form/_utils/testUtils";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import PersonalInformationStep from "./page";

describe("<PersonalInformationStep />", () => {
  afterEach(() => {
    window.sessionStorage.clear();
  });

  const renderWithRouter = () => {
    const mockPush = jest.fn();
    const mockRefresh = jest.fn();
    const mockRouter: Partial<AppRouterInstance> = {
      push: mockPush,
      refresh: mockRefresh,
    };
    return render(
      <RouterPathnameProvider
        pathname="/form/personal-information"
        router={mockRouter as AppRouterInstance}
      >
        <PersonalInformationStep />
      </RouterPathnameProvider>,
    );
  };

  it.each([
    { name: "firstName", testValue: "Test first name" },
    { name: "middleName", testValue: "Test middle name" },
    { name: "lastName", testValue: "Test last name" },
  ])("updates the $name text input", async ({ name, testValue }) => {
    const user = userEvent.setup();
    renderWithRouter();
    const inputField = screen.getByTestId(name);
    await user.type(inputField, testValue);

    expect(inputField).toHaveValue(testValue);
  });

  it("does not have axe violations", async () => {
    const { container } = renderWithRouter();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
