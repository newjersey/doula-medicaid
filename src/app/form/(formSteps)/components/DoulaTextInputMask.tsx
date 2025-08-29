import { ErrorMessage } from "@/app/form/(formSteps)/components/ErrorMessage";
import { Hint } from "@/app/form/(formSteps)/components/Hint";
import { formatDescribedBy } from "@/app/form/(formSteps)/components/utils/doulaInput";
import {
  Label,
  TextInputMask,
  type TextInputMaskProps,
  type ValidationStatus,
} from "@trussworks/react-uswds";
import type {
  FieldErrors,
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type wrappedAttributes = "type" | "name" | "required";
type internallySetAttributes = "id" | "validationStatus" | "aria-invalid" | "aria-describedby";

interface DoulaTextInputMaskProps<T extends FieldValues>
  extends Omit<TextInputMaskProps, wrappedAttributes | internallySetAttributes> {
  name: FieldPath<T>;
  label: React.ReactNode;
  hint?: string;
  type?: TextInputMaskProps["type"];
  required?: boolean;
  errors?: FieldErrors<T>;
  register: UseFormRegister<T>;
  registerOptions?: RegisterOptions<T>;
}

const DoulaTextInputMask = <T extends FieldValues>(props: DoulaTextInputMaskProps<T>) => {
  const { name, label, hint, type, required, errors, register, registerOptions, ...otherProps } =
    props;
  const hasError = errors !== undefined && errors[name] !== undefined;
  const internallySetProps: Partial<TextInputMaskProps> = {};

  const describedby = formatDescribedBy(name, errors, hint);
  if (describedby !== "") {
    internallySetProps["aria-describedby"] = describedby;
  }

  if (hasError) {
    const validationStatusError: ValidationStatus = "error";
    internallySetProps.validationStatus = errors[name] ? validationStatusError : undefined;
    internallySetProps["aria-invalid"] = errors[name] ? ("true" as const) : ("false" as const);
  }

  return (
    <>
      <Label htmlFor={name} requiredMarker={required}>
        {label}
      </Label>
      {hint !== undefined && <Hint name={name} hint={hint} />}
      <TextInputMask
        id={name}
        type={type ?? "text"}
        required={required}
        {...internallySetProps}
        {...otherProps}
        {...register(name, registerOptions)}
      />
      {hasError && <ErrorMessage name={name} errors={errors} />}
    </>
  );
};

export default DoulaTextInputMask;
