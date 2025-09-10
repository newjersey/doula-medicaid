import ScreeningStep2 from "@/app/form/(formSteps)/screening/2/page";
import { getValue } from "@/app/form/_utils/sessionStorage";
import { fillAllInputsExcept } from "@/app/form/_utils/testUtils/fillInputs";
import { RouterPathnameProvider } from "@/app/form/_utils/testUtils/RouterPathnameProvider";
import { createTestFields, type TestField } from "@/app/form/_utils/testUtils/sharedTests";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const allInputFields: Array<TestField> = createTestFields([
  {
    name: "No",
    role: "radio",
    required: true,
    sessionStorageKey: "everHadEmployeesNo",
    testValue: "false",
    withinGroupName: "Have you ever had employees in your doula business? Select one *",
  },
  {
    name: "No",
    role: "radio",
    required: true,
    sessionStorageKey: "everHadOtherBusinessOwnerNo",
    testValue: "false",
    withinGroupName:
      "Did anyone other than you ever own a percentage of your business? Select one *",
  },
]);

describe("<ScreeningStep2 />", () => {
  const renderWithRouter = () => {
    const mockRouter: Partial<AppRouterInstance> = {
      push: jest.fn(),
      refresh: jest.fn(),
    };
    render(
      <RouterPathnameProvider pathname="/form/screening/2" router={mockRouter as AppRouterInstance}>
        <ScreeningStep2 />
      </RouterPathnameProvider>,
    );
    return mockRouter;
  };

  describe.each([
    {
      question: "Have you ever had employees in your doula business?",
      sessionStorageKey: "everHadEmployees" as const,
    },
    {
      question: "Did anyone other than you ever own a percentage of your business?",
      sessionStorageKey: "everHadOtherBusinessOwner" as const,
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
      expect(mockRouter.push).toHaveBeenCalledWith("/form/screening/3");
      expect(mockRouter.refresh).toHaveBeenCalled();
    });

    it("shows an error message when user selects yes and clicks Next", async () => {
      const user = userEvent.setup();
      const mockRouter = renderWithRouter();
      await fillAllInputsExcept(screen, user, allInputFields, new Set([`${sessionStorageKey}No`]));

      const questionGroup = screen.getByRole("group", {
        name: "Have you ever had employees in your doula business? Select one *",
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
