import type { DataStore } from "@/app/form/_utils/dataStore";
import {
  getAllSections,
  getCurrentFormProgress,
  getNextFormProgress,
  isFinalFormProgress,
} from "@/app/form/_utils/formProgress";
import {
  fillAllInputs,
  fillAllInputsExcept,
  fillField,
  getInputField,
  type FieldToFill,
  type FieldToGet,
  type Role,
} from "@/app/form/_utils/testUtils/fillInputs";
import type { Screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

interface TestFieldParameters {
  name: string | RegExp;
  dataStoreKey: string;
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
  dataStoreKey: string;
  required: boolean;
  testValue: string;
  expectedValue: string;
  role: Role;
  requiredErrorMessage: string;
  withinGroupName?: string;
  prerequisiteField?: TestField;
}

type RenderFunction = (dataStore?: DataStore) => {
  mockUpdateDataStore: jest.Mock;
  pathname: string;
};

export const createTestField = (field: TestFieldParameters): TestField => {
  return {
    name: field.name,
    dataStoreKey: field.dataStoreKey,
    required: field.required,
    testValue: field.testValue,
    expectedValue: field.expectedValue ?? field.testValue,
    role: field.role ?? "textbox",
    requiredErrorMessage:
      field.alternateRequiredFieldError ??
      (field.role === "radio"
        ? "This question is required"
        : `${field.name.toString().replace(" *", "")} is required`),
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

export const testSaveFieldsToDataStore = async (
  fieldsToTest: Array<TestField>,
  allFields: Array<TestField>,
  renderFunction: RenderFunction,
  screen: Screen,
) => {
  const user = userEvent.setup();
  const { mockUpdateDataStore, pathname } = renderFunction();
  await fillAllInputs(screen, user, allFields);

  const allSections = getAllSections();
  const nextFormProgress = getNextFormProgress(getCurrentFormProgress(pathname), allSections);
  const submitButtonName =
    nextFormProgress && isFinalFormProgress(nextFormProgress, allSections) ? "Review" : "Next";
  await user.click(
    screen.getByRole("button", {
      name: submitButtonName,
    }),
  );

  const dataUpdates = Object.fromEntries(
    fieldsToTest.map((field) => [field.dataStoreKey, field.expectedValue]),
  );
  expect(mockUpdateDataStore).toHaveBeenCalledWith(expect.objectContaining(dataUpdates));
};

export const testRequiredField = async (
  fieldToTest: TestField,
  allFields: Array<TestField>,
  renderFunction: RenderFunction,
  screen: Screen,
) => {
  const user = userEvent.setup();
  const { mockUpdateDataStore, pathname } = renderFunction();
  await fillAllInputsExcept(screen, user, allFields, new Set([fieldToTest.dataStoreKey]));
  const input = await getInputField(screen, fieldToTest);
  expect(input).toBeRequired();

  const allSections = getAllSections();
  const nextFormProgress = getNextFormProgress(getCurrentFormProgress(pathname), allSections);
  const submitButtonName =
    nextFormProgress && isFinalFormProgress(nextFormProgress, allSections) ? "Review" : "Next";
  await user.click(screen.getByRole("button", { name: submitButtonName }));
  expect(input).toHaveAccessibleDescription(
    expect.stringContaining(fieldToTest.requiredErrorMessage),
  );
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input).toHaveFocus();
  expect(mockUpdateDataStore).not.toHaveBeenCalled();
};

export const testInvalidField = async (
  invalidField: FieldToFill & {
    dataStoreKey: string;
    prerequisiteField?: TestField;
  },
  expectedErrorMessage: string,
  allFields: Array<TestField>,
  renderFunction: RenderFunction,
  screen: Screen,
  focusedField?: FieldToGet,
) => {
  const user = userEvent.setup();
  const { mockUpdateDataStore, pathname } = renderFunction();
  await fillAllInputsExcept(screen, user, allFields, new Set([invalidField.dataStoreKey]));
  await fillField(screen, user, invalidField);

  const allSections = getAllSections();
  const nextFormProgress = getNextFormProgress(getCurrentFormProgress(pathname), allSections);
  const submitButtonName =
    nextFormProgress && isFinalFormProgress(nextFormProgress, allSections) ? "Review" : "Next";
  await user.click(screen.getByRole("button", { name: submitButtonName }));
  const input = await getInputField(screen, invalidField);
  expect(input).toHaveAccessibleDescription(expect.stringContaining(expectedErrorMessage));
  expect(input).toHaveAttribute("aria-invalid", "true");
  const focusedInput = await getInputField(screen, focusedField ?? invalidField);
  expect(focusedInput).toHaveFocus();
  expect(mockUpdateDataStore).not.toHaveBeenCalled();
};

export const testFillFromDataStore = async (
  field: TestField,
  renderFunction: RenderFunction,
  screen: Screen,
) => {
  const dataStore: DataStore = {};
  if (field.prerequisiteField !== undefined) {
    dataStore[field.prerequisiteField.dataStoreKey] = field.prerequisiteField.expectedValue;
  }
  dataStore[field.dataStoreKey] = field.expectedValue;
  renderFunction(dataStore);
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
  renderFunction: RenderFunction,
  screen: Screen,
) => {
  if (field.prerequisiteField === undefined) {
    throw new Error(`${field.dataStoreKey} needs a prerequisiteField to test toggling visibility`);
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
