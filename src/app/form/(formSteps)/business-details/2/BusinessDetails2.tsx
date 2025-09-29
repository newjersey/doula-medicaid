"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import EinExplainer from "@/app/form/(formSteps)/business-details/2/EinExplainer";
import type { BusinessDetails2Data } from "@/app/form/(formSteps)/business-details/BusinessDetailsData";
import DoulaTextInputMask from "@/app/form/(formSteps)/components/DoulaTextInputMask";
import DoulaYesNoRadio from "@/app/form/(formSteps)/components/DoulaYesNoRadio";
import { getDefaultBoolean, getDefaultValue } from "@/app/form/_utils/dataStore";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useForm } from "react-hook-form";

const mayHaveThreeOrMoreErrors = false;
const BusinessDetails2 = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BusinessDetails2Data>({
    defaultValues: {
      hasEin: getDefaultBoolean("hasEin") ?? "",
      ein: getDefaultValue("ein") ?? "",
    },
    shouldFocusError: !mayHaveThreeOrMoreErrors,
  });
  const hasEin = watch("hasEin");
  const ein = watch("ein");

  return (
    <DoulaForm<BusinessDetails2Data>
      errors={errors}
      handleSubmit={handleSubmit}
      mayHaveThreeOrMoreErrors={mayHaveThreeOrMoreErrors}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md">Tax ID</h2>
          <DoulaYesNoRadio
            name="hasEin"
            value={hasEin}
            label="Do you have an Employee Identification Number (EIN)?"
            required
            register={register}
            errors={errors}
          />
          {hasEin === "true" && (
            <DoulaTextInputMask
              name="ein"
              label="EIN"
              hint="The EIN is a 9-digit number."
              inputMode="numeric"
              value={ein ?? ""}
              mask="__-_______"
              pattern="\d{2}-\d{7}"
              required
              errors={errors}
              register={register}
              registerOptions={{
                required: `EIN is required`,
                pattern: {
                  value: /\d{2}-\d{7}/,
                  message: "Entered value does not match the EIN format",
                },
              }}
            />
          )}
        </div>
        <div className="form-explainer desktop:grid-col-4">
          <EinExplainer />
        </div>
      </div>
      <HorizontalDivider />
      <FormProgressButtons />
    </DoulaForm>
  );
};

export default BusinessDetails2;
