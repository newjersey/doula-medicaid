import { RouterPathnameProvider } from "@/app/form/_utils/testUtils";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ReviewStep from "./page";

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
      <RouterPathnameProvider pathname="/form/review" router={mockRouter as AppRouterInstance}>
        <ReviewStep />
      </RouterPathnameProvider>,
    );
  };

  it("does not have axe violations", async () => {
    const { container } = renderWithRouter();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
