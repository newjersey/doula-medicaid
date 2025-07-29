"use client";

import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { type PersonalInformationData } from "@form/(formSteps)/personal-details/PersonalInformationData";
import { routeToNextStep, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { getValue, setKeyValue } from "@form/_utils/sessionStorage";
import { Form, Label, TextInput } from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

const PersonalDetailsStep3: React.FC = () => {
  const [dataHasLoaded, setDataHasLoaded] = useState<boolean>(false);
  const router = useRouter();
  const formProgressPosition = useFormProgressPosition();
  const { register, handleSubmit } = useForm<PersonalInformationData>({
    defaultValues: {
      npiNumber: getValue("npiNumber") || "",
      upinNumber: getValue("upinNumber") || "",
      medicaidProviderId: getValue("medicaidProviderId") || "",
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
        <Form onSubmit={handleSubmit(onSubmit)} className="maxw-full">
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
              aria-describedby="npiNumberHint"
              {...register("npiNumber")}
            />
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
            <Label htmlFor="medicaidProviderId">Medicaid provider ID (if applicable)</Label>
            <p id="medicaidProviderIdHint" className="usa-hint">
              Format ABCD1234
            </p>
            <TextInput
              type="text"
              id="medicaidProviderId"
              inputMode="text"
              aria-describedby="medicaidProviderIdHint"
              {...register("medicaidProviderId")}
            />
          </div>
          <FormProgressButtons />
        </Form>
      )}
    </div>
  );
};

export default PersonalDetailsStep3;
