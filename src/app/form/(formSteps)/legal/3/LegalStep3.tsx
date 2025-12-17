"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import DoulaTextareaCharacterCount from "@/app/form/(formSteps)/components/DoulaTextareaCharacterCount";
import DoulaYesNoRadio from "@/app/form/(formSteps)/components/DoulaYesNoRadio";
import { type Legal3Data } from "@/app/form/(formSteps)/legal/LegalData";
import { getDefaultBoolean, getDefaultValue } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useForm } from "react-hook-form";

const manualFocusOrder: Array<keyof Legal3Data> = [
  "hasDisqualification",
  "disqualificationExplanation",
  "hasCompanyInvolvement",
  "companyInvolvementExplanation",
];

const showErrorSummary = false;
const manuallySetErrorFocus = true;

const LegalStep3 = () => {
  const { dataStore } = useDataStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<Legal3Data>({
    defaultValues: {
      hasDisqualification: getDefaultBoolean(dataStore, "hasDisqualification"),
      disqualificationExplanation: getDefaultValue(dataStore, "disqualificationExplanation") ?? "",
      hasCompanyInvolvement: getDefaultBoolean(dataStore, "hasCompanyInvolvement"),
      companyInvolvementExplanation:
        getDefaultValue(dataStore, "companyInvolvementExplanation") ?? "",
    },
    shouldFocusError: !manuallySetErrorFocus,
  });
  const hasDisqualification = watch("hasDisqualification");
  const hasCompanyInvolvement = watch("hasCompanyInvolvement");

  return (
    <DoulaForm<Legal3Data>
      errors={errors}
      handleSubmit={handleSubmit}
      setFocus={setFocus}
      manualFocusOrder={manualFocusOrder}
      showErrorSummary={showErrorSummary}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h3 className="font-heading-md margin-bottom-0">Medicaid statements</h3>
          <p className="usa-hint">
            To meet legal requirements, we ask these questions. Answering &quot;Yes&quot; will not
            automatically disqualify you.
          </p>
          <DoulaYesNoRadio
            name="hasDisqualification"
            value={hasDisqualification}
            label="Have you ever been barred, disqualified, or faced any penalties in connection with Medicaid, Medicare, or any other government-funded or private health program?"
            required
            register={register}
            errors={errors}
          />
          {hasDisqualification === "true" && (
            <div className="maxw-mobile-lg">
              <DoulaTextareaCharacterCount
                name="disqualificationExplanation"
                label="In a few words, explain why you were barred, disqualified, or given penalties and the current status of your situation."
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
            name="hasCompanyInvolvement"
            value={hasCompanyInvolvement}
            label="Does anyone on this application, or an immediate family member, have any involvement with a company that provides services for Medicaid, Medicare, or other health programs?"
            required
            register={register}
            errors={errors}
          />
          {hasCompanyInvolvement === "true" && (
            <div className="maxw-mobile-lg">
              <DoulaTextareaCharacterCount
                name="companyInvolvementExplanation"
                label="In a few words, explain your involvement with the company."
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

export default LegalStep3;
