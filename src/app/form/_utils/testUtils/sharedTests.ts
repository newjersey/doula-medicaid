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
} from "@/app/form/_utils/testUtils/fillInputs";
import type { Screen } from "@testing-library/dom";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import type { Mock } from "vitest";
import { expect } from "vitest"; // because this file is imported by cypress, which does not recognize vitest globals

type TestFieldParameters = {
  name: string | RegExp;
  dataStoreKey: string;
  required: boolean;
  withinGroupName?: string;
  prerequisiteField?: TestField;
  alternateRequiredFieldError?: string;
} & (
  | {
      role?: "textbox" | "combobox" | "radio";
      testValue: string;
      expectedValue?: string;
    }
  | {
      role: "checkbox";
    }
);

export type TestField = {
  name: string | RegExp;
  dataStoreKey: string;
  required: boolean;
  requiredErrorMessage: string;
  withinGroupName?: string;
  prerequisiteField?: TestField;
  role: "textbox" | "combobox" | "radio" | "checkbox";
  testValue: string;
  expectedValue: string;
};

type RenderFunction = (dataStore?: DataStore) => {
  mockUpdateDataStore: Mock;
  pathname: string;
};

export const createTestField = (field: TestFieldParameters): TestField => {
  const commonTestFields = {
    name: field.name,
    dataStoreKey: field.dataStoreKey,
    required: field.required,
    requiredErrorMessage:
      field.alternateRequiredFieldError ??
      (field.role === "radio"
        ? "This question is required"
        : `${field.name.toString().replace(" *", "")} is required`),
    withinGroupName: field.withinGroupName,
    prerequisiteField: field.prerequisiteField,
  };

  if (field.role === "checkbox") {
    return {
      ...commonTestFields,
      role: field.role,
      testValue: "true",
      expectedValue: "true",
    };
  }

  return {
    ...commonTestFields,
    role: field.role ?? "textbox",
    testValue: field.testValue,
    expectedValue: field.expectedValue ?? field.testValue,
  };
};

export const createTestFields = (fields: Array<TestFieldParameters>): Array<TestField> => {
  const testFields: Array<TestField> = [];
  for (const field of fields) {
    testFields.push(createTestField(field));
  }
  return testFields;
};

const clickNextButton = async (pathname: string, user: UserEvent, screen: Screen) => {
  const allSections = getAllSections();
  const nextFormProgress = getNextFormProgress(getCurrentFormProgress(pathname), allSections);
  const submitButtonName =
    nextFormProgress && isFinalFormProgress(nextFormProgress, allSections) ? "Review" : "Next";
  await user.click(screen.getByRole("button", { name: submitButtonName }));
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

  await clickNextButton(pathname, user, screen);
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

  await clickNextButton(pathname, user, screen);
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

  await clickNextButton(pathname, user, screen);
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
    case "checkbox":
      expect(input).toBeChecked();
      break;
    default:
      throw new Error(`Role not implemented`);
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
  if (field.role === "checkbox") {
    expect(input).toBeChecked();
  } else {
    expect(input).toHaveValue(field.expectedValue);
  }

  await fillField(screen, user, hideField);
  expect(input).not.toBeInTheDocument();

  await fillField(screen, user, field.prerequisiteField);
  if (field.role === "checkbox") {
    expect(input).toBeChecked();
  } else {
    expect(input).toHaveValue(field.expectedValue);
  }
};

export const testFocusesFirstErrorEvenIfConditional = async (
  earlierConditionallyRenderedRequiredField: TestField,
  laterAlwaysRenderedField: TestField,
  allFields: Array<TestField>,
  renderFunction: RenderFunction,
  screen: Screen,
) => {
  if (earlierConditionallyRenderedRequiredField.prerequisiteField === undefined) {
    throw new Error(
      `${earlierConditionallyRenderedRequiredField.dataStoreKey} needs a prerequisiteField to test that the focus order is correct despite not initially being visible`,
    );
  }
  const user = userEvent.setup();
  const { pathname } = renderFunction();
  await fillAllInputsExcept(
    screen,
    user,
    allFields,
    new Set([
      earlierConditionallyRenderedRequiredField.dataStoreKey,
      laterAlwaysRenderedField.dataStoreKey,
    ]),
  );

  const earlierInput = await getInputField(screen, earlierConditionallyRenderedRequiredField);
  await clickNextButton(pathname, user, screen);
  expect(earlierInput).toHaveFocus();
};
