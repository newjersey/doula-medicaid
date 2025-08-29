import { formatErrorMessageId } from "@/app/form/(formSteps)/components/utils/doulaInput";
import type {
  FieldErrors,
  FieldPath,
  FieldValues,
  LiteralUnion,
  RegisterOptions,
} from "react-hook-form";

type CustomErrorMessage = {
  type: LiteralUnion<keyof RegisterOptions, string>;
  message: React.ReactNode;
};

export interface ErrorMessageProps<T extends FieldValues> {
  name: FieldPath<T>;
  errors: FieldErrors<T>;
  customErrorMessages?: Array<CustomErrorMessage>;
}

const getMessage = <T extends FieldValues>(
  error: NonNullable<FieldErrors<T>[FieldPath<T>]>,
  customErrorMessages: Array<CustomErrorMessage> | undefined,
) => {
  if (customErrorMessages) {
    for (const customErrorMessage of customErrorMessages) {
      if (error.type === customErrorMessage.type) {
        return customErrorMessage.message;
      }
    }
  }
  if (error.message !== undefined && error.message !== "") {
    if (typeof error.message === "string") {
      return error.message;
    } else {
      throw new Error(`Unexpected error message type ${error?.message}`);
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
          {getMessage(error, props.customErrorMessages)}
        </span>
      )}
    </>
  );
};
