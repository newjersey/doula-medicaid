import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import DoulaTextareaCharacterCount from "@/app/form/(formSteps)/components/DoulaTextareaCharacterCount";
import DoulaYesNoRadio from "@/app/form/(formSteps)/components/DoulaYesNoRadio";
import { type Legal2Data } from "@/app/form/(formSteps)/legal/LegalData";
import { getBooleanString, getDefaultValue } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useForm } from "react-hook-form";

const manualFocusOrder: Array<keyof Legal2Data> = [
  "hasCrimeCharge",
  "crimeChargeExplanation",
  "hadLicenseSuspended",
  "licenseSuspendedExplanation",
];

const showErrorSummary = false;
const manuallySetErrorFocus = true;

const LegalStep2 = () => {
  const { dataStore } = useDataStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<Legal2Data>({
    defaultValues: {
      hasCrimeCharge: getBooleanString(dataStore, "hasCrimeCharge"),
      crimeChargeExplanation: getDefaultValue(dataStore, "crimeChargeExplanation") ?? "",
      hadLicenseSuspended: getBooleanString(dataStore, "hadLicenseSuspended"),
      licenseSuspendedExplanation: getDefaultValue(dataStore, "licenseSuspendedExplanation") ?? "",
    },
    shouldFocusError: !manuallySetErrorFocus,
  });
  const hasCrimeCharge = watch("hasCrimeCharge");
  const hadLicenseSuspended = watch("hadLicenseSuspended");

  return (
    <DoulaForm<Legal2Data>
      errors={errors}
      handleSubmit={handleSubmit}
      setFocus={setFocus}
      manualFocusOrder={manualFocusOrder}
      showErrorSummary={showErrorSummary}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md margin-bottom-0">Medicaid statements</h2>
          <p className="usa-hint">
            To meet legal requirements, we ask these questions. Answering &quot;Yes&quot; will not
            automatically disqualify you.
          </p>
          <DoulaYesNoRadio
            name="hasCrimeCharge"
            value={hasCrimeCharge}
            label="Have you ever been indicted or charged with a crime or a disorderly persons offense anywhere?"
            required
            errors={errors}
            register={register}
          />
          {hasCrimeCharge === "true" && (
            <div className="maxw-mobile-lg">
              <DoulaTextareaCharacterCount
                name="crimeChargeExplanation"
                label="In a few words, please explain the charge or offense."
                required
                inputClassName="height-10"
                maxLength={68}
                errors={errors}
                register={register}
              />
            </div>
          )}
        </div>
      </div>
      <HorizontalDivider />
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <DoulaYesNoRadio
            name="hadLicenseSuspended"
            value={hadLicenseSuspended}
            label="Have you ever had a professional license suspended or revoked, or faced disciplinary action or fines from any professional licensing authority?"
            required
            errors={errors}
            register={register}
          />
          {hadLicenseSuspended === "true" && (
            <div className="maxw-mobile-lg">
              <DoulaTextareaCharacterCount
                name="licenseSuspendedExplanation"
                label="In a few words, please explain the suspension, revocation, or disciplinary action."
                required
                inputClassName="height-10"
                maxLength={68}
                errors={errors}
                register={register}
              />
            </div>
          )}
        </div>
      </div>
      <HorizontalDivider />
      <FormProgressButtons />
    </DoulaForm>
  );
};

export default LegalStep2;
