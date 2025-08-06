"use client";

import type { PersonalDetails3Data } from "@/app/form/(formSteps)/personal-details/PersonalDetailsData";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { routeToNextStep, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { getValue, setKeyValue } from "@form/_utils/sessionStorage";
import { Form, Label, TextInput } from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

const inputNameToLabel: { [key in keyof PersonalDetails3Data]: string } = {
  npiNumber: "NPI number",
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
  } = useForm<PersonalDetails3Data>({
    defaultValues: {
      npiNumber: getValue("npiNumber") || "",
      upinNumber: getValue("upinNumber") || "",
      medicareProviderId: getValue("medicareProviderId") || "",
    },
  });

  const onSubmit: SubmitHandler<PersonalDetails3Data> = (data) => {
    for (const key in data) {
      const value = data[key as keyof PersonalDetails3Data] ?? "";
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
          <div className="maxw-tablet">
            <h2 className="font-heading-md">Provider IDs</h2>
            <p>This is a general instruction if needed for the user to answer correctly.</p>
            <Label htmlFor="npiNumber" requiredMarker>
              {inputNameToLabel["npiNumber"]}
            </Label>
            <p id="npiNumberHint" className="usa-hint">
              Format ABCD1234
            </p>
            <TextInput
              id="npiNumber"
              type="text"
              required
              aria-invalid={errors.npiNumber ? "true" : "false"}
              className={errors.npiNumber ? "usa-input--error" : ""}
              aria-describedby={`${errors.npiNumber ? "npiNumberErrorMessage" : ""} npiNumberHint`}
              {...register("npiNumber", {
                required: `${inputNameToLabel["npiNumber"]} is required`,
              })}
            />
            {errors.npiNumber && (
              <span id="npiNumberErrorMessage" className="usa-error-message" role="alert">
                {errors.npiNumber.message}
              </span>
            )}
            <Label htmlFor="upinNumber">{inputNameToLabel["upinNumber"]} (if applicable)</Label>
            <p id="upinNumberHint" className="usa-hint">
              Format ABCD1234
            </p>
            <TextInput
              type="text"
              id="upinNumber"
              inputMode="text"
              aria-describedby="upinNumberHint"
              {...register("upinNumber")}
            />
            <Label htmlFor="medicareProviderId">
              {inputNameToLabel["medicareProviderId"]} (if applicable)
            </Label>
            <p id="medicareProviderIdHint" className="usa-hint">
              Format ABCD1234
            </p>
            <TextInput
              type="text"
              id="medicareProviderId"
              inputMode="text"
              aria-describedby="medicareProviderIdHint"
              {...register("medicareProviderId")}
            />
          </div>
          <FormProgressButtons />
        </Form>
      )}
    </div>
  );
};

export default PersonalDetailsStep3;
