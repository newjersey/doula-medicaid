import BusinessDetails4 from "@/app/form/(formSteps)/business-details/4/BusinessDetails4";
import { RouterPathnameProvider } from "@/app/form/_utils/testUtils/RouterPathnameProvider";
import {
  testFillFromSessionStorage,
  testRequiredField,
  testSaveFieldsToSessionStorage,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";
import { render, screen } from "@testing-library/react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const noHasBeenExcludedFromMedicaid: TestField = {
  name: "No",
  sessionStorageKey: "hasBeenExcludedFromMedicaid",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "false",
  expectedValue: "false",
  withinGroupName:
    "Have you ever been excluded or suspended by OIG (Office of Inspector General) from participation in Medicare, Medicaid/NJ FamilyCare, or CHIP? Select one *",
};

const yesHasBeenExcludedFromMedicaid: TestField = {
  name: "Yes",
  sessionStorageKey: "hasBeenExcludedFromMedicaid",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "true",
  expectedValue: "true",
  withinGroupName:
    "Have you ever been excluded or suspended by OIG (Office of Inspector General) from participation in Medicare, Medicaid/NJ FamilyCare, or CHIP? Select one *",
};

const noHasBeenSuspendedFromMedicaid: TestField = {
  name: "No",
  sessionStorageKey: "hasBeenSuspendedFromMedicaid",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "false",
  expectedValue: "false",
  withinGroupName:
    "Have you ever had Medicare, Medicaid/NJ FamilyCare, or CHIP enrollment/participation suspended, denied, revoked, or terminated? Select one *",
};

const yesHasBeenSuspendedFromMedicaid: TestField = {
  name: "Yes",
  sessionStorageKey: "hasBeenSuspendedFromMedicaid",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "true",
  expectedValue: "true",
  withinGroupName:
    "Have you ever had Medicare, Medicaid/NJ FamilyCare, or CHIP enrollment/participation suspended, denied, revoked, or terminated? Select one *",
};

const minimalTestFields: Array<TestField> = [
  yesHasBeenExcludedFromMedicaid,
  yesHasBeenSuspendedFromMedicaid,
];
const allTestFields: Array<TestField> = [
  noHasBeenExcludedFromMedicaid,
  noHasBeenSuspendedFromMedicaid,
  yesHasBeenExcludedFromMedicaid,
  yesHasBeenSuspendedFromMedicaid,
];

describe("<BusinessDetails4 />", () => {
  const renderWithRouter = () => {
    const mockRouter: Partial<AppRouterInstance> = {
      push: jest.fn(),
      refresh: jest.fn(),
    };
    render(
      <RouterPathnameProvider
        pathname="/form/business-details/4"
        router={mockRouter as AppRouterInstance}
      >
        <BusinessDetails4 />
      </RouterPathnameProvider>,
    );
    return mockRouter;
  };

  it("saves fields to session storage on submit", async () => {
    await testSaveFieldsToSessionStorage(
      minimalTestFields,
      minimalTestFields,
      renderWithRouter,
      screen,
      "/form/finish",
    );
  });

  it.each(minimalTestFields.filter((field) => field.required === true))(
    "marks $sessionStorageKey as required and displays an error message if it is not filed in",
    async (field) => {
      await testRequiredField(field, minimalTestFields, renderWithRouter, screen);
    },
  );

  it.each(allTestFields)(
    "fills $sessionStorageKey from session storage when page is loaded",
    async (field) => {
      await testFillFromSessionStorage(field, renderWithRouter, screen);
    },
  );
});
