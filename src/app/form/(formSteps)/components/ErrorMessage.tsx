import type { ValidationStatus } from "@trussworks/react-uswds";
import type { FieldErrors, FieldValues, LiteralUnion, RegisterOptions } from "react-hook-form";

type CustomMessage = {
  type: LiteralUnion<keyof RegisterOptions, string>;
  message: string | React.ReactNode;
};

interface ErrorMessageProps<T extends FieldValues> {
  name: keyof T;
  errors: FieldErrors<T>;
  customMessages?: Array<CustomMessage>;
}

interface ErrorAriaAttributes {
  "aria-invalid": "true" | "false";
  "aria-describedby": string | undefined;
}

const formatErrorMessageId = <T extends FieldValues>(name: keyof T) => {
  return `${name.toString()}ErrorMessage`;
};

const getErrorAriaAttributes = <T extends FieldValues>(
  name: keyof T,
  errors: FieldErrors<T>,
  additionalDescribedby: string,
): ErrorAriaAttributes => {
  const error = errors[name];
  return {
    "aria-invalid": error ? ("true" as const) : ("false" as const),
    "aria-describedby": error
      ? `${formatErrorMessageId(name)} ${additionalDescribedby}`
      : undefined,
  };
};

export const getRadioErrorAttributes = <T extends FieldValues>(
  name: keyof T,
  errors: FieldErrors<T>,
  additionalDescribedby: string = "",
): ErrorAriaAttributes => {
  return getErrorAriaAttributes(name, errors, additionalDescribedby);
};

export const getTextInputErrorAttributes = <T extends FieldValues>(
  name: keyof T,
  errors: FieldErrors<T>,
  additionalDescribedby: string = "",
): ErrorAriaAttributes & {
  validationStatus: ValidationStatus | undefined;
} => {
  const validationStatusError: ValidationStatus = "error";
  return {
    validationStatus: errors[name] ? validationStatusError : undefined,
    ...getErrorAriaAttributes(name, errors, additionalDescribedby),
  };
};

export const getSelectErrorProps = getTextInputErrorAttributes;

const getMessage = <T extends FieldValues>(
  error: NonNullable<FieldErrors<T>[keyof T]>,
  customMessages: Array<CustomMessage> | undefined,
) => {
  if (error.message !== undefined && error.message !== "") {
    if (typeof error.message === "string") {
      return error.message;
    } else {
      throw new Error(`Unexpected error message type ${error?.message}`);
    }
  }
  if (customMessages) {
    for (const customMessage of customMessages) {
      if (error.type === customMessage.type) {
        return customMessage.message;
      }
    }
  }
  throw new Error("Unexpected error with no message");
};

export const ErrorMessage = <T extends FieldValues>(props: ErrorMessageProps<T>) => {
  const error = props.errors[props.name];
  return (
    <>
      {error && (
        <span id={formatErrorMessageId(props.name)} className="usa-error-message">
          {getMessage(error, props.customMessages)}
        </span>
      )}
    </>
  );
};
