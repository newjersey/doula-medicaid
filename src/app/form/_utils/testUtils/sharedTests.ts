import {
  fillAllInputs,
  fillAllInputsExcept,
  fillField,
  getInputField,
  type Role,
} from "@/app/form/_utils/testUtils/fillInputs";
import type { Screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface TestFieldParameters {
  name: string | RegExp;
  sessionStorageKey: string;
  required: boolean;
  testValue: string;
  expectedValue?: string;
  role?: Role;
  withinGroupName?: string;
  prerequisiteField?: TestField;
  alternateRequiredFieldError?: string;
}

export interface TestField {
  name: string | RegExp;
  sessionStorageKey: string;
  required: boolean;
  testValue: string;
  expectedValue: string;
  role: Role;
  requiredErrorMessage: string;
  withinGroupName?: string;
  prerequisiteField?: TestField;
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
      requiredErrorMessage:
        field.alternateRequiredFieldError ??
        `${field.name.toString().replace(" *", "")} is required`,
      withinGroupName: field.withinGroupName ?? undefined,
      prerequisiteField: field.prerequisiteField ?? undefined,
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
  fieldToTest: TestField,
  allFields: Array<TestField>,
  renderFunction: () => Partial<AppRouterInstance>,
  screen: Screen,
) => {
  const user = userEvent.setup();
  const mockRouter = renderFunction();
  await fillAllInputsExcept(screen, user, allFields, new Set([fieldToTest.sessionStorageKey]));
  const input = await getInputField(screen, fieldToTest);
  expect(input).toBeRequired();
  await user.click(screen.getByRole("button", { name: "Next" }));
  expect(input).toHaveAccessibleDescription(
    expect.stringContaining(fieldToTest.requiredErrorMessage),
  );
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input).toHaveFocus();
  expect(window.sessionStorage.getItem(fieldToTest.sessionStorageKey)).toBe(null);
  expect(mockRouter.push).not.toHaveBeenCalled();
  expect(mockRouter.refresh).not.toHaveBeenCalled();
};

export const testFillFromSessionStorage = async (
  field: TestField,
  renderFunction: () => Partial<AppRouterInstance>,
  screen: Screen,
) => {
  const user = userEvent.setup();
  window.sessionStorage.setItem(field.sessionStorageKey, field.expectedValue);
  renderFunction();
  if (typeof field.prerequisiteField !== "undefined") {
    await fillField(screen, user, field.prerequisiteField, field.prerequisiteField.testValue);
  }
  const input = await getInputField(screen, field);
  switch (field.role) {
    case "textbox":
      expect(input).toHaveValue(field.expectedValue);
      break;
    case "combobox":
      expect(input).toHaveValue(field.expectedValue);
      break;
    case "radio":
      expect(input).toBeChecked();
      break;
    default:
      throw new Error(`Role ${field.role} not implemented`);
  }
};
