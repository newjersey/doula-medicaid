import { AddressState, addressStateToName } from "@/app/form/_utils/inputFields/addressState";
import { typecheckAutocomplete } from "@/app/form/_utils/types/autocomplete";
import { Label, Select } from "@trussworks/react-uswds";
import type { FieldPath, FieldValues, UseFormRegister } from "react-hook-form";

export interface DoulaAddressStateProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  autocomplete?: "shipping";
  register: UseFormRegister<T>;
}

export const DoulaAddressState = <T extends FieldValues>(props: DoulaAddressStateProps<T>) => {
  return (
    <>
      <Label htmlFor={props.name} requiredMarker>
        {props.label}
      </Label>
      <Select
        className="usa-select"
        id={props.name}
        {...(props.autocomplete !== undefined && {
          autoComplete: typecheckAutocomplete(`${props.autocomplete} address-level1`),
        })}
        required
        {...props.register(props.name)}
      >
        {Object.keys(AddressState).map((state) => (
          <option key={state} value={state}>
            {addressStateToName[state as keyof typeof AddressState]}
          </option>
        ))}
      </Select>
    </>
  );
};
