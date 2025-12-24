import { DoulaAddressState } from "@/app/form/(formSteps)/components/DoulaAddressState";
import { DoulaAddressZip } from "@/app/form/(formSteps)/components/DoulaAddressZip";
import DoulaTextInput from "@/app/form/(formSteps)/components/DoulaTextInput";
import { formatInputErrorLabel } from "@/app/form/(formSteps)/components/utils/doulaInput";
import { typecheckAutocomplete } from "@/app/form/_utils/types/autocomplete";
import { Fieldset, type FieldsetProps } from "@trussworks/react-uswds";
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
            additionalRegisterOptions={{
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
            additionalRegisterOptions={{
              required: `${formatInputErrorLabel(props.orderedInputNameToLabel[props.addressKeys.city], props.errorLabelPrefix)} is required`,
            }}
          />
        </div>
      </div>
      <div className="grid-row grid-gap">
        <div className="mobile-lg:grid-col-6">
          <DoulaAddressState
            name={props.addressKeys.state}
            label={props.orderedInputNameToLabel[props.addressKeys.state]}
            autocomplete={props.autocomplete}
            register={props.register}
          />
        </div>
        <div className="mobile-lg:grid-col-4">
          <DoulaAddressZip
            name={props.addressKeys.zip}
            label={props.orderedInputNameToLabel[props.addressKeys.zip]}
            value={props.zipValue ?? ""}
            autocomplete={props.autocomplete}
            errorLabelPrefix={props.errorLabelPrefix}
            errors={props.errors}
            register={props.register}
          />
        </div>
      </div>
    </Fieldset>
  );
};
