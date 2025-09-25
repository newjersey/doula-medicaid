import ScreeningStep1 from "@/app/form/(formSteps)/screening/1/ScreeningStep1";
import { RouterPathnameProvider } from "@/app/form/_utils/testUtils/RouterPathnameProvider";
import {
  createTestField,
  testInvalidField,
  testSaveFieldsToSessionStorage,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";
import { render, screen } from "@testing-library/react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const yesIsSoleProprietor: TestField = createTestField({
  name: "Yes",
  sessionStorageKey: "isSoleProprietor",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "radio",
  testValue: "true",
  withinGroupName:
    "Do you manage your business as an individual doula operating as a Sole Proprietor? Most NJ FamilyCare doulas operate as Sole Proprietor. Select one *",
});

const noIsSoleProprietor: TestField = createTestField({
  name: "No",
  sessionStorageKey: "isSoleProprietor",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "radio",
  testValue: "false",
  withinGroupName:
    "Do you manage your business as an individual doula operating as a Sole Proprietor? Most NJ FamilyCare doulas operate as Sole Proprietor. Select one *",
});

const allTestFields: Array<TestField> = [yesIsSoleProprietor];

describe("<ScreeningStep1 />", () => {
  const renderWithRouter = () => {
    const mockRouter: Partial<AppRouterInstance> = {
      push: jest.fn(),
      refresh: jest.fn(),
    };
    render(
      <RouterPathnameProvider pathname="/form/screening/1" router={mockRouter as AppRouterInstance}>
        <ScreeningStep1 />
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
      "/form/screening/2",
    );
  });

  it("displays an error message if isSoleProprietor is no", async () => {
    await testInvalidField(
      noIsSoleProprietor,
      "Currently this site is only for Sole Proprietors. Please use the standard FFS application",
      allTestFields,
      renderWithRouter,
      screen,
      yesIsSoleProprietor,
    );
  });
});
