import ErrorSummary from "@/app/form/(formSteps)/components/ErrorSummary";
import {} from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { formatFormProgressUrl, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { Form } from "@trussworks/react-uswds";
import { useEffect, useRef, useState } from "react";
import type {
  FieldErrors,
  FieldPath,
  FieldValues,
  UseFormHandleSubmit,
  UseFormSetFocus,
} from "react-hook-form";
import { useNavigate } from "react-router";

type DoulaFormProps<T extends FieldValues> =
  | {
      orderedInputNameToLabel: {
        [key in FieldPath<T>]: string;
      };
      errors: FieldErrors<T>;
      setFocus: UseFormSetFocus<T>;
      handleSubmit: UseFormHandleSubmit<T, T>;
      children: React.ReactNode;
      mayHaveThreeOrMoreErrors: true;
    }
  | {
      errors: FieldErrors<T>;
      handleSubmit: UseFormHandleSubmit<T, T>;
      children: React.ReactNode;
      mayHaveThreeOrMoreErrors: false;
    };

export const DoulaForm = <T extends FieldValues>(props: DoulaFormProps<T>) => {
  let onSubmitHandler;
  const navigate = useNavigate();
  const formProgressPosition = useFormProgressPosition();
  const [shouldSummarizeErrors, setShouldSummarizeErrors] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const { updateDataStore } = useDataStore();

  useEffect(() => {
    setIsDataLoaded(true);
  }, []);

  const onSubmit = (data: T) => {
    const stringData: { [key: string]: string } = {};
    for (const key in data) {
      const value = data[key];
      stringData[key] = typeof value === "string" ? value : value.toString();
    }
    updateDataStore(stringData);
    if (formProgressPosition.next !== null) {
      navigate(formatFormProgressUrl(formProgressPosition.next));
    }
  };

  if (props.mayHaveThreeOrMoreErrors) {
    const onError = (errors: FieldErrors<T>) => {
      if (Object.keys(errors).length >= 3) {
        setShouldSummarizeErrors(true);
        errorSummaryRef.current?.focus();
      } else {
        setShouldSummarizeErrors(false);
        for (const inputName of Object.keys(props.orderedInputNameToLabel) as Array<FieldPath<T>>) {
          const fieldPath = inputName as FieldPath<T>;
          if (errors[fieldPath] !== undefined) {
            props.setFocus(fieldPath);
            break;
          }
        }
      }
    };

    onSubmitHandler = props.handleSubmit(onSubmit, onError);
  } else {
    onSubmitHandler = props.handleSubmit(onSubmit);
  }

  return (
    <div>
      {isDataLoaded && (
        <Form onSubmit={onSubmitHandler} className="maxw-full" noValidate>
          {props.mayHaveThreeOrMoreErrors && (
            <div className={`grid-row grid-gap-3 ${shouldSummarizeErrors && "margin-top-3"}`}>
              <div className="desktop:grid-col-8">
                <ErrorSummary<T>
                  shouldSummarizeErrors={shouldSummarizeErrors}
                  errors={props.errors}
                  ref={errorSummaryRef}
                  setFocus={props.setFocus}
                />
              </div>
            </div>
          )}
          {props.children}
        </Form>
      )}
    </div>
  );
};
