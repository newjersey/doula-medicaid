"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { type BusinessDetails4Data } from "@/app/form/(formSteps)/business-details/BusinessDetailsData";
import { DoulaDateInput } from "@/app/form/(formSteps)/components/DoulaDateInput";
import DoulaYesNoRadio from "@/app/form/(formSteps)/components/DoulaYesNoRadio";
import { getDefaultBoolean, getDefaultValue } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useForm } from "react-hook-form";

const orderedInputNames: Array<keyof BusinessDetails4Data> = [
  "hasFiledForBankruptcyPast7Years",
  "past7YearsBankruptcyMonth",
  "past7YearsBankruptcyDay",
  "past7YearsBankruptcyYear",
  "mightFileForBankruptcyNextYear",
  "nextYearBankruptcyMonth",
  "nextYearBankruptcyDay",
  "nextYearBankruptcyYear",
];

const mayHaveThreeOrMoreErrors = true;
const BusinessDetailsStep4 = () => {
  const { dataStore } = useDataStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<BusinessDetails4Data>({
    defaultValues: {
      hasFiledForBankruptcyPast7Years: getDefaultBoolean(
        dataStore,
        "hasFiledForBankruptcyPast7Years",
      ),
      past7YearsBankruptcyMonth: getDefaultValue(dataStore, "past7YearsBankruptcyMonth") ?? "",
      past7YearsBankruptcyDay: getDefaultValue(dataStore, "past7YearsBankruptcyDay") ?? "",
      past7YearsBankruptcyYear: getDefaultValue(dataStore, "past7YearsBankruptcyYear") ?? "",
      mightFileForBankruptcyNextYear: getDefaultBoolean(
        dataStore,
        "mightFileForBankruptcyNextYear",
      ),
      nextYearBankruptcyMonth: getDefaultValue(dataStore, "nextYearBankruptcyMonth") ?? "",
      nextYearBankruptcyDay: getDefaultValue(dataStore, "nextYearBankruptcyDay") ?? "",
      nextYearBankruptcyYear: getDefaultValue(dataStore, "nextYearBankruptcyYear") ?? "",
    },
    shouldFocusError: !mayHaveThreeOrMoreErrors,
  });
  const hasFiledForBankruptcyPast7Years = watch("hasFiledForBankruptcyPast7Years");
  const mightFileForBankruptcyNextYear = watch("mightFileForBankruptcyNextYear");

  return (
    <DoulaForm<BusinessDetails4Data>
      orderedInputNames={orderedInputNames}
      errors={errors}
      handleSubmit={handleSubmit}
      setFocus={setFocus}
      mayHaveThreeOrMoreErrors={mayHaveThreeOrMoreErrors}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md margin-bottom-0">
            Mark Yes if these apply to your business, otherwise mark No.
          </h2>
          <DoulaYesNoRadio
            name="hasFiledForBankruptcyPast7Years"
            value={hasFiledForBankruptcyPast7Years}
            label="Have you filed for bankruptcy in the past 7 years?"
            required
            register={register}
            errors={errors}
          />
          {hasFiledForBankruptcyPast7Years === "true" && (
            <DoulaDateInput
              name="past7YearsBankruptcy"
              label="When did you file for bankruptcy?"
              hint={`For example: January 1 ${new Date().getFullYear() - 2}`}
              monthName="past7YearsBankruptcyMonth"
              dayName="past7YearsBankruptcyDay"
              yearName="past7YearsBankruptcyYear"
              errorLabelPrefix="Past bankruptcy"
              errors={errors}
              register={register}
            />
          )}
        </div>
      </div>
      <HorizontalDivider />
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <DoulaYesNoRadio
            name="mightFileForBankruptcyNextYear"
            value={mightFileForBankruptcyNextYear}
            label="Is there a possibility that you will file for bankruptcy in the next year?"
            required
            register={register}
            errors={errors}
          />
          {mightFileForBankruptcyNextYear === "true" && (
            <DoulaDateInput
              name="nextYearBankruptcy"
              label="When will you file for bankruptcy? "
              hint={`For example: January 1 ${new Date().getFullYear() + 1}`}
              monthName="nextYearBankruptcyMonth"
              dayName="nextYearBankruptcyDay"
              yearName="nextYearBankruptcyYear"
              errorLabelPrefix="Future bankruptcy"
              errors={errors}
              register={register}
            />
          )}
        </div>
      </div>
      <HorizontalDivider />
      <FormProgressButtons />
    </DoulaForm>
  );
};

export default BusinessDetailsStep4;
