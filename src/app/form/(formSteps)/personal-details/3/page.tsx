"use client";

import NpiExplainer from "@/app/form/(formSteps)/personal-details/3/NpiExplainer";
import type { PersonalDetails3Data } from "@/app/form/(formSteps)/personal-details/PersonalDetailsData";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { routeToNextStep, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { getValue, setKeyValue } from "@form/_utils/sessionStorage";
import { Form, Label, TextInput, TextInputMask } from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

const inputNameToLabel: { [key in keyof PersonalDetails3Data]: string } = {
  npiNumber: "National Provider Identifier (NPI)",
  upinNumber: "UPIN number",
  medicareProviderId: "Medicare provider ID",
};

const PersonalDetailsStep3 = () => {
  const [dataHasLoaded, setDataHasLoaded] = useState<boolean>(false);
  const router = useRouter();
  const formProgressPosition = useFormProgressPosition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PersonalDetails3Data>({
    defaultValues: {
      npiNumber: getValue("npiNumber") || "",
      upinNumber: getValue("upinNumber") || "",
      medicareProviderId: getValue("medicareProviderId") || "",
    },
  });
  const npiNumber = watch("npiNumber");

  const onSubmit: SubmitHandler<PersonalDetails3Data> = (data) => {
    let key: keyof PersonalDetails3Data;
    for (key in data) {
      const value = data[key] ?? "";
      setKeyValue(key, value);
    }
    routeToNextStep(router, formProgressPosition);
  };

  useEffect(() => {
    setDataHasLoaded(true);
  }, []);

  return (
    <div>
      {dataHasLoaded && (
        <Form onSubmit={handleSubmit(onSubmit)} className="maxw-full" noValidate>
          <div className="form-grid">
            <div>
              <h2 className="font-heading-md">Doula provider identification</h2>
              <p>
                Note:{" "}
                <span className="usa-hint">
                  To be an NJ FamilyCare doula, your NPI must be Type 1 and linked to the doula
                  taxonomy code. You can update this via{" "}
                  <a href="https://nppes.cms.hhs.gov" target="_blank" rel="noopener">
                    https://nppes.cms.hhs.gov
                  </a>
                </span>
                .
              </p>
              <Label htmlFor="npiNumber" requiredMarker>
                {inputNameToLabel["npiNumber"]}
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
                aria-describedby={`${errors.npiNumber ? "npiNumberErrorMessage" : ""} npiNumberHint`}
                {...register("npiNumber", {
                  required: `${inputNameToLabel["npiNumber"]} is required`,
                  minLength: {
                    value: 10,
                    message: `${inputNameToLabel["npiNumber"]} must have 10 digits`,
                  },
                })}
              />
              {errors.npiNumber && (
                <span id="npiNumberErrorMessage" className="usa-error-message">
                  {errors.npiNumber.message}
                </span>
              )}
            </div>
            <div className="form-first-question-explainer">
              <NpiExplainer />
            </div>
            <div>
              <hr className="margin-top-5 margin-bottom-5" />
              <h2 className="font-heading-md">Other identification</h2>
              <p>Leave non-applicable items blank; it won&apos;t affect your application.</p>
              <Label htmlFor="upinNumber">{inputNameToLabel["upinNumber"]} (optional)</Label>
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
                {inputNameToLabel["medicareProviderId"]} (optional)
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
        </Form>
      )}
    </div>
  );
};

export default PersonalDetailsStep3;
