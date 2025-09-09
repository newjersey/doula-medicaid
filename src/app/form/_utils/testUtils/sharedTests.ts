import {
  fillAllInputs,
  fillAllInputsExcept,
  getInputField,
  type InputField,
  type Role,
} from "@/app/form/_utils/testUtils/fillInputs";
import type { Screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface TestFieldParameters {
  name: string;
  sessionStorageKey: string;
  required: boolean;
  testValue: string;
  expectedValue?: string;
  role?: Role;
  withinGroupName?: string;
}

export interface TestField extends InputField {
  name: string;
  sessionStorageKey: string;
  required: boolean;
  testValue: string;
  expectedValue: string;
  role: Role;
  withinGroupName?: string;
}

export const createTestFields = (fields: Array<TestFieldParameters>): Array<TestField> => {
  const testFields: Array<TestField> = [];
  for (const field of fields) {
    testFields.push({
      name: field.name,
      sessionStorageKey: field.sessionStorageKey,
      required: field.required,
      testValue: field.testValue,
      expectedValue: field.expectedValue ?? field.testValue,
      role: field.role ?? "textbox",
      withinGroupName: field.withinGroupName ?? undefined,
    });
  }
  return testFields;
};

export const testSaveFieldsToSessionStorage = async (
  fieldsToTest: Array<TestField>,
  allFields: Array<TestField>,
  renderFunction: () => Partial<AppRouterInstance>,
  screen: Screen,
  pathToNextPage: string,
) => {
  const user = userEvent.setup();
  const mockRouter = renderFunction();
  await fillAllInputs(screen, user, allFields);
  await user.click(screen.getByRole("button", { name: "Next" }));

  for (const field of fieldsToTest) {
    expect(window.sessionStorage.getItem(field.sessionStorageKey)).toEqual(field.expectedValue);
  }

  expect(mockRouter.push).toHaveBeenCalledWith(pathToNextPage);
  expect(mockRouter.refresh).toHaveBeenCalled();
};

export const testRequiredField = async (
  name: string,
  role: Role,
  sessionStorageKey: string,
  allFields: Array<TestField>,
  renderFunction: () => Partial<AppRouterInstance>,
  screen: Screen,
) => {
  const user = userEvent.setup();
  const mockRouter = renderFunction();
  const labelWithoutAsterisk = name.replace(" *", "");
  const input = await getInputField(screen, { name: name, role: role });
  expect(input).toBeRequired();
  await fillAllInputsExcept(screen, user, allFields, new Set([sessionStorageKey]));
  await user.click(screen.getByRole("button", { name: "Next" }));

  expect(input).toHaveAccessibleDescription(
    expect.stringContaining(`${labelWithoutAsterisk} is required`),
  );
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input).toHaveFocus();
  expect(window.sessionStorage.getItem(sessionStorageKey)).toBe(null);
  expect(mockRouter.push).not.toHaveBeenCalled();
  expect(mockRouter.refresh).not.toHaveBeenCalled();
};

export const testFillFromSessionStorage = async (
  name: string,
  role: Role,
  sessionStorageKey: string,
  expectedValue: string,
  renderFunction: () => Partial<AppRouterInstance>,
  screen: Screen,
) => {
  window.sessionStorage.setItem(sessionStorageKey, expectedValue);
  renderFunction();
  expect(screen.getByRole(role, { name: name })).toHaveValue(expectedValue);
};
