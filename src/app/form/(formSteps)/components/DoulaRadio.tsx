import { hasWhiteSpace } from "@/app/_utils/stringHasWhiteSpace";
import {
  ErrorMessage,
  type CustomErrorMessage,
} from "@/app/form/(formSteps)/components/ErrorMessage";
import { formatDescribedBy } from "@/app/form/(formSteps)/components/utils/doulaInput";
import { Fieldset, Radio, RequiredMarker, type RadioProps } from "@trussworks/react-uswds";
import type {
  FieldErrors,
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

export interface DoulaRadioOption<T extends FieldValues> {
  label: React.ReactNode;
  value: string;
  additionalRegisterOptions?: RegisterOptions<T>;
}

type wrappedAttributes = "name" | "required";
type internallySetAttributes = "id" | "aria-invalid";

export interface DoulaRadioProps<T extends FieldValues>
  extends Omit<RadioProps, wrappedAttributes | internallySetAttributes> {
  name: FieldPath<T>;
  value: string;
  label: React.ReactNode;
  required?: boolean;
  options: Array<DoulaRadioOption<T>>;
  errors?: FieldErrors<T>;
  register: UseFormRegister<T>;
  jsxErrorMessage?: Array<CustomErrorMessage>;
}

const getLegend = (label: React.ReactNode, isRequired: boolean | undefined) => {
  return typeof label === "string" ? (
    <div className="usa-label">
      <p>{label}</p>
      <p>Select one {isRequired === true && <RequiredMarker />}</p>
    </div>
  ) : (
    <div className="usa-label">
      {label}
      <p>Select one {isRequired === true && <RequiredMarker />}</p>
    </div>
  );
};

const DoulaRadio = <T extends FieldValues>(props: DoulaRadioProps<T>) => {
  const {
    name,
    value,
    label,
    "aria-describedby": ariaDescribedby,
    required,
    options,
    errors,
    register,
    jsxErrorMessage,
    ...otherProps
  } = props;

  const hasError = errors !== undefined && errors[name] !== undefined;
  const internallySetProps: Partial<RadioProps> = {};
  const describedby = formatDescribedBy(name, errors, undefined, ariaDescribedby);
  if (describedby !== "") {
    internallySetProps["aria-describedby"] = describedby;
  }

  if (hasError) {
    internallySetProps["aria-invalid"] = "true" as const;
  }

  const defaultRegisterOptions = required === true ? { required: "This question is required" } : {};

  return (
    <Fieldset legend={getLegend(label, required)}>
      {options.map((option: DoulaRadioOption<T>) => {
        if (hasWhiteSpace(option.value)) {
          throw new Error(
            `The option value is used in the HTML id, and should not have white space: ${option.value}`,
          );
        }
        return (
          <Radio
            key={option.value}
            id={`${name}${option.value}`}
            label={option.label}
            value={option.value}
            checked={value === option.value}
            required={required}
            {...register(name, { ...defaultRegisterOptions, ...option.additionalRegisterOptions })}
            {...otherProps}
            {...internallySetProps}
          />
        );
      })}
      {hasError && <ErrorMessage name={name} errors={errors} jsxErrorMessage={jsxErrorMessage} />}
    </Fieldset>
  );
};

export default DoulaRadio;
