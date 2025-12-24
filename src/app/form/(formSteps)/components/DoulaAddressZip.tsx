import DoulaTextInputMask from "@/app/form/(formSteps)/components/DoulaTextInputMask";
import { formatInputErrorLabel } from "@/app/form/(formSteps)/components/utils/doulaInput";
import { typecheckAutocomplete } from "@/app/form/_utils/types/autocomplete";
import type { FieldErrors, FieldPath, FieldValues, UseFormRegister } from "react-hook-form";

export interface DoulaAddressZipProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  value: string;
  autocomplete?: "shipping";
  errorLabelPrefix?: string;
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
}

export const DoulaAddressZip = <T extends FieldValues>(props: DoulaAddressZipProps<T>) => {
  return (
    <DoulaTextInputMask
      className="usa-input--medium"
      name={props.name}
      label={props.label}
      {...(props.autocomplete !== undefined && {
        autoComplete: typecheckAutocomplete(`${props.autocomplete} postal-code`),
      })}
      value={props.value ?? ""}
      mask="#####"
      pattern="\d{5}"
      required
      errors={props.errors}
      register={props.register}
      additionalRegisterOptions={{
        required: `${formatInputErrorLabel(props.label, props.errorLabelPrefix, true)} is required`,
        minLength: {
          value: 5,
          message: `${formatInputErrorLabel(props.label, props.errorLabelPrefix, true)} must have five digits`,
        },
      }}
    />
  );
};
