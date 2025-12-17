"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { type Business2Data } from "@/app/form/(formSteps)/business/BusinessData";
import DoulaYesNoRadio from "@/app/form/(formSteps)/components/DoulaYesNoRadio";
import { getDefaultBoolean } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useForm } from "react-hook-form";

const showErrorSummary = false;
const BusinessStep2 = () => {
  const { dataStore } = useDataStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Business2Data>({
    defaultValues: {
      hasUncollectedDebt: getDefaultBoolean(dataStore, "hasUncollectedDebt"),
      isSubjectToPaymentSuspension: getDefaultBoolean(dataStore, "isSubjectToPaymentSuspension"),
    },
    shouldFocusError: !showErrorSummary,
  });
  const hasUncollectedDebt = watch("hasUncollectedDebt");
  const isSubjectToPaymentSuspension = watch("isSubjectToPaymentSuspension");

  return (
    <DoulaForm<Business2Data>
      errors={errors}
      handleSubmit={handleSubmit}
      showErrorSummary={showErrorSummary}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md">
            Mark Yes if these apply to your business, otherwise mark No.
          </h2>
          <p className="usa-hint">
            Most individual doulas with a Sole Proprietorship business answer “No” to these
            questions.
          </p>
          <DoulaYesNoRadio
            name="hasUncollectedDebt"
            value={hasUncollectedDebt}
            label="Do you have any uncollected debt to Medicare, Medicaid/NJ FamilyCare, or CHIP (Children's Health Insurance Program)?"
            required
            register={register}
            errors={errors}
          />
        </div>
      </div>
      <HorizontalDivider />
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <DoulaYesNoRadio
            name="isSubjectToPaymentSuspension"
            value={isSubjectToPaymentSuspension}
            label="Have you ever been subject to a payment suspension under a federal health care program?"
            required
            register={register}
            errors={errors}
          />
        </div>
      </div>
      <HorizontalDivider />
      <FormProgressButtons />
    </DoulaForm>
  );
};

export default BusinessStep2;
