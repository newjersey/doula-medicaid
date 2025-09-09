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

export const createTestField = (params: TestFieldParameters): TestField => {
  return {
    name: params.name,
    sessionStorageKey: params.sessionStorageKey,
    required: params.required,
    testValue: params.testValue,
    expectedValue: params.expectedValue ?? params.testValue,
    role: params.role ?? "textbox",
    withinGroupName: params.withinGroupName ?? undefined,
  };
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

export const testRequiredFields = (
  fieldsToTest: Array<TestField>,
  allFields: Array<TestField>,
  renderFunction: () => Partial<AppRouterInstance>,
  screen: Screen,
) => {
  it.each(fieldsToTest.filter((field) => field.required))(
    "$sessionStorageKey",
    async ({ name, role, sessionStorageKey }: TestField) => {
      const user = userEvent.setup();
      renderFunction();
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
    },
  );
};

export const testFillFromSessionStorage = (
  fieldsToTest: Array<TestField>,
  renderFunction: () => Partial<AppRouterInstance>,
  screen: Screen,
) => {
  it.each(fieldsToTest)(
    "$sessionStorageKey",
    async ({ sessionStorageKey, expectedValue, role, name }: TestField) => {
      window.sessionStorage.setItem(sessionStorageKey, expectedValue);
      renderFunction();
      expect(screen.getByRole(role, { name: name })).toHaveValue(expectedValue);
    },
  );
};
