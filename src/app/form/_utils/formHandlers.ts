import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { type RefObject } from "react";
import type {
  FieldPath,
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormSetFocus,
} from "react-hook-form";
import { type FormProgressPosition, routeToNextStep } from "./formProgressRouting";
import { type SessionStorageKey, setKeyValue } from "./sessionStorage";

export const createFormSubmitHandler = <T extends FieldValues>(
  router: AppRouterInstance,
  formProgressPosition: FormProgressPosition,
): SubmitHandler<T> => {
  return (data: T) => {
    let key: keyof T;
    for (key in data) {
      const value = data[key] ?? "";
      setKeyValue(key as SessionStorageKey, value);
    }
    routeToNextStep(router, formProgressPosition);
  };
};

export const createFormErrorHandler = <T extends FieldValues>(
  orderedInputNameToLabel: { [key in keyof T]: string },
  setShouldSummarizeErrors: (value: boolean) => void,
  errorSummaryRef: RefObject<HTMLDivElement | null>,
  setFocus: UseFormSetFocus<T>,
): SubmitErrorHandler<T> => {
  return (errors) => {
    if (Object.keys(errors).length >= 3) {
      setShouldSummarizeErrors(true);
      errorSummaryRef.current?.focus();
    } else {
      setShouldSummarizeErrors(false);
      for (const inputName of Object.keys(orderedInputNameToLabel) as Array<keyof T>) {
        const fieldPath = inputName as FieldPath<T>;
        if (errors[fieldPath] !== undefined) {
          setFocus(fieldPath);
          break;
        }
      }
    }
  };
};
