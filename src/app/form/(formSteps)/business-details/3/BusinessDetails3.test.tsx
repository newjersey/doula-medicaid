import BusinessDetails3 from "@/app/form/(formSteps)/business-details/3/page";
import { RouterPathnameProvider } from "@/app/form/_utils/testUtils/RouterPathnameProvider";
import {
  testFillFromSessionStorage,
  testRequiredField,
  testSaveFieldsToSessionStorage,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";
import { render, screen } from "@testing-library/react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const noHasUncollectedDebt: TestField = {
  name: "No",
  sessionStorageKey: "hasUncollectedDebt",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "false",
  expectedValue: "false",
  withinGroupName:
    "Do you have any uncollected debt to Medicare, Medicaid/NJ FamilyCare, or CHIP (Children's Health Insurance Program)? Select one *",
};

const yesHasUncollectedDebt: TestField = {
  name: "Yes",
  sessionStorageKey: "hasUncollectedDebt",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "true",
  expectedValue: "true",
  withinGroupName:
    "Do you have any uncollected debt to Medicare, Medicaid/NJ FamilyCare, or CHIP (Children's Health Insurance Program)? Select one *",
};

const noIsSubjectToPaymentSuspension: TestField = {
  name: "No",
  sessionStorageKey: "isSubjectToPaymentSuspension",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "false",
  expectedValue: "false",
  withinGroupName:
    "Have you ever been subject to a payment suspension under a federal health care program? Select one *",
};

const yesIsSubjectToPaymentSuspension: TestField = {
  name: "Yes",
  sessionStorageKey: "isSubjectToPaymentSuspension",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "true",
  expectedValue: "true",
  withinGroupName:
    "Have you ever been subject to a payment suspension under a federal health care program? Select one *",
};

const minimalTestFields: Array<TestField> = [
  yesHasUncollectedDebt,
  yesIsSubjectToPaymentSuspension,
];
const allTestFields: Array<TestField> = [
  noHasUncollectedDebt,
  noIsSubjectToPaymentSuspension,
  yesHasUncollectedDebt,
  yesIsSubjectToPaymentSuspension,
];

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

  it("saves fields to session storage on submit", async () => {
    await testSaveFieldsToSessionStorage(
      minimalTestFields,
      minimalTestFields,
      renderWithRouter,
      screen,
      "/form/business-details/4",
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
