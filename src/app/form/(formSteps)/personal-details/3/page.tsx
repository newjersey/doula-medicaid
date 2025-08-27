"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import NpiExplainer from "@/app/form/(formSteps)/personal-details/3/NpiExplainer";
import type { PersonalDetails3Data } from "@/app/form/(formSteps)/personal-details/PersonalDetailsData";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { getDefaultValue } from "@form/_utils/sessionStorage";
import { Label, TextInput, TextInputMask } from "@trussworks/react-uswds";
import { useForm } from "react-hook-form";

const orderedInputNameToLabel: { [key in keyof PersonalDetails3Data]: string } = {
  npiNumber: "National Provider Identifier (NPI)",
  upinNumber: "UPIN number",
  medicareProviderId: "Medicare provider ID",
};

const PersonalDetailsStep3 = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<PersonalDetails3Data>({
    defaultValues: {
      npiNumber: getDefaultValue("npiNumber") ?? "",
      upinNumber: getDefaultValue("upinNumber") ?? "",
      medicareProviderId: getDefaultValue("medicareProviderId") ?? "",
    },
  });

  const npiNumber = watch("npiNumber");

  return (
    <DoulaForm<PersonalDetails3Data>
      orderedInputNameToLabel={orderedInputNameToLabel}
      errors={errors}
      setFocus={setFocus}
      handleSubmit={handleSubmit}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md">Doula provider identification</h2>
          <p>
            To be an NJ FamilyCare doula, your NPI must be Type 1 and linked to the doula taxonomy
            code 374J00000X.
          </p>
          <Label htmlFor="npiNumber" requiredMarker>
            {orderedInputNameToLabel["npiNumber"]}
          </Label>
          <div id="npiNumberHint" className="usa-hint">
            Enter your 10-digit NPI number.
          </div>
          <TextInputMask
            id="npiNumber"
            type="text"
            value={npiNumber ?? ""}
            mask="__________"
            pattern="\d{10}"
            required
            aria-invalid={errors.npiNumber ? "true" : "false"}
            className={errors.npiNumber ? "usa-input--error" : ""}
            aria-describedby={`${errors.npiNumber ? "npiNumberErrorMessage npiNumberErrorAlert" : ""} npiNumberHint`}
            {...register("npiNumber", {
              required: true,
              minLength: {
                value: 10,
                message: `${orderedInputNameToLabel["npiNumber"]} must have 10 digits`,
              },
            })}
          />
          {errors.npiNumber && (
            <span id="npiNumberErrorMessage" className="usa-error-message">
              {errors.npiNumber?.type === "required" ? (
                <span>
                  To be an NJ FamilyCare doula, your need a NPI. You can get yours via{" "}
                  <a href="https://nppes.cms.hhs.gov/" target="_blank" rel="noopener">
                    https://nppes.cms.hhs.gov/
                  </a>
                  .
                </span>
              ) : (
                errors.npiNumber.message
              )}
            </span>
          )}
        </div>
        <div className="form-explainer desktop:grid-col-4">
          <NpiExplainer />
        </div>
      </div>
      <HorizontalDivider />
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md">Other identification</h2>
          <p>Leave non-applicable items blank; it won&apos;t affect your application.</p>
          <Label htmlFor="upinNumber">{orderedInputNameToLabel["upinNumber"]} (optional)</Label>
          <div id="upinNumberHint" className="usa-hint">
            Most doulas don&apos;t have this.
          </div>
          <TextInput
            type="text"
            id="upinNumber"
            inputMode="text"
            aria-describedby="upinNumberHint"
            {...register("upinNumber")}
          />
          <Label htmlFor="medicareProviderId">
            {orderedInputNameToLabel["medicareProviderId"]} (optional)
          </Label>
          <div id="medicareProviderIdHint" className="usa-hint">
            Most doulas don&apos;t have this.
          </div>
          <TextInput
            type="text"
            id="medicareProviderId"
            inputMode="text"
            aria-describedby="medicareProviderIdHint"
            {...register("medicareProviderId")}
          />
        </div>
      </div>
      <FormProgressButtons />
    </DoulaForm>
  );
};

export default PersonalDetailsStep3;
