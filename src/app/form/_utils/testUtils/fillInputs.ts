import { type TestField } from "@/app/form/_utils/testUtils/sharedTests";
import type { Screen } from "@testing-library/dom";
import { within } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";

export type Role = "textbox" | "combobox" | "radio";

type FieldToFill =
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

export const fillField = async (screen: Screen, user: UserEvent, fieldToFill: FieldToFill) => {
  const inputField = await getInputField(screen, fieldToFill);
  switch (fieldToFill.role) {
    case "textbox":
      await user.type(inputField, fieldToFill.testValue);
      break;
    case "combobox":
      await user.selectOptions(inputField, fieldToFill.testValue);
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
  allInputs: Array<
    FieldToFill & {
      sessionStorageKey: string;
      prerequisiteField?: FieldToFill;
    }
  >,
  keysToSkip: Set<string>,
) => {
  for (const input of allInputs) {
    if (!keysToSkip.has(input.sessionStorageKey)) {
      if (typeof input.prerequisiteField !== "undefined") {
        await fillField(screen, user, input.prerequisiteField);
      }
      await fillField(screen, user, input);
    }
  }
};
