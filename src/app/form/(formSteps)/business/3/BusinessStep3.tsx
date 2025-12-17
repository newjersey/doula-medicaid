"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { type Business3Data } from "@/app/form/(formSteps)/business/BusinessData";
import DoulaYesNoRadio from "@/app/form/(formSteps)/components/DoulaYesNoRadio";
import { getDefaultBoolean } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useForm } from "react-hook-form";

const showErrorSummary = false;
const BusinessStep3 = () => {
  const { dataStore } = useDataStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Business3Data>({
    defaultValues: {
      hasBeenExcludedFromMedicaid: getDefaultBoolean(dataStore, "hasBeenExcludedFromMedicaid"),
      hasBeenSuspendedFromMedicaid: getDefaultBoolean(dataStore, "hasBeenSuspendedFromMedicaid"),
    },
    shouldFocusError: !showErrorSummary,
  });
  const hasBeenExcludedFromMedicaid = watch("hasBeenExcludedFromMedicaid");
  const hasBeenSuspendedFromMedicaid = watch("hasBeenSuspendedFromMedicaid");

  return (
    <DoulaForm<Business3Data>
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
            name="hasBeenExcludedFromMedicaid"
            value={hasBeenExcludedFromMedicaid}
            label="Have you ever been excluded or suspended by OIG (Office of Inspector General) from participation in Medicare, Medicaid/NJ FamilyCare, or CHIP?"
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

export default BusinessStep3;
