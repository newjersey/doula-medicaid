"use client";
import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import DoulaTextareaCharacterCount from "@/app/form/(formSteps)/components/DoulaTextareaCharacterCount";
import DoulaYesNoRadio from "@/app/form/(formSteps)/components/DoulaYesNoRadio";
import { type Legal1Data } from "@/app/form/(formSteps)/legal/LegalData";
import { getDefaultBoolean, getDefaultValue } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useForm } from "react-hook-form";

const manualFocusOrder: Array<keyof Legal1Data & string> = [
  "isEmployedByNj",
  "employedByNjExplanation",
  "hasProvidedMedicaidServices",
  "medicaidServicesExplanation",
];

const showErrorSummary = false;
const manuallySetErrorFocus = true;
const LegalStep1 = () => {
  const { dataStore } = useDataStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<Legal1Data>({
    defaultValues: {
      isEmployedByNj: getDefaultBoolean(dataStore, "isEmployedByNj"),
      employedByNjExplanation: getDefaultValue(dataStore, "employedByNjExplanation") ?? "",
      hasProvidedMedicaidServices: getDefaultBoolean(dataStore, "hasProvidedMedicaidServices"),
      medicaidServicesExplanation: getDefaultValue(dataStore, "medicaidServicesExplanation") ?? "",
    },
    shouldFocusError: !manuallySetErrorFocus,
  });

  const isEmployedByNj = watch("isEmployedByNj");
  const hasProvidedMedicaidServices = watch("hasProvidedMedicaidServices");

  return (
    <DoulaForm<Legal1Data>
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
            name="isEmployedByNj"
            value={isEmployedByNj}
            label="Are you employed by the State of New Jersey?"
            required
            errors={errors}
            register={register}
          />
          {isEmployedByNj === "true" && (
            <DoulaTextareaCharacterCount
              name="employedByNjExplanation"
              label="In a few words please explain your role with the State of New Jersey"
              className="tablet:grid-col-6"
              errors={errors}
              register={register}
              maxLength={68}
              additionalRegisterOptions={{
                required: "This question is required",
              }}
              required
            />
          )}
        </div>
      </div>
      <HorizontalDivider />
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <DoulaYesNoRadio
            name="hasProvidedMedicaidServices"
            value={hasProvidedMedicaidServices}
            label="Have you previously been approved to provide services under any state's Medicaid program, such as NJ FamilyCare?"
            required
            errors={errors}
            register={register}
          />
          {hasProvidedMedicaidServices === "true" && (
            <DoulaTextareaCharacterCount
              name="medicaidServicesExplanation"
              label="What services did you provide and what is your current provider status? Please explain in a few words."
              className="tablet:grid-col-6"
              errors={errors}
              register={register}
              maxLength={68}
              additionalRegisterOptions={{
                required: "This question is required",
              }}
              required
            />
          )}
        </div>
      </div>
      <HorizontalDivider />
      <FormProgressButtons />
    </DoulaForm>
  );
};

export default LegalStep1;
