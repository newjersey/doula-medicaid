import { ErrorMessage } from "@/app/form/(formSteps)/components/ErrorMessage";
import { Hint } from "@/app/form/(formSteps)/components/Hint";
import { formatDescribedBy } from "@/app/form/(formSteps)/components/utils/doulaInput";
import {
  CharacterCount,
  InputGroup,
  InputPrefix,
  Label,
  type TextareaCharacterCountProps,
} from "@trussworks/react-uswds";
import type {
  FieldErrors,
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type wrappedAttributes = "getMessage" | "name" | "required";
type internallySetAttributes = "id" | "validationStatus" | "aria-invalid";

export interface DoulaTextareaCharacterCountProps<T extends FieldValues>
  extends Omit<TextareaCharacterCountProps, wrappedAttributes | internallySetAttributes> {
  name: FieldPath<T>;
  label: React.ReactNode;
  hint?: string;
  inputPrefix?: string;
  required?: boolean;
  errors?: FieldErrors<T>;
  register: UseFormRegister<T>;
  additionalRegisterOptions?: RegisterOptions<T>;
}

const DoulaTextareaCharacterCount = <T extends FieldValues>(
  props: DoulaTextareaCharacterCountProps<T>,
) => {
  const {
    name,
    label,
    hint,
    inputPrefix,
    "aria-describedby": ariaDescribedby,
    required,
    errors,
    register,
    additionalRegisterOptions,
    ...otherProps
  } = props;

  const hasError = errors !== undefined && errors[name] !== undefined;
  const internallySetProps: Partial<TextareaCharacterCountProps> = {};

  const describedby = formatDescribedBy(name, errors, hint, ariaDescribedby);
  if (describedby !== "") {
    internallySetProps["aria-describedby"] = describedby;
  }

  if (hasError) {
    internallySetProps.error = true;
    internallySetProps["aria-invalid"] = "true" as const;
  }

  // To override this, pass in additionalRegisterOptions
  const requiredRegisterOption = required === true ? { required: `${label} is required` } : {};

  let input = (
    <CharacterCount
      id={name}
      required={required}
      isTextArea={true}
      {...internallySetProps}
      {...otherProps}
      {...register(name, {
        ...requiredRegisterOption,
        maxLength: {
          value: otherProps.maxLength,
          message: `${label} must be ${otherProps.maxLength} characters or less`,
        },
        ...additionalRegisterOptions,
      })}
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
      {errors !== undefined && errors[name] !== undefined && (
        <ErrorMessage name={name} errors={errors} />
      )}
    </>
  );
};

export default DoulaTextareaCharacterCount;
