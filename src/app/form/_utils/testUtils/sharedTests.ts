import {
  fillAllInputs,
  fillAllInputsExcept,
  fillField,
  getInputField,
  type FieldToFill,
  type FieldToGet,
  type Role,
} from "@/app/form/_utils/testUtils/fillInputs";
import { waitFor, type Screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

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

export const createTestField = (field: TestFieldParameters): TestField => {
  return {
    name: field.name,
    sessionStorageKey: field.sessionStorageKey,
    required: field.required,
    testValue: field.testValue,
    expectedValue: field.expectedValue ?? field.testValue,
    role: field.role ?? "textbox",
    requiredErrorMessage:
      field.alternateRequiredFieldError ?? `${field.name.toString().replace(" *", "")} is required`,
    withinGroupName: field.withinGroupName,
    prerequisiteField: field.prerequisiteField,
  };
};

export const createTestFields = (fields: Array<TestFieldParameters>): Array<TestField> => {
  const testFields: Array<TestField> = [];
  for (const field of fields) {
    testFields.push(createTestField(field));
  }
  return testFields;
};

export const testSaveFieldsToSessionStorage = async (
  fieldsToTest: Array<TestField>,
  allFields: Array<TestField>,
  renderFunction: () => void,
  screen: Screen,
  pathToNextPage: string,
) => {
  const user = userEvent.setup();
  renderFunction();
  await fillAllInputs(screen, user, allFields);
  await user.click(screen.getByRole("button", { name: "Next" }));

  for (const field of fieldsToTest) {
    expect(window.sessionStorage.getItem(field.sessionStorageKey)).toEqual(field.expectedValue);
  }
  waitFor(() => {
    expect(window.location.pathname).toEqual(pathToNextPage);
  });
};

export const testRequiredField = async (
  fieldToTest: TestField,
  allFields: Array<TestField>,
  renderFunction: () => void,
  screen: Screen,
) => {
  const user = userEvent.setup();
  renderFunction();
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
};

export const testInvalidField = async (
  invalidField: FieldToFill & {
    sessionStorageKey: string;
    prerequisiteField?: TestField;
  },
  expectedErrorMessage: string,
  allFields: Array<TestField>,
  renderFunction: () => void,
  screen: Screen,
  focusedField?: FieldToGet,
) => {
  const user = userEvent.setup();
  renderFunction();
  await fillAllInputsExcept(screen, user, allFields, new Set([invalidField.sessionStorageKey]));
  await fillField(screen, user, invalidField);

  await user.click(screen.getByRole("button", { name: "Next" }));
  const input = await getInputField(screen, invalidField);
  expect(input).toHaveAccessibleDescription(expect.stringContaining(expectedErrorMessage));
  expect(input).toHaveAttribute("aria-invalid", "true");
  const focusedInput = await getInputField(screen, focusedField ?? invalidField);
  expect(focusedInput).toHaveFocus();
  expect(window.sessionStorage.getItem(invalidField.sessionStorageKey)).toBe(null);
};

export const testFillFromSessionStorage = async (
  field: TestField,
  renderFunction: () => void,
  screen: Screen,
) => {
  if (field.prerequisiteField !== undefined) {
    window.sessionStorage.setItem(
      field.prerequisiteField.sessionStorageKey,
      field.prerequisiteField.expectedValue,
    );
  }
  window.sessionStorage.setItem(field.sessionStorageKey, field.expectedValue);
  renderFunction();
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

export const testConditionalRender = async (
  field: TestField,
  hideField: TestField,
  renderFunction: () => void,
  screen: Screen,
) => {
  if (field.prerequisiteField === undefined) {
    throw new Error(
      `${field.sessionStorageKey} needs a prerequisiteField to test toggling visibility`,
    );
  }
  const user = userEvent.setup();
  renderFunction();
  await fillField(screen, user, field.prerequisiteField);
  const input = await getInputField(screen, field);

  await fillField(screen, user, field);
  expect(input).toHaveValue(field.expectedValue);

  await fillField(screen, user, hideField);
  expect(input).not.toBeInTheDocument();

  await fillField(screen, user, field.prerequisiteField);
  expect(input).toHaveValue(field.expectedValue);
};
