import type { Screen } from "@testing-library/dom";
import { within } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";

export interface InputField {
  name: string;
  key: string;
  role?: "textbox" | "combobox" | "radio" | "select";
  testValue?: string;
  withinGroupName?: string;
}

export const getInputField = async (screen: Screen, input: InputField): Promise<HTMLElement> => {
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

export const fillAllInputsExcept = async (
  screen: Screen,
  user: UserEvent,
  allInputs: Array<InputField>,
  keysToSkip: Set<string>,
) => {
  for (const input of allInputs) {
    if (!keysToSkip.has(input.key)) {
      const role = input.role ?? "textbox";
      const value = input.testValue ?? "test";
      const inputField = await getInputField(screen, input);

      switch (role) {
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
          throw new Error(`Role ${role} not implemented`);
      }
    }
  }
};
