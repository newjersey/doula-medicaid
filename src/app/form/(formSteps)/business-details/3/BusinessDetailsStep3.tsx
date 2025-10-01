"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { type BusinessDetails3Data } from "@/app/form/(formSteps)/business-details/BusinessDetailsData";
import DoulaYesNoRadio from "@/app/form/(formSteps)/components/DoulaYesNoRadio";
import { getDefaultBoolean } from "@/app/form/_utils/dataStore";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useForm } from "react-hook-form";

const mayHaveThreeOrMoreErrors = false;
const BusinessDetailsStep3 = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BusinessDetails3Data>({
    defaultValues: {
      hasUncollectedDebt: getDefaultBoolean("hasUncollectedDebt"),
      isSubjectToPaymentSuspension: getDefaultBoolean("isSubjectToPaymentSuspension"),
    },
    shouldFocusError: !mayHaveThreeOrMoreErrors,
  });
  const hasUncollectedDebt = watch("hasUncollectedDebt");
  const isSubjectToPaymentSuspension = watch("isSubjectToPaymentSuspension");

  return (
    <DoulaForm<object>
      errors={errors}
      handleSubmit={handleSubmit}
      mayHaveThreeOrMoreErrors={mayHaveThreeOrMoreErrors}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <div>
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

export default BusinessDetailsStep3;
