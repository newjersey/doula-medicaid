import DoulaTextInput from "@/app/form/(formSteps)/components/DoulaTextInput";
import { ErrorMessage } from "@/app/form/(formSteps)/components/ErrorMessage";
import {
  formatErrorMessageId,
  formatInputErrorLabel,
} from "@/app/form/(formSteps)/components/utils/doulaInput";
import {
  DateInputGroup,
  Fieldset,
  FormGroup,
  Label,
  RequiredMarker,
  Select,
} from "@trussworks/react-uswds";
import type { FieldErrors, FieldPath, FieldValues, UseFormRegister } from "react-hook-form";

export interface DoulaDateInputProps<T extends FieldValues> {
  name: string;
  label: string;
  hint: string;
  monthName: FieldPath<T>;
  dayName: FieldPath<T>;
  yearName: FieldPath<T>;
  errorLabelPrefix?: string;
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
}

export const DoulaDateInput = <T extends FieldValues>(props: DoulaDateInputProps<T>) => {
  return (
    <Fieldset
      legend={
        <div>
          <div className="usa-label">
            {props.label} <RequiredMarker />
          </div>
          <div className="usa-hint">{props.hint}</div>
        </div>
      }
    >
      <DateInputGroup>
        <FormGroup className="usa-form-group--month usa-form-group--select">
          <Label htmlFor={props.monthName} requiredMarker>
            Month
          </Label>
          <Select
            id={props.monthName}
            required
            validationStatus={props.errors[props.monthName] ? "error" : undefined}
            aria-invalid={props.errors[props.monthName] ? "true" : "false"}
            aria-describedby={
              props.errors[props.monthName] ? formatErrorMessageId(props.monthName) : ""
            }
            {...props.register(props.monthName, {
              required: `${formatInputErrorLabel("Month", props.errorLabelPrefix)} is required`,
            })}
          >
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </Select>
        </FormGroup>
        <FormGroup className="usa-form-group--day">
          <DoulaTextInput
            name={props.dayName}
            label="Day"
            pattern="[0-9]*"
            inputMode="numeric"
            maxLength={2}
            minLength={2}
            required
            hideErrorMessage
            errors={props.errors}
            register={props.register}
            additionalRegisterOptions={{
              required: `${formatInputErrorLabel("Day", props.errorLabelPrefix)} is required`,
              valueAsNumber: true,
              min: {
                value: 1,
                message: `${formatInputErrorLabel("Day", props.errorLabelPrefix)} must be between 1 and 31`,
              },
              max: {
                value: 31,
                message: `${formatInputErrorLabel("Day", props.errorLabelPrefix)} must be between 1 and 31`,
              },
              validate: (value) => {
                if (value === null) {
                  return `${formatInputErrorLabel("Day", props.errorLabelPrefix)} is required`;
                }
                if (Number.isNaN(value) || typeof value === "string") {
                  return `${formatInputErrorLabel("Day", props.errorLabelPrefix)} must be a number`;
                }
                return true;
              },
            }}
          />
        </FormGroup>
        <FormGroup className="usa-form-group--year">
          <DoulaTextInput
            name={props.yearName}
            label="Year"
            maxLength={4}
            minLength={4}
            pattern="[0-9]*"
            inputMode="numeric"
            required
            hideErrorMessage
            errors={props.errors}
            register={props.register}
            additionalRegisterOptions={{
              required: `${formatInputErrorLabel("Year", props.errorLabelPrefix)} is required`,
              valueAsNumber: true,
              validate: (value) => {
                if (value === null) {
                  return `${formatInputErrorLabel("Year", props.errorLabelPrefix)} is required`;
                }
                if (Number.isNaN(value) || typeof value === "string") {
                  return `${formatInputErrorLabel("Year", props.errorLabelPrefix)} must be a number`;
                }
                if ((value as number).toString().length !== 4) {
                  return `${formatInputErrorLabel("Year", props.errorLabelPrefix)} must have four digits`;
                }
                return true;
              },
            }}
          />
        </FormGroup>
      </DateInputGroup>
      <ErrorMessage name={props.monthName} errors={props.errors} />
      <ErrorMessage name={props.dayName} errors={props.errors} />
      <ErrorMessage name={props.yearName} errors={props.errors} />
    </Fieldset>
  );
};
