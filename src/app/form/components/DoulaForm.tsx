import ErrorSummary from "@/app/form/(formSteps)/components/ErrorSummary";
import { type SessionStorageKey, setKeyValue } from "@/app/form/_utils/sessionStorage";
import { routeToNextStep, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { Form } from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type {
  FieldErrors,
  FieldPath,
  FieldValues,
  UseFormHandleSubmit,
  UseFormSetFocus,
} from "react-hook-form";

export const DoulaForm = <T extends FieldValues>(props: {
  orderedInputNameToLabel: {
    [key in keyof T]: string;
  };
  errors: FieldErrors<T>;
  setFocus: UseFormSetFocus<T>;
  handleSubmit: UseFormHandleSubmit<T, T>;
  children?: React.ReactNode;
}) => {
  const router = useRouter();
  const formProgressPosition = useFormProgressPosition();
  const [shouldSummarizeErrors, setShouldSummarizeErrors] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsDataLoaded(true);
  }, []);

  const onSubmit = (data: T) => {
    let key: keyof T;
    for (key in data) {
      const value = data[key] ?? "";
      setKeyValue(key as SessionStorageKey, value);
    }
    routeToNextStep(router, formProgressPosition);
  };

  const onError = (errors: FieldErrors<T>) => {
    if (Object.keys(errors).length >= 3) {
      setShouldSummarizeErrors(true);
      errorSummaryRef.current?.focus();
    } else {
      setShouldSummarizeErrors(false);
      for (const inputName of Object.keys(props.orderedInputNameToLabel) as Array<keyof T>) {
        const fieldPath = inputName as FieldPath<T>;
        if (errors[fieldPath] !== undefined) {
          props.setFocus(fieldPath);
          break;
        }
      }
    }
  };

  return (
    <div>
      {isDataLoaded && (
        <Form onSubmit={props.handleSubmit(onSubmit, onError)} className="maxw-full" noValidate>
          <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
            <div className="desktop:grid-col-8">
              <ErrorSummary<T>
                shouldSummarizeErrors={shouldSummarizeErrors}
                errors={props.errors}
                ref={errorSummaryRef}
                setFocus={props.setFocus}
              />
            </div>
          </div>
          {props.children}
        </Form>
      )}
    </div>
  );
};
