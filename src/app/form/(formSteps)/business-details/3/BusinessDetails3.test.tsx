import BusinessDetails3 from "@/app/form/(formSteps)/business-details/3/page";
import { getValue } from "@/app/form/_utils/sessionStorage";
import { fillAllInputsExcept } from "@/app/form/_utils/testUtils/fillInputs";
import { RouterPathnameProvider } from "@/app/form/_utils/testUtils/RouterPathnameProvider";
import { createTestFields, type TestField } from "@/app/form/_utils/testUtils/sharedTests";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const allTestFields: Array<TestField> = createTestFields([
  {
    name: "No",
    role: "radio",
    required: true,
    sessionStorageKey: "hasUncollectedDebt",
    testValue: "false",
    withinGroupName:
      "Do you have any uncollected debt to Medicare, Medicaid/NJ FamilyCare, or CHIP (Children's Health Insurance Program)? Select one *",
  },
  {
    name: "No",
    role: "radio",
    required: true,
    sessionStorageKey: "isSubjectToPaymentSuspension",
    testValue: "false",
    withinGroupName:
      "Have you ever been subject to a payment suspension under a federal health care program? Select one *",
  },
]);

describe("<BusinessDetails3 />", () => {
  const renderWithRouter = () => {
    const mockRouter: Partial<AppRouterInstance> = {
      push: jest.fn(),
      refresh: jest.fn(),
    };
    render(
      <RouterPathnameProvider
        pathname="/form/business-details/3"
        router={mockRouter as AppRouterInstance}
      >
        <BusinessDetails3 />
      </RouterPathnameProvider>,
    );
    return mockRouter;
  };

  describe.each([
    {
      question:
        "Do you have any uncollected debt to Medicare, Medicaid/NJ FamilyCare, or CHIP (Children's Health Insurance Program)?",
      sessionStorageKey: "hasUncollectedDebt" as const,
    },
    {
      question:
        "Have you ever been subject to a payment suspension under a federal health care program?",
      sessionStorageKey: "isSubjectToPaymentSuspension" as const,
    },
  ])("$question", ({ question, sessionStorageKey }) => {
    it(`saves ${sessionStorageKey} as false when user selects no and clicks Next`, async () => {
      const user = userEvent.setup();
      const mockRouter = renderWithRouter();
      await fillAllInputsExcept(screen, user, allTestFields, new Set([`${sessionStorageKey}`]));

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
      expect(mockRouter.push).toHaveBeenCalledWith("/form/business-details/4");
      expect(mockRouter.refresh).toHaveBeenCalled();
    });

    it("shows an error message when user selects yes and clicks Next", async () => {
      const user = userEvent.setup();
      const mockRouter = renderWithRouter();
      await fillAllInputsExcept(screen, user, allTestFields, new Set([`${sessionStorageKey}No`]));

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
