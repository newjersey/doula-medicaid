"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import DoulaTextInput from "@/app/form/(formSteps)/components/DoulaTextInput";
import { ErrorMessage } from "@/app/form/(formSteps)/components/ErrorMessage";
import CoverageAmountExplainer from "@/app/form/(formSteps)/insurance/1/CoverageAmountExplainer";
import InsuranceCoverageExplainer from "@/app/form/(formSteps)/insurance/1/InsuranceCoverageExplainer";
import { type Insurance1Data } from "@/app/form/(formSteps)/insurance/InsuranceData";
import { getDefaultValue } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { DateInputGroup, Fieldset, FormGroup, Label, Select } from "@trussworks/react-uswds";
import { useForm } from "react-hook-form";

const orderedInputNameToLabel: { [key in keyof Insurance1Data]: string } = {
  insuranceStartDateMonth: "Month",
  insuranceStartDateDay: "Day",
  insuranceStartDateYear: "Year",
  insuranceEndDateMonth: "Month",
  insuranceEndDateDay: "Day",
  insuranceEndDateYear: "Year",
  insuranceOccurenceAmount: "Amount per occurrence",
  insuranceAggregateAmount: "Amount per aggregate",
};

const InsuranceStep1 = () => {
  const mayHaveThreeOrMoreErrors = true;
  const { dataStore } = useDataStore();
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<Insurance1Data>({
    defaultValues: {
      insuranceStartDateMonth: getDefaultValue(dataStore, "insuranceStartDateMonth") ?? "",
      insuranceStartDateDay: getDefaultValue(dataStore, "insuranceStartDateDay") ?? "",
      insuranceStartDateYear: getDefaultValue(dataStore, "insuranceStartDateYear") ?? "",
      insuranceEndDateMonth: getDefaultValue(dataStore, "insuranceEndDateMonth") ?? "",
      insuranceEndDateDay: getDefaultValue(dataStore, "insuranceEndDateDay") ?? "",
      insuranceEndDateYear: getDefaultValue(dataStore, "insuranceEndDateYear") ?? "",
      insuranceOccurenceAmount: getDefaultValue(dataStore, "insuranceOccurenceAmount") ?? "",
      insuranceAggregateAmount: getDefaultValue(dataStore, "insuranceAggregateAmount") ?? "",
    },
    shouldFocusError: !mayHaveThreeOrMoreErrors,
  });

  return (
    <DoulaForm<Insurance1Data>
      orderedInputNameToLabel={orderedInputNameToLabel}
      errors={errors}
      setFocus={setFocus}
      handleSubmit={handleSubmit}
      mayHaveThreeOrMoreErrors={mayHaveThreeOrMoreErrors}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md">
            You must have active doula liability insurance to apply.
          </h2>
          <p>This insurance:</p>
          <ul className="usa-list usa-list--bulleted">
            <li>
              Must be active and not expire within 3 months of when you submit your FFS application;
            </li>
            <li>
              Must have a minimum coverage of $1 million per occurrence and $3 million in total
              (aggregate).
            </li>
          </ul>
          <h2 className="font-heading-md">Your insurance coverage</h2>
          <Fieldset legend="Start date" className="margin-top-3" requiredMarker>
            <span className="usa-hint" id="insuranceStartDateHint">
              mm/dd/yyyy
            </span>
            <DateInputGroup aria-describedby="insuranceStartDateHint">
              <FormGroup className="usa-form-group--month usa-form-group--select">
                <Label htmlFor="insuranceStartDateMonth" requiredMarker>
                  {orderedInputNameToLabel["insuranceStartDateMonth"]}
                </Label>
                <Select
                  id="insuranceStartDateMonth"
                  required
                  validationStatus={errors.insuranceStartDateMonth ? "error" : undefined}
                  aria-invalid={errors.insuranceStartDateMonth ? "true" : "false"}
                  aria-describedby={
                    errors.insuranceStartDateMonth ? "insuranceStartDateMonthErrorMessage" : ""
                  }
                  {...register("insuranceStartDateMonth", {
                    required: `${orderedInputNameToLabel["insuranceStartDateMonth"]} is required`,
                  })}
                >
                  <option value="1">01 - January</option>
                  <option value="2">02 - February</option>
                  <option value="3">03 - March</option>
                  <option value="4">04 - April</option>
                  <option value="5">05 - May</option>
                  <option value="6">06 - June</option>
                  <option value="7">07 - July</option>
                  <option value="8">08 - August</option>
                  <option value="9">09 - September</option>
                  <option value="10">10 - October</option>
                  <option value="11">11 - November</option>
                  <option value="12">12 - December</option>
                </Select>
              </FormGroup>
              <FormGroup className="usa-form-group--day">
                <DoulaTextInput
                  name="insuranceStartDateDay"
                  label={orderedInputNameToLabel["insuranceStartDateDay"]}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={2}
                  minLength={2}
                  required
                  hideErrorMessage
                  errors={errors}
                  register={register}
                  registerOptions={{
                    required: `${orderedInputNameToLabel["insuranceStartDateDay"]} is required`,
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: `${orderedInputNameToLabel["insuranceStartDateDay"]} must be between 1 and 31`,
                    },
                    max: {
                      value: 31,
                      message: `${orderedInputNameToLabel["insuranceStartDateDay"]} must be between 1 and 31`,
                    },
                    validate: (value) => {
                      if (value === null) {
                        return `${orderedInputNameToLabel["insuranceStartDateDay"]} is required`;
                      }
                      if (Number.isNaN(value) || typeof value === "string") {
                        return `${orderedInputNameToLabel["insuranceStartDateDay"]} must be a number`;
                      }
                      return true;
                    },
                  }}
                />
              </FormGroup>
              <FormGroup className="usa-form-group--year">
                <DoulaTextInput
                  name="insuranceStartDateYear"
                  label={orderedInputNameToLabel["insuranceStartDateYear"]}
                  maxLength={4}
                  minLength={4}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  required
                  hideErrorMessage
                  errors={errors}
                  register={register}
                  registerOptions={{
                    required: `${orderedInputNameToLabel["insuranceStartDateYear"]} is required`,
                    valueAsNumber: true,
                    validate: (value) => {
                      if (value === null) {
                        return `${orderedInputNameToLabel["insuranceStartDateYear"]} is required`;
                      }
                      if (Number.isNaN(value) || typeof value === "string") {
                        return `${orderedInputNameToLabel["insuranceStartDateYear"]} must be a number`;
                      }
                      if ((value as number).toString().length !== 4) {
                        return `${orderedInputNameToLabel["insuranceStartDateYear"]} must have four digits`;
                      }
                      return true;
                    },
                  }}
                />
              </FormGroup>
            </DateInputGroup>
            <ErrorMessage name="insuranceStartDateMonth" errors={errors} />
            <ErrorMessage name="insuranceStartDateDay" errors={errors} />
            <ErrorMessage name="insuranceStartDateYear" errors={errors} />
          </Fieldset>

          <Fieldset legend="End date" className="margin-top-3" requiredMarker>
            <span className="usa-hint" id="insuranceEndDateHint">
              mm/dd/yyyy
            </span>
            <DateInputGroup aria-describedby="insuranceEndDateHint">
              <FormGroup className="usa-form-group--month usa-form-group--select">
                <Label htmlFor="insuranceEndDateMonth" requiredMarker>
                  {orderedInputNameToLabel["insuranceEndDateMonth"]}
                </Label>
                <Select
                  id="insuranceEndDateMonth"
                  required
                  validationStatus={errors.insuranceEndDateMonth ? "error" : undefined}
                  aria-invalid={errors.insuranceEndDateMonth ? "true" : "false"}
                  aria-describedby={
                    errors.insuranceEndDateMonth ? "insuranceEndDateMonthErrorMessage" : ""
                  }
                  {...register("insuranceEndDateMonth", {
                    required: `${orderedInputNameToLabel["insuranceEndDateMonth"]} is required`,
                  })}
                >
                  <option value="1">01 - January</option>
                  <option value="2">02 - February</option>
                  <option value="3">03 - March</option>
                  <option value="4">04 - April</option>
                  <option value="5">05 - May</option>
                  <option value="6">06 - June</option>
                  <option value="7">07 - July</option>
                  <option value="8">08 - August</option>
                  <option value="9">09 - September</option>
                  <option value="10">10 - October</option>
                  <option value="11">11 - November</option>
                  <option value="12">12 - December</option>
                </Select>
              </FormGroup>
              <FormGroup className="usa-form-group--day">
                <DoulaTextInput
                  name="insuranceEndDateDay"
                  label={orderedInputNameToLabel["insuranceEndDateDay"]}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={2}
                  minLength={2}
                  required
                  hideErrorMessage
                  errors={errors}
                  register={register}
                  registerOptions={{
                    required: `${orderedInputNameToLabel["insuranceEndDateDay"]} is required`,
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: `${orderedInputNameToLabel["insuranceEndDateDay"]} must be between 1 and 31`,
                    },
                    max: {
                      value: 31,
                      message: `${orderedInputNameToLabel["insuranceEndDateDay"]} must be between 1 and 31`,
                    },
                    validate: (value) => {
                      if (value === null) {
                        return `${orderedInputNameToLabel["insuranceEndDateDay"]} is required`;
                      }
                      if (Number.isNaN(value) || typeof value === "string") {
                        return `${orderedInputNameToLabel["insuranceEndDateDay"]} must be a number`;
                      }
                      return true;
                    },
                  }}
                />
              </FormGroup>
              <FormGroup className="usa-form-group--year">
                <DoulaTextInput
                  name="insuranceEndDateYear"
                  label={orderedInputNameToLabel["insuranceEndDateYear"]}
                  maxLength={4}
                  minLength={4}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  required
                  hideErrorMessage
                  errors={errors}
                  register={register}
                  registerOptions={{
                    required: `${orderedInputNameToLabel["insuranceEndDateYear"]} is required`,
                    valueAsNumber: true,
                    validate: (value) => {
                      if (value === null) {
                        return `${orderedInputNameToLabel["insuranceEndDateYear"]} is required`;
                      }
                      if (Number.isNaN(value) || typeof value === "string") {
                        return `${orderedInputNameToLabel["insuranceEndDateYear"]} must be a number`;
                      }
                      if ((value as number).toString().length !== 4) {
                        return `${orderedInputNameToLabel["insuranceEndDateYear"]} must have four digits`;
                      }
                      return true;
                    },
                  }}
                />
              </FormGroup>
            </DateInputGroup>
            <ErrorMessage name="insuranceEndDateMonth" errors={errors} />
            <ErrorMessage name="insuranceEndDateDay" errors={errors} />
            <ErrorMessage name="insuranceEndDateYear" errors={errors} />
          </Fieldset>
        </div>
        <div className="form-explainer desktop:grid-col-4">
          <InsuranceCoverageExplainer />
        </div>
      </div>
      <HorizontalDivider />
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md">Coverage amount</h2>
          <div className="tablet:grid-col-6">
            <DoulaTextInput
              name="insuranceOccurenceAmount"
              required
              label={`${orderedInputNameToLabel["insuranceOccurenceAmount"]}`}
              hint={"Minimum should be $1,000,000"}
              numericOnly
              inputPrefix="$"
              register={register}
              errors={errors}
              inputMode="numeric"
              registerOptions={{
                required: `${orderedInputNameToLabel["insuranceOccurenceAmount"]} is required`,
                min: {
                  value: 1000000,
                  message:
                    "Your coverage is not enough. You need $1,000,000 minimum coverage per occurrence to qualify.",
                },
              }}
            />
            <DoulaTextInput
              name="insuranceAggregateAmount"
              required
              label={`${orderedInputNameToLabel["insuranceAggregateAmount"]}`}
              hint={"Minimum should be $3,000,000"}
              numericOnly
              inputPrefix="$"
              register={register}
              errors={errors}
              inputMode="numeric"
              registerOptions={{
                required: `${orderedInputNameToLabel["insuranceAggregateAmount"]} is required`,
                min: {
                  value: 3000000,
                  message:
                    "Your coverage is not enough. You need a minimum aggregate coverage of $3,000,000 to qualify.",
                },
              }}
            />
          </div>
        </div>
        <div className="form-explainer desktop:grid-col-4">
          <CoverageAmountExplainer />
        </div>
      </div>
      <HorizontalDivider />
      <FormProgressButtons />
    </DoulaForm>
  );
};

export default InsuranceStep1;
