import {
  ErrorMessage,
  getTextInputErrorAttributes,
} from "@/app/form/(formSteps)/components/ErrorMessage";
import { Label, TextInput, type TextInputProps } from "@trussworks/react-uswds";
import type { FieldErrors, FieldValues, UseFormRegisterReturn } from "react-hook-form";

interface DoulaTextInputProps<T extends FieldValues>
  extends Omit<TextInputProps, "type" | "id" | "required"> {
  name: string;
  label: string | React.ReactNode;
  type?: "number" | "search" | "text" | "email" | "password" | "tel" | "url";
  isRequired?: boolean;
  errors?: FieldErrors<T>;
  hideErrorMessage?: boolean;
  registerFields: UseFormRegisterReturn;
  //   registerOptions?: RegisterOptions
}

const DoulaTextInput = <T extends FieldValues>(props: DoulaTextInputProps<T>) => {
  const { name, label, type, isRequired, errors, hideErrorMessage, registerFields, ...leftOver } =
    props;
  return (
    <>
      <Label htmlFor={name} requiredMarker={isRequired}>
        {label}
      </Label>
      <TextInput
        id={name}
        type={type ?? "text"}
        required={isRequired}
        {...(errors !== undefined && getTextInputErrorAttributes(name, errors))}
        {...registerFields}
        {...leftOver}
      />
      {errors !== undefined && hideErrorMessage !== true && (
        <ErrorMessage name={name} errors={errors} />
      )}
    </>
  );
};

export default DoulaTextInput;
