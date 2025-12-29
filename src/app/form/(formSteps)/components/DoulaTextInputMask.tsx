import {
  ErrorMessage,
  type CustomErrorMessage,
} from "@/app/form/(formSteps)/components/ErrorMessage";
import { Hint } from "@/app/form/(formSteps)/components/Hint";
import { formatDescribedBy } from "@/app/form/(formSteps)/components/utils/doulaInput";
import { Label, TextInputMask, type TextInputMaskProps } from "@trussworks/react-uswds";
import type {
  FieldErrors,
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type wrappedAttributes = "type" | "name" | "required";
type internallySetAttributes = "id" | "validationStatus" | "aria-invalid";

interface DoulaTextInputMaskProps<T extends FieldValues> extends Omit<
  TextInputMaskProps,
  wrappedAttributes | internallySetAttributes
> {
  name: FieldPath<T>;
  label: React.ReactNode;
  hint?: string;
  type?: TextInputMaskProps["type"];
  required?: boolean;
  errors?: FieldErrors<T>;
  register: UseFormRegister<T>;
  additionalRegisterOptions?: RegisterOptions<T>;
  jsxErrorMessage?: Array<CustomErrorMessage>;
}

const DoulaTextInputMask = <T extends FieldValues>(props: DoulaTextInputMaskProps<T>) => {
  const {
    name,
    label,
    hint,
    type,
    "aria-describedby": ariaDescribedby,
    required,
    errors,
    register,
    additionalRegisterOptions,
    jsxErrorMessage,
    ...otherProps
  } = props;
  const hasError = errors !== undefined && errors[name] !== undefined;
  const internallySetProps: Partial<TextInputMaskProps> = {};

  const describedby = formatDescribedBy(name, errors, hint, ariaDescribedby);
  if (describedby !== "") {
    internallySetProps["aria-describedby"] = describedby;
  }

  if (hasError) {
    internallySetProps.validationStatus = "error";
    internallySetProps["aria-invalid"] = "true" as const;
  }

  // To override this, pass in additionalRegisterOptions
  const defaultRegisterOptions = required === true ? { required: `${label} is required` } : {};

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
        {...register(name, { ...defaultRegisterOptions, ...additionalRegisterOptions })}
      />
      {hasError && <ErrorMessage name={name} errors={errors} jsxErrorMessage={jsxErrorMessage} />}
    </>
  );
};

export default DoulaTextInputMask;
