import { ErrorMessage } from "@/app/form/(formSteps)/components/ErrorMessage";
import {
  formatErrorMessageId,
  formatInputErrorLabel,
} from "@/app/form/(formSteps)/components/utils/doulaInput";
import { AddressState, addressStateToName } from "@/app/form/_utils/inputFields/addressState";
import { typecheckAutocomplete } from "@/app/form/_utils/types/autocomplete";
import { Label, Select } from "@trussworks/react-uswds";
import type { FieldErrors, FieldPath, FieldValues, UseFormRegister } from "react-hook-form";

export interface DoulaAddressStateProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  autocomplete?: "shipping";
  errorLabelPrefix?: string;
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
}

export const DoulaAddressState = <T extends FieldValues>(props: DoulaAddressStateProps<T>) => {
  return (
    <>
      <Label htmlFor={props.name} requiredMarker>
        {props.label}
      </Label>
      <Select
        id={props.name}
        required
        validationStatus={props.errors[props.name] ? "error" : undefined}
        aria-invalid={props.errors[props.name] ? "true" : "false"}
        aria-describedby={props.errors[props.name] ? formatErrorMessageId(props.name) : ""}
        {...(props.autocomplete !== undefined && {
          autoComplete: typecheckAutocomplete(`${props.autocomplete} address-level1`),
        })}
        {...props.register(props.name, {
          required: `${formatInputErrorLabel("State", props.errorLabelPrefix)} is required`,
        })}
      >
        {Object.keys(AddressState).map((state) => (
          <option key={state} value={state}>
            {addressStateToName[state as keyof typeof AddressState]}
          </option>
        ))}
      </Select>

      {props.errors[props.name] && <ErrorMessage name={props.name} errors={props.errors} />}
    </>
  );
};
