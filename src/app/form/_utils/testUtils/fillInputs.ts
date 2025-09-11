import { type TestField } from "@/app/form/_utils/testUtils/sharedTests";
import type { Screen } from "@testing-library/dom";
import { within } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";

export type Role = "textbox" | "combobox" | "radio";

export const getInputField = async (
  screen: Screen,
  input: { name: string | RegExp; role?: Role; withinGroupName?: string },
): Promise<HTMLElement> => {
  const role = input.role ?? "textbox";
  return input.withinGroupName
    ? within(
        screen.getByRole("group", {
          name: input.withinGroupName,
        }),
      ).getByRole(role, {
        name: input.name,
      })
    : screen.getByRole(role, {
        name: input.name,
      });
};

export const fillField = async (
  screen: Screen,
  user: UserEvent,
  fieldToFill: { name: string | RegExp; role?: Role; withinGroupName?: string },
  value: string,
) => {
  const inputField = await getInputField(screen, fieldToFill);
  switch (fieldToFill.role) {
    case "textbox":
      await user.type(inputField, value);
      break;
    case "combobox":
      await user.selectOptions(inputField, value);
      break;
    case "radio":
      await user.click(inputField);
      break;
    default:
      throw new Error(`Role ${fieldToFill.role} not implemented`);
  }
};

export const fillAllInputs = async (
  screen: Screen,
  user: UserEvent,
  allInputs: Array<TestField>,
) => {
  await fillAllInputsExcept(screen, user, allInputs, new Set());
};

export const fillAllInputsExcept = async (
  screen: Screen,
  user: UserEvent,
  allInputs: Array<{
    name: string | RegExp;
    sessionStorageKey: string;
    testValue: string;
    role?: Role;
    withinGroupName?: string;
    prerequisiteField?: {
      name: string | RegExp;
      role?: Role;
      withinGroupName?: string;
      testValue: string;
    };
  }>,
  keysToSkip: Set<string>,
) => {
  for (const input of allInputs) {
    if (!keysToSkip.has(input.sessionStorageKey)) {
      if (typeof input.prerequisiteField !== "undefined") {
        await fillField(screen, user, input.prerequisiteField, input.prerequisiteField.testValue);
      }
      await fillField(screen, user, input, input.testValue);
    }
  }
};
