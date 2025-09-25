import ScreeningStep3 from "@/app/form/(formSteps)/screening/3/ScreeningStep3";
import { RouterPathnameProvider } from "@/app/form/_utils/testUtils/RouterPathnameProvider";
import {
  createTestField,
  testInvalidField,
  testSaveFieldsToSessionStorage,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";
import { render, screen } from "@testing-library/react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const noHaveOtherBusinessOwnerNextYear = createTestField({
  name: "No",
  role: "radio",
  required: true,
  sessionStorageKey: "haveOtherBusinessOwnerNextYear",
  testValue: "false",
  withinGroupName:
    "Do you anticipate anyone else having a percentage of your business in the next year? Select one *",
});
const yesHaveOtherBusinessOwnerNextYear = createTestField({
  name: "Yes",
  role: "radio",
  required: true,
  sessionStorageKey: "haveOtherBusinessOwnerNextYear",
  testValue: "true",
  withinGroupName:
    "Do you anticipate anyone else having a percentage of your business in the next year? Select one *",
});

const noHadDhmasBusiness = createTestField({
  name: "No",
  role: "radio",
  required: true,
  sessionStorageKey: "hadDhmasBusiness",
  testValue: "false",
  withinGroupName:
    "In the last 5 years, have you owned any percentage of companies that do business with the Division of Medical Assistance and Health Services? Select one *",
});
const yesHadDhmasBusiness = createTestField({
  name: "Yes",
  role: "radio",
  required: true,
  sessionStorageKey: "hadDhmasBusiness",
  testValue: "true",
  withinGroupName:
    "In the last 5 years, have you owned any percentage of companies that do business with the Division of Medical Assistance and Health Services? Select one *",
});

const allTestFields: Array<TestField> = [noHaveOtherBusinessOwnerNextYear, noHadDhmasBusiness];

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

  it("saves fields to session storage on submit", async () => {
    await testSaveFieldsToSessionStorage(
      allTestFields,
      allTestFields,
      renderWithRouter,
      screen,
      "/form/insurance/1",
    );
  });

  it.each([[yesHaveOtherBusinessOwnerNextYear], [yesHadDhmasBusiness]])(
    "displays an error message if $invalidField.sessionStorageKey is $invalidField.name",
    async (invalidField) => {
      await testInvalidField(
        invalidField,
        "Currently this site cannot support your situation. Please use the standard FFS application",
        allTestFields,
        renderWithRouter,
        screen,
        invalidField,
      );
    },
  );
});
