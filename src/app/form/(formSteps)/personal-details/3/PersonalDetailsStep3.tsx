"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import DoulaTextInput from "@/app/form/(formSteps)/components/DoulaTextInput";
import DoulaTextInputMask from "@/app/form/(formSteps)/components/DoulaTextInputMask";
import NpiExplainer from "@/app/form/(formSteps)/personal-details/3/NpiExplainer";
import type { PersonalDetails3Data } from "@/app/form/(formSteps)/personal-details/PersonalDetailsData";
import { getDefaultValue } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useForm } from "react-hook-form";

const orderedInputNameToLabel: { [key in keyof PersonalDetails3Data]: string } = {
  npiNumber: "National Provider Identifier (NPI)",
  upinNumber: "UPIN number",
  medicareProviderId: "Medicare provider ID",
};

const mayHaveThreeOrMoreErrors = false;
const PersonalDetailsStep3 = () => {
  const { dataStore } = useDataStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PersonalDetails3Data>({
    defaultValues: {
      npiNumber: getDefaultValue(dataStore, "npiNumber") ?? "",
      upinNumber: getDefaultValue(dataStore, "upinNumber") ?? "",
      medicareProviderId: getDefaultValue(dataStore, "medicareProviderId") ?? "",
    },
    shouldFocusError: !mayHaveThreeOrMoreErrors,
  });

  const npiNumber = watch("npiNumber");
  return (
    <DoulaForm<PersonalDetails3Data>
      errors={errors}
      handleSubmit={handleSubmit}
      mayHaveThreeOrMoreErrors={mayHaveThreeOrMoreErrors}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md">Doula provider identification</h2>
          <p>
            To be an NJ FamilyCare doula, your NPI must be Type 1 and linked to the doula taxonomy
            code 374J00000X.
          </p>

          <div className="tablet:grid-col-6">
            <DoulaTextInputMask
              name="npiNumber"
              label={orderedInputNameToLabel["npiNumber"]}
              hint={"Enter your 10-digit NPI number."}
              value={npiNumber ?? ""}
              mask="__________"
              pattern="\d{10}"
              required
              errors={errors}
              register={register}
              registerOptions={{
                required: true,
                minLength: {
                  value: 10,
                  message: `${orderedInputNameToLabel["npiNumber"]} must have 10 digits`,
                },
              }}
              customErrorMessages={[
                {
                  type: "required",
                  message: (
                    <span>
                      To be an NJ FamilyCare doula, you need a NPI. You can get yours via{" "}
                      <a
                        href="https://nppes.cms.hhs.gov/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="usa-link usa-link--external"
                      >
                        https://nppes.cms.hhs.gov/
                      </a>
                      .
                    </span>
                  ),
                },
              ]}
            />
          </div>
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

          <div className="tablet:grid-col-6">
            <DoulaTextInput
              name="upinNumber"
              label={`${orderedInputNameToLabel["upinNumber"]} (optional)`}
              hint={"Most doulas don't have this."}
              register={register}
            />
          </div>
          <div className="tablet:grid-col-6">
            <DoulaTextInput
              name="medicareProviderId"
              label={`${orderedInputNameToLabel["medicareProviderId"]} (optional)`}
              hint={"Most doulas don't have this."}
              register={register}
            />
          </div>
        </div>
      </div>
      <HorizontalDivider />
      <FormProgressButtons />
    </DoulaForm>
  );
};

export default PersonalDetailsStep3;
