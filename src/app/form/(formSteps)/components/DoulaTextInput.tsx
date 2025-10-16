import {
  ErrorMessage,
  type CustomErrorMessage,
} from "@/app/form/(formSteps)/components/ErrorMessage";
import { Hint } from "@/app/form/(formSteps)/components/Hint";
import { formatDescribedBy } from "@/app/form/(formSteps)/components/utils/doulaInput";
import {
  InputGroup,
  InputPrefix,
  Label,
  TextInput,
  type TextInputProps,
  type ValidationStatus,
} from "@trussworks/react-uswds";
import type {
  ChangeHandler,
  FieldErrors,
  FieldPath,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  UseFormRegisterReturn,
} from "react-hook-form";

type wrappedAttributes = "type" | "name" | "required";
type internallySetAttributes = "id" | "validationStatus" | "aria-invalid";

interface DoulaTextInputProps<T extends FieldValues>
  extends Omit<TextInputProps, wrappedAttributes | internallySetAttributes> {
  name: FieldPath<T>;
  label: React.ReactNode;
  hint?: string;
  inputPrefix?: string;
  type?: TextInputProps["type"];
  required?: boolean;
  numericOnly?: boolean;
  hideErrorMessage?: boolean;
  errors?: FieldErrors<T>;
  register: UseFormRegister<T>;
  registerOptions?: RegisterOptions<T>;
  customErrorMessages?: Array<CustomErrorMessage>;
}

const wrapRegisterProps = <T extends FieldValues>(
  registerProps: UseFormRegisterReturn<Path<T>>,
  numericOnly: boolean | undefined,
): UseFormRegisterReturn<Path<T>> => {
  if (numericOnly === true) {
    const { onChange, ...otherRegisterProps } = registerProps;
    const wrappedOnChange: ChangeHandler = (e) => {
      e.target.value = e.target.value.replace(/\D/g, "");
      return onChange?.(e);
    };
    return {
      ...otherRegisterProps,
      onChange: wrappedOnChange,
    };
  }

  return registerProps;
};

const DoulaTextInput = <T extends FieldValues>(props: DoulaTextInputProps<T>) => {
  const {
    name,
    label,
    hint,
    inputPrefix,
    type,
    "aria-describedby": ariaDescribedby,
    required,
    numericOnly,
    errors,
    hideErrorMessage,
    register,
    registerOptions,
    customErrorMessages,
    ...otherProps
  } = props;

  const hasError = errors !== undefined && errors[name] !== undefined;
  const internallySetProps: Partial<TextInputProps> = {};

  const describedby = formatDescribedBy(name, errors, hint, ariaDescribedby);
  if (describedby !== "") {
    internallySetProps["aria-describedby"] = describedby;
  }

  if (hasError) {
    const validationStatusError: ValidationStatus = "error";
    internallySetProps.validationStatus = errors[name] ? validationStatusError : undefined;
    internallySetProps["aria-invalid"] = errors[name] ? ("true" as const) : ("false" as const);
  }
  let input = (
    <TextInput
      id={name}
      type={type ?? "text"}
      required={required}
      {...internallySetProps}
      {...otherProps}
      {...wrapRegisterProps(register(name, registerOptions), numericOnly)}
    />
  );

  if (inputPrefix) {
    input = (
      <InputGroup error={hasError}>
        <InputPrefix>{inputPrefix}</InputPrefix>
        {input}
      </InputGroup>
    );
  }

  return (
    <>
      <Label htmlFor={name} requiredMarker={required}>
        {label}
      </Label>
      {hint !== undefined && <Hint name={name} hint={hint} />}
      {input}
      {hasError && hideErrorMessage !== true && (
        <ErrorMessage name={name} errors={errors} customErrorMessages={customErrorMessages} />
      )}
    </>
  );
};

export default DoulaTextInput;
