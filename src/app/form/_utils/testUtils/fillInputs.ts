import type { Screen } from "@testing-library/dom";
import { within } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";

export type Role = "textbox" | "combobox" | "radio";

export type FieldToFill =
  | {
      name: string | RegExp;
      role?: "textbox" | "combobox";
      withinGroupName?: string;
      testValue: string;
    }
  | {
      name: string | RegExp;
      role: "radio";
      withinGroupName?: string;
    };

export interface FieldToGet {
  name: string | RegExp;
  role?: Role;
  withinGroupName?: string;
}

export const getInputField = async (screen: Screen, input: FieldToGet): Promise<HTMLElement> => {
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

export const fillField = async (screen: Screen, user: UserEvent, fieldToFill: FieldToFill) => {
  const inputField = await getInputField(screen, fieldToFill);
  switch (fieldToFill.role) {
    case "textbox":
      if (fieldToFill.testValue !== "") {
        await user.type(inputField, fieldToFill.testValue);
      }
      break;
    case undefined:
      await user.type(inputField, fieldToFill.testValue);
      break;
    case "combobox":
      await user.selectOptions(inputField, fieldToFill.testValue);
      break;
    case "radio":
      await user.click(inputField);
      break;
    default:
      throw new Error("Role not implemented");
  }
};

export const fillAllInputs = async (
  screen: Screen,
  user: UserEvent,
  allInputs: Array<
    FieldToFill & {
      dataStoreKey: string;
    }
  >,
) => {
  await fillAllInputsExcept(screen, user, allInputs, new Set());
};

export const fillAllInputsExcept = async (
  screen: Screen,
  user: UserEvent,
  allInputs: Array<
    FieldToFill & {
      dataStoreKey: string;
    }
  >,
  keysToSkip: Set<string>,
) => {
  for (const input of allInputs) {
    if (!keysToSkip.has(input.dataStoreKey)) {
      await fillField(screen, user, input);
    }
  }
};
