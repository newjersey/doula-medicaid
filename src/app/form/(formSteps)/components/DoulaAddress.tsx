import DoulaTextInput from "@/app/form/(formSteps)/components/DoulaTextInput";
import DoulaTextInputMask from "@/app/form/(formSteps)/components/DoulaTextInputMask";
import { formatInputErrorLabel } from "@/app/form/(formSteps)/components/utils/doulaInput";
import { AddressState, addressStateToName } from "@/app/form/_utils/inputFields/addressState";
import { typecheckAutocomplete } from "@/app/form/_utils/types/autocomplete";
import { Fieldset, Label, Select, type FieldsetProps } from "@trussworks/react-uswds";
import type { FieldErrors, FieldPath, FieldValues, UseFormRegister } from "react-hook-form";

export interface DoulaAddressProps<T extends FieldValues> {
  fieldsetProps: Omit<FieldsetProps, "children">;
  addressKeys: {
    streetAddress1: FieldPath<T>;
    streetAddress2: FieldPath<T>;
    city: FieldPath<T>;
    state: FieldPath<T>;
    zip: FieldPath<T>;
  };
  zipValue: string;
  orderedInputNameToLabel: {
    [key in FieldPath<T>]: string;
  };
  autocomplete?: "shipping";
  errorLabelPrefix?: string;
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
}

export const DoulaAddress = <T extends FieldValues>(props: DoulaAddressProps<T>) => {
  return (
    <Fieldset {...props.fieldsetProps}>
      <div className="grid-row grid-gap">
        <div className="mobile-lg:grid-col-6">
          <DoulaTextInput
            name={props.addressKeys.streetAddress1}
            label={props.orderedInputNameToLabel[props.addressKeys.streetAddress1]}
            {...(props.autocomplete !== undefined && {
              autoComplete: typecheckAutocomplete(`${props.autocomplete} address-line1`),
            })}
            required
            errors={props.errors}
            register={props.register}
            registerOptions={{
              required: `${formatInputErrorLabel(props.orderedInputNameToLabel[props.addressKeys.streetAddress1], props.errorLabelPrefix)} is required`,
            }}
          />
        </div>
        <div className="mobile-lg:grid-col-6">
          <DoulaTextInput
            name={props.addressKeys.streetAddress2}
            label={props.orderedInputNameToLabel[props.addressKeys.streetAddress2]}
            {...(props.autocomplete !== undefined && {
              autoComplete: typecheckAutocomplete(`${props.autocomplete} address-line2`),
            })}
            register={props.register}
          />
        </div>
      </div>
      <div className="grid-row grid-gap">
        <div className="mobile-lg:grid-col-6">
          <DoulaTextInput
            name={props.addressKeys.city}
            label={props.orderedInputNameToLabel[props.addressKeys.city]}
            {...(props.autocomplete !== undefined && {
              autoComplete: typecheckAutocomplete(`${props.autocomplete} address-level2`),
            })}
            required
            errors={props.errors}
            register={props.register}
            registerOptions={{
              required: `${formatInputErrorLabel(props.orderedInputNameToLabel[props.addressKeys.city], props.errorLabelPrefix)} is required`,
            }}
          />
        </div>
      </div>
      <div className="grid-row grid-gap">
        <div className="mobile-lg:grid-col-6">
          <Label htmlFor={props.addressKeys.state} requiredMarker>
            {props.orderedInputNameToLabel[props.addressKeys.state]}
          </Label>
          <Select
            className="usa-select"
            id={props.addressKeys.state}
            {...(props.autocomplete !== undefined && {
              autoComplete: typecheckAutocomplete(`${props.autocomplete} address-level1`),
            })}
            required
            {...props.register(props.addressKeys.state)}
          >
            {Object.keys(AddressState).map((state) => (
              <option key={state} value={state}>
                {addressStateToName[state as keyof typeof AddressState]}
              </option>
            ))}
          </Select>
        </div>
        <div className="mobile-lg:grid-col-4">
          <DoulaTextInputMask
            className="usa-input--medium"
            name={props.addressKeys.zip}
            label={props.orderedInputNameToLabel[props.addressKeys.zip]}
            {...(props.autocomplete !== undefined && {
              autoComplete: typecheckAutocomplete(`${props.autocomplete} postal-code`),
            })}
            value={props.zipValue ?? ""}
            mask="#####"
            pattern="\d{5}"
            required
            errors={props.errors}
            register={props.register}
            registerOptions={{
              required: `${formatInputErrorLabel(props.orderedInputNameToLabel[props.addressKeys.zip], props.errorLabelPrefix, true)} is required`,
              minLength: {
                value: 5,
                message: `${formatInputErrorLabel(props.orderedInputNameToLabel[props.addressKeys.zip], props.errorLabelPrefix, true)} must have five digits`,
              },
            }}
          />
        </div>
      </div>
    </Fieldset>
  );
};
