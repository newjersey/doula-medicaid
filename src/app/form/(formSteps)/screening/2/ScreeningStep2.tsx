"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import DoulaYesNoRadio from "@/app/form/(formSteps)/components/DoulaYesNoRadio";
import { unsupportedErrorMessage } from "@/app/form/(formSteps)/screening/_utils/unsupportedErrorMessage";
import type { Screening2Data } from "@/app/form/(formSteps)/screening/ScreeningData";
import { getBooleanString } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useForm } from "react-hook-form";

const showErrorSummary = false;
const ScreeningStep2 = () => {
  const { dataStore } = useDataStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Screening2Data>({
    defaultValues: {
      everHadEmployees: getBooleanString(dataStore, "everHadEmployees"),
      everHadOtherBusinessOwner: getBooleanString(dataStore, "everHadOtherBusinessOwner"),
    },
  });
  const everHadEmployees = watch("everHadEmployees");
  const everHadOtherBusinessOwner = watch("everHadOtherBusinessOwner");
  return (
    <DoulaForm<Screening2Data>
      errors={errors}
      handleSubmit={handleSubmit}
      showErrorSummary={showErrorSummary}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <div>
            <h2 className="font-heading-md">About your business</h2>
            <p className="usa-hint">
              Most individual doulas with a Sole Proprietorship business answer “No” to these
              questions.
            </p>
            <DoulaYesNoRadio
              name="everHadEmployees"
              value={everHadEmployees}
              label="Have you ever had employees in your doula business?"
              required
              invalidOption={{
                label: "Yes",
                message: unsupportedErrorMessage,
              }}
              register={register}
              errors={errors}
            />
          </div>

          <div className="margin-top-5">
            <DoulaYesNoRadio
              name="everHadOtherBusinessOwner"
              value={everHadOtherBusinessOwner}
              label="Did anyone other than you ever own a percentage of your business?"
              required
              invalidOption={{
                label: "Yes",
                message: unsupportedErrorMessage,
              }}
              register={register}
              errors={errors}
            />
          </div>
        </div>
      </div>
      <HorizontalDivider />
      <FormProgressButtons />
    </DoulaForm>
  );
};

export default ScreeningStep2;
