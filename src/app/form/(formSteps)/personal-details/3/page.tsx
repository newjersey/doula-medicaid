"use client";

import { Form, Label, TextInput } from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { routeToNextStep, useFormProgressPosition } from "../../../_utils/formProgressRouting";
import { getValue, setKeyValue } from "../../../_utils/sessionStorage";
import FormProgressButtons from "../../components/FormProgressButtons";
import { type PersonalInformationData } from "../PersonalInformationData";

const PersonalDetailsStep3: React.FC = () => {
  const [dataHasLoaded, setDataHasLoaded] = useState<boolean>(false);
  const router = useRouter();
  const formProgressPosition = useFormProgressPosition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInformationData>({
    defaultValues: {
      npiNumber: getValue("npiNumber") || "",
      upinNumber: getValue("upinNumber") || "",
      medicareProviderId: getValue("medicareProviderId") || "",
    },
  });

  const onSubmit: SubmitHandler<PersonalInformationData> = (data) => {
    for (const key in data) {
      const value = data[key as keyof PersonalInformationData] ?? "";
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
              NPI number
            </Label>
            <p id="npiNumberHint" className="usa-hint">
              Format ABCD1234
            </p>
            <TextInput
              id="npiNumber"
              type="text"
              required
              aria-describedby="npiNumberHint npiNumberErrorMessage"
              aria-invalid={errors.npiNumber ? "true" : "false"}
              className={errors.npiNumber ? "usa-input--error" : ""}
              {...register("npiNumber", { required: true })}
            />
            {errors.npiNumber?.type === "required" && (
              <span id="npiNumberErrorMessage" className="usa-error-message" role="alert">
                NPI number is required
              </span>
            )}
            <Label htmlFor="upinNumber">UPIN number (if applicable)</Label>
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
            <Label htmlFor="medicareProviderId">Medicare provider ID (if applicable)</Label>
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
