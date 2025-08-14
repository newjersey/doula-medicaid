import { RouterPathnameProvider } from "@/app/form/_utils/testUtils";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    render(
      <RouterPathnameProvider
        pathname="/form/personal-information"
        router={mockRouter as AppRouterInstance}
      >
        <PersonalInformationStep />
      </RouterPathnameProvider>,
    );
    return mockRouter;
  };

  it.each([
    { name: "First name *", testValue: "Test first name" },
    { name: "Middle name", testValue: "Test middle name" },
    { name: "Last name *", testValue: "Test last name" },
  ])("updates the $name text input", async ({ name, testValue }) => {
    const user = userEvent.setup();
    renderWithRouter();
    const inputField = screen.getByRole("textbox", {
      name: name,
    });

    await user.type(inputField, testValue);

    expect(inputField).toHaveValue(testValue);
  });
});
