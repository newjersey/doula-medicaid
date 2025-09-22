import ScreeningStep2 from "@/app/form/(formSteps)/screening/2/page";
import { RouterPathnameProvider } from "@/app/form/_utils/testUtils/RouterPathnameProvider";
import {
  createTestField,
  testInvalidField,
  testSaveFieldsToSessionStorage,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";
import { render, screen } from "@testing-library/react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const noEverHadEmployees = createTestField({
  name: "No",
  role: "radio",
  required: true,
  sessionStorageKey: "everHadEmployees",
  testValue: "false",
  withinGroupName: "Have you ever had employees in your doula business? Select one *",
});
const yesEverHadEmployees = createTestField({
  name: "Yes",
  role: "radio",
  required: true,
  sessionStorageKey: "everHadEmployees",
  testValue: "true",
  withinGroupName: "Have you ever had employees in your doula business? Select one *",
});

const noEverHadOtherBusinessOwner = createTestField({
  name: "No",
  role: "radio",
  required: true,
  sessionStorageKey: "everHadOtherBusinessOwner",
  testValue: "false",
  withinGroupName: "Did anyone other than you ever own a percentage of your business? Select one *",
});
const yesEverHadOtherBusinessOwner = createTestField({
  name: "Yes",
  role: "radio",
  required: true,
  sessionStorageKey: "everHadOtherBusinessOwner",
  testValue: "true",
  withinGroupName: "Did anyone other than you ever own a percentage of your business? Select one *",
});

const allTestFields: Array<TestField> = [noEverHadEmployees, noEverHadOtherBusinessOwner];

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

  it("saves fields to session storage on submit", async () => {
    await testSaveFieldsToSessionStorage(
      allTestFields,
      allTestFields,
      renderWithRouter,
      screen,
      "/form/screening/3",
    );
  });

  it.each([[yesEverHadEmployees], [yesEverHadOtherBusinessOwner]])(
    "displays an error message if $invalidField.sessionStorageKey is $invalidField.name",
    async (invalidField) => {
      await testInvalidField(
        invalidField,
        "Currently this site cannot support your situation. Please use the standard FFS application",
        invalidField,
        allTestFields,
        renderWithRouter,
        screen,
      );
    },
  );
});
