"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { type BusinessDetails4Data } from "@/app/form/(formSteps)/business-details/BusinessDetailsData";
import DoulaYesNoRadio from "@/app/form/(formSteps)/components/DoulaYesNoRadio";
import { getDefaultBoolean } from "@/app/form/_utils/dataStore";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useForm } from "react-hook-form";

const mayHaveThreeOrMoreErrors = false;
const BusinessDetailsStep4 = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BusinessDetails4Data>({
    defaultValues: {
      hasBeenExcludedFromMedicaid: getDefaultBoolean("hasBeenExcludedFromMedicaid"),
      hasBeenSuspendedFromMedicaid: getDefaultBoolean("hasBeenSuspendedFromMedicaid"),
    },
    shouldFocusError: !mayHaveThreeOrMoreErrors,
  });
  const hasBeenExcludedFromMedicaid = watch("hasBeenExcludedFromMedicaid");
  const hasBeenSuspendedFromMedicaid = watch("hasBeenSuspendedFromMedicaid");

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
              name="hasBeenExcludedFromMedicaid"
              value={hasBeenExcludedFromMedicaid}
              label="Have you ever been excluded or suspended by OIG (Office of Inspector General) from participation in Medicare, Medicaid/NJ FamilyCare, or CHIP?"
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
            name="hasBeenSuspendedFromMedicaid"
            value={hasBeenSuspendedFromMedicaid}
            label="Have you ever had Medicare, Medicaid/NJ FamilyCare, or CHIP enrollment/participation suspended, denied, revoked, or terminated?"
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

export default BusinessDetailsStep4;
