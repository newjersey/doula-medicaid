import ScreeningStep3 from "@/app/form/(formSteps)/screening/3/page";
import { getValue } from "@/app/form/_utils/sessionStorage";
import { fillAllInputsExcept, type InputField } from "@/app/form/_utils/testUtils/fillInputs";
import { RouterPathnameProvider } from "@/app/form/_utils/testUtils/RouterPathnameProvider";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const allInputFields: Array<InputField> = [
  {
    name: "No",
    role: "radio",
    key: "haveOtherBusinessOwnerNextYearNo",
    withinGroupName:
      "Do you anticipate anyone else having a percentage of your business in the next year? Select one *",
  },
  {
    name: "No",
    role: "radio",
    key: "hadDhmasBusinessNo",
    withinGroupName:
      "In the last 5 years, have you owned any percentage of companies that do business with the Division of Medical Assistance and Health Services? Select one *",
  },
];

describe("<ScreeningStep3 />", () => {
  const renderWithRouter = () => {
    const mockRouter: Partial<AppRouterInstance> = {
      push: jest.fn(),
      refresh: jest.fn(),
    };
    render(
      <RouterPathnameProvider pathname="/form/screening/3" router={mockRouter as AppRouterInstance}>
        <ScreeningStep3 />
      </RouterPathnameProvider>,
    );
    return mockRouter;
  };

  describe.each([
    {
      question:
        "Do you anticipate anyone else having a percentage of your business in the next year?",
      sessionStorageKey: "haveOtherBusinessOwnerNextYear" as const,
    },
    {
      question:
        "In the last 5 years, have you owned any percentage of companies that do business with the Division of Medical Assistance and Health Services?",
      sessionStorageKey: "hadDhmasBusiness" as const,
    },
  ])("$question", ({ question, sessionStorageKey }) => {
    it(`saves ${sessionStorageKey} as false when user selects no and clicks Next`, async () => {
      const user = userEvent.setup();
      const mockRouter = renderWithRouter();
      await fillAllInputsExcept(screen, user, allInputFields, new Set([`${sessionStorageKey}No`]));

      const questionGroup = screen.getByRole("group", {
        name: `${question} Select one *`,
      });
      const noButton = within(questionGroup).getByRole("radio", {
        name: "No",
      });
      expect(noButton).not.toBeChecked();
      await user.click(noButton);
      expect(noButton).toBeChecked();
      await user.click(screen.getByRole("button", { name: "Next" }));

      expect(getValue(sessionStorageKey, true)).toBe("false");
      expect(mockRouter.push).toHaveBeenCalledWith("/form/insurance");
      expect(mockRouter.refresh).toHaveBeenCalled();
    });

    it("shows an error message when user selects yes and clicks Next", async () => {
      const user = userEvent.setup();
      const mockRouter = renderWithRouter();
      await fillAllInputsExcept(screen, user, allInputFields, new Set([`${sessionStorageKey}No`]));

      const questionGroup = screen.getByRole("group", {
        name: `${question} Select one *`,
      });
      const yesButton = within(questionGroup).getByRole("radio", {
        name: "Yes",
      });
      expect(yesButton).not.toBeChecked();
      await user.click(yesButton);
      expect(yesButton).toBeChecked();
      await user.click(screen.getByRole("button", { name: "Next" }));

      expect(yesButton).toHaveFocus();
      expect(yesButton).toHaveAccessibleDescription(
        expect.stringContaining(
          "Currently this site cannot support your situation. Please use the standard FFS application",
        ),
      );
      expect(getValue(sessionStorageKey, false)).toBe(null);
      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(mockRouter.refresh).not.toHaveBeenCalled();
    });
  });
});
