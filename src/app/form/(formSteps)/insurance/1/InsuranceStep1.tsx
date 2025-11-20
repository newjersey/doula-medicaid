"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { DoulaDateInput } from "@/app/form/(formSteps)/components/DoulaDateInput";
import DoulaTextInput from "@/app/form/(formSteps)/components/DoulaTextInput";
import CoverageAmountExplainer from "@/app/form/(formSteps)/insurance/1/CoverageAmountExplainer";
import InsuranceCoverageExplainer from "@/app/form/(formSteps)/insurance/1/InsuranceCoverageExplainer";
import { type Insurance1Data } from "@/app/form/(formSteps)/insurance/InsuranceData";
import { getDefaultValue } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useForm } from "react-hook-form";

const inputNameToLabel = {
  insuranceOccurenceAmount: "Amount per occurrence",
  insuranceAggregateAmount: "Amount per aggregate",
} as const;

const orderedInputNames: Array<keyof Insurance1Data> = [
  "insuranceStartDateMonth",
  "insuranceStartDateDay",
  "insuranceStartDateYear",
  "insuranceEndDateMonth",
  "insuranceEndDateDay",
  "insuranceEndDateYear",
  "insuranceOccurenceAmount",
  "insuranceAggregateAmount",
];

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

  const currentYear: number = new Date().getFullYear();

  return (
    <DoulaForm<Insurance1Data>
      orderedInputNames={orderedInputNames}
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
          <h2 className="font-heading-md margin-bottom-0">Your insurance coverage</h2>
          <DoulaDateInput
            name="insuranceStartDate"
            label="Start date"
            hint={`For example: April 28 ${currentYear - 1}`}
            monthName="insuranceStartDateMonth"
            dayName="insuranceStartDateDay"
            yearName="insuranceStartDateYear"
            errorLabelPrefix="Start"
            errors={errors}
            register={register}
          />
          <DoulaDateInput
            name="insuranceEndDate"
            label="End date"
            hint={`For example: April 28 ${currentYear + 3}`}
            monthName="insuranceEndDateMonth"
            dayName="insuranceEndDateDay"
            yearName="insuranceEndDateYear"
            errorLabelPrefix="End"
            errors={errors}
            register={register}
          />
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
              label={`${inputNameToLabel["insuranceOccurenceAmount"]}`}
              hint={"Minimum should be $1,000,000"}
              numericOnly
              inputPrefix="$"
              register={register}
              errors={errors}
              inputMode="numeric"
              registerOptions={{
                required: `${inputNameToLabel["insuranceOccurenceAmount"]} is required`,
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
              label={`${inputNameToLabel["insuranceAggregateAmount"]}`}
              hint={"Minimum should be $3,000,000"}
              numericOnly
              inputPrefix="$"
              register={register}
              errors={errors}
              inputMode="numeric"
              registerOptions={{
                required: `${inputNameToLabel["insuranceAggregateAmount"]} is required`,
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
