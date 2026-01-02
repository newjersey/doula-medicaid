import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { type Business4Data } from "@/app/form/(formSteps)/business/BusinessData";
import { DoulaDateInput } from "@/app/form/(formSteps)/components/DoulaDateInput";
import DoulaYesNoRadio from "@/app/form/(formSteps)/components/DoulaYesNoRadio";
import { getBooleanString, getDefaultValue } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useForm } from "react-hook-form";

const manualFocusOrder: Array<keyof Business4Data> = [
  "hasFiledBankruptcy",
  "pastBankruptcyMonth",
  "pastBankruptcyDay",
  "pastBankruptcyYear",
  "mightFileBankruptcy",
  "futureBankruptcyMonth",
  "futureBankruptcyDay",
  "futureBankruptcyYear",
];

const showErrorSummary = true;
const BusinessStep4 = () => {
  const { dataStore } = useDataStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<Business4Data>({
    defaultValues: {
      hasFiledBankruptcy: getBooleanString(dataStore, "hasFiledBankruptcy"),
      pastBankruptcyMonth: getDefaultValue(dataStore, "pastBankruptcyMonth") ?? "",
      pastBankruptcyDay: getDefaultValue(dataStore, "pastBankruptcyDay") ?? "",
      pastBankruptcyYear: getDefaultValue(dataStore, "pastBankruptcyYear") ?? "",
      mightFileBankruptcy: getBooleanString(dataStore, "mightFileBankruptcy"),
      futureBankruptcyMonth: getDefaultValue(dataStore, "futureBankruptcyMonth") ?? "",
      futureBankruptcyDay: getDefaultValue(dataStore, "futureBankruptcyDay") ?? "",
      futureBankruptcyYear: getDefaultValue(dataStore, "futureBankruptcyYear") ?? "",
    },
    shouldFocusError: !showErrorSummary,
  });
  const hasFiledBankruptcy = watch("hasFiledBankruptcy");
  const mightFileBankruptcy = watch("mightFileBankruptcy");

  const currentYear: number = new Date().getFullYear();

  return (
    <DoulaForm<Business4Data>
      errors={errors}
      handleSubmit={handleSubmit}
      setFocus={setFocus}
      manualFocusOrder={manualFocusOrder}
      showErrorSummary={showErrorSummary}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md margin-bottom-0">
            Mark Yes if these apply to your business, otherwise mark No.
          </h2>
          <DoulaYesNoRadio
            name="hasFiledBankruptcy"
            value={hasFiledBankruptcy}
            label="Have you filed for bankruptcy in the past 7 years?"
            required
            errors={errors}
            register={register}
          />
          {hasFiledBankruptcy === "true" && (
            <DoulaDateInput
              name="pastBankruptcy"
              label="When did you file for bankruptcy?"
              hint={`For example: January 1 ${currentYear - 2}`}
              monthName="pastBankruptcyMonth"
              dayName="pastBankruptcyDay"
              yearName="pastBankruptcyYear"
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
            name="mightFileBankruptcy"
            value={mightFileBankruptcy}
            label="Is there a possibility that you will file for bankruptcy in the next year?"
            required
            errors={errors}
            register={register}
          />
          {mightFileBankruptcy === "true" && (
            <DoulaDateInput
              name="futureBankruptcy"
              label="When will you file for bankruptcy?"
              hint={`For example: January 1 ${currentYear + 1}`}
              monthName="futureBankruptcyMonth"
              dayName="futureBankruptcyDay"
              yearName="futureBankruptcyYear"
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

export default BusinessStep4;
