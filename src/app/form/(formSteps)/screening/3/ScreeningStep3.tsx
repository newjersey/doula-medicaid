import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import DoulaYesNoRadio from "@/app/form/(formSteps)/components/DoulaYesNoRadio";
import { unsupportedErrorMessage } from "@/app/form/(formSteps)/screening/_utils/unsupportedErrorMessage";
import type { Screening3Data } from "@/app/form/(formSteps)/screening/ScreeningData";
import { getBooleanString } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useForm } from "react-hook-form";

const showErrorSummary = false;
const ScreeningStep3 = () => {
  const { dataStore } = useDataStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Screening3Data>({
    defaultValues: {
      haveOtherBusinessOwnerNextYear: getBooleanString(dataStore, "haveOtherBusinessOwnerNextYear"),
      hadDhmasBusiness: getBooleanString(dataStore, "hadDhmasBusiness"),
    },
  });
  const haveOtherBusinessOwnerNextYear = watch("haveOtherBusinessOwnerNextYear");
  const hadDhmasBusiness = watch("hadDhmasBusiness");
  return (
    <DoulaForm<Screening3Data>
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
              name="haveOtherBusinessOwnerNextYear"
              value={haveOtherBusinessOwnerNextYear}
              label="Do you anticipate anyone else having a percentage of your business in the next year?"
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
              name="hadDhmasBusiness"
              value={hadDhmasBusiness}
              label="In the last 5 years, have you owned any percentage of companies that do business with the Division of Medical Assistance and Health Services?"
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

export default ScreeningStep3;
