import { ErrorMessage } from "@/app/form/(formSteps)/components/ErrorMessage";
import { Hint } from "@/app/form/(formSteps)/components/Hint";
import { formatDescribedBy } from "@/app/form/(formSteps)/components/utils/doulaInput";
import { CharacterCount, Label, type TextareaCharacterCountProps } from "@trussworks/react-uswds";
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
  inputClassName?: string;
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
    "aria-describedby": ariaDescribedby,
    inputClassName,
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
  const requiredRegisterOption = required === true ? { required: "This question is required" } : {};

  const input = (
    <CharacterCount
      id={name}
      required={required}
      isTextArea={true}
      {...internallySetProps}
      {...otherProps}
      className={inputClassName}
      {...register(name, {
        ...requiredRegisterOption,
        maxLength: {
          value: otherProps.maxLength,
          message: "Character limit exceeded. Please edit and try again.",
        },
        ...additionalRegisterOptions,
      })}
    />
  );

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
