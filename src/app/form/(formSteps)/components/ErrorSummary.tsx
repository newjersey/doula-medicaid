import type { FieldErrors, FieldValues, Path, UseFormSetFocus } from "react-hook-form";

interface ErrorSummaryProps<T extends FieldValues> {
  shouldSummarizeErrors: boolean;
  errors: FieldErrors<T>;
  ref: React.RefObject<HTMLDivElement | null>;
  setFocus: UseFormSetFocus<T>;
}

const ErrorSummary = <T extends FieldValues>(props: ErrorSummaryProps<T>) => {
  return (
    <div tabIndex={-1} ref={props.ref}>
      {props.shouldSummarizeErrors && Object.keys(props.errors).length >= 1 && (
        <div
          className="usa-alert usa-alert--error margin-bottom-3 border-05 border-top-105 border-secondary-dark"
          aria-labelledby="error-summary-heading"
        >
          <div className="usa-alert__body">
            <h2 className="usa-alert__heading" id="error-summary-heading">
              There is a problem
            </h2>
            <ul className="usa-list usa-list--unstyled">
              {Object.entries(props.errors).map(([field, error]) => {
                if (typeof error?.message === "string") {
                  return (
                    <li key={field}>
                      <a
                        href={`#${field}`}
                        onClick={(e) => {
                          e.preventDefault();
                          props.setFocus(field as Path<T>);
                        }}
                      >
                        {error.message}
                      </a>
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorSummary;
