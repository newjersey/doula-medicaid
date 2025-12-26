"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import DoulaYesNoRadio from "@/app/form/(formSteps)/components/DoulaYesNoRadio";
import SoleProprietorExplainer from "@/app/form/(formSteps)/components/SoleProprietorExplainer";
import type { Screening1Data } from "@/app/form/(formSteps)/screening/ScreeningData";
import { getBooleanString } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useForm } from "react-hook-form";

const orderedInputNameToLabel = {
  isSoleProprietor:
    "Do you manage your business as an individual doula operating as a Sole Proprietor?",
};

const showErrorSummary = false;
const ScreeningStep1 = () => {
  const { dataStore } = useDataStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Screening1Data>({
    defaultValues: { isSoleProprietor: getBooleanString(dataStore, "isSoleProprietor") },
  });
  const isSoleProprietor = watch("isSoleProprietor");
  return (
    <DoulaForm<Screening1Data>
      errors={errors}
      handleSubmit={handleSubmit}
      showErrorSummary={showErrorSummary}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md">This beta site is currently for Sole Proprietors</h2>
          <p className="usa-hint">
            If you have an LLC or another business type, use the standard{" "}
            <a
              href="https://www.njmmis.com/providerEnrollment.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="usa-link usa-link--external"
            >
              Medicaid Fee-for-Service application
            </a>
            .
          </p>
          <DoulaYesNoRadio
            name="isSoleProprietor"
            value={isSoleProprietor}
            label={
              <div>
                <p>{orderedInputNameToLabel["isSoleProprietor"]}</p>
                <p className="usa-hint">Most NJ FamilyCare doulas operate as Sole Proprietor.</p>
              </div>
            }
            required
            invalidOption={{
              label: "No",
              message: (
                <span>
                  Currently this site is only for Sole Proprietors. Please use the{" "}
                  <a
                    href="https://www.njmmis.com/providerEnrollment.aspx "
                    target="_blank"
                    rel="noopener noreferrer"
                    className="usa-link usa-link--external"
                  >
                    standard FFS application
                  </a>
                  .
                </span>
              ),
            }}
            register={register}
            errors={errors}
          />
        </div>
        <div className="form-explainer desktop:grid-col-4">
          <SoleProprietorExplainer />
        </div>
      </div>
      <HorizontalDivider />
      <FormProgressButtons />
    </DoulaForm>
  );
};

export default ScreeningStep1;
