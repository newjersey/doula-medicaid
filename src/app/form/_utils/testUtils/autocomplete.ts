import type { Autocomplete, GroupingIdentifier } from "@/app/form/_utils/types/autocomplete";
import { screen, within } from "@testing-library/react";

type InputWithAutocomplete = {
  name: string;
  role: "textbox" | "combobox";
  autocompleteToken: Autocomplete;
};

export const expectAddressHasAutocomplete = (
  fieldsetLegend: string,
  groupingIdentifier: GroupingIdentifier,
) => {
  const addressFieldset = screen.getByRole("group", { name: fieldsetLegend });
  const addressInputs: Array<InputWithAutocomplete> = [
    { name: "Street address *", role: "textbox", autocompleteToken: "address-line1" },
    { name: "Street address line 2", role: "textbox", autocompleteToken: "address-line2" },
    { name: "City *", role: "textbox", autocompleteToken: "address-level2" },
    { name: "State *", role: "combobox", autocompleteToken: "address-level1" },
    { name: "ZIP code *", role: "textbox", autocompleteToken: "postal-code" },
  ];
  for (const addressInput of addressInputs) {
    expect(
      within(addressFieldset).getByRole(addressInput.role, { name: addressInput.name }),
    ).toHaveAttribute("autocomplete", `${groupingIdentifier} ${addressInput.autocompleteToken}`);
  }
};
