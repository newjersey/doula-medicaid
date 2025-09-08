import { fillAllInputsExcept, InputField, Role } from "@/app/form/_utils/testUtils/fillInputs";
import type { Screen } from "@testing-library/dom";
import { UserEvent } from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface TestFieldParameters {
  name: string;
  key: string;
  required: boolean;
  testValue: string;
  expectedValue?: string;
  role?: Role;
  withinGroupName?: string;
}

export class TestField implements InputField {
  name: string;
  key: string;
  required: boolean;
  testValue: string;
  expectedValue: string;
  role: Role;
  withinGroupName?: string;

  public constructor({
    name,
    key,
    required,
    testValue,
    expectedValue = testValue,
    role = "textbox",
    withinGroupName,
  }: TestFieldParameters) {
    this.name = name;
    this.key = key;
    this.required = required;
    this.testValue = testValue;
    this.expectedValue = expectedValue;
    this.role = role;
    this.withinGroupName = withinGroupName;
  }
}

export const testSaveFieldsToSessionStorage = async (
  user: UserEvent,
  fieldsToTest: Array<TestField>,
  renderFunction: () => Partial<AppRouterInstance>,
  screen: Screen,
  pathToNextPage: string,
) => {
  const mockRouter = renderFunction();
  await fillAllInputsExcept(screen, user, fieldsToTest, new Set());
  expect(screen.getByRole("textbox", { name: "First name *" })).toHaveValue("Test first name");
  await user.click(screen.getByRole("button", { name: "Next" }));
  console.log(Object.keys(window.sessionStorage));

  for (const field of fieldsToTest) {
    expect(window.sessionStorage.getItem(field.key)).toEqual(field.expectedValue);
  }

  expect(mockRouter.push).toHaveBeenCalledWith(pathToNextPage);
  expect(mockRouter.refresh).toHaveBeenCalled();
};
