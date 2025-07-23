"use client";

import { Form, Label, RequiredMarker, TextInput } from "@trussworks/react-uswds";
import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { getValue, setKeyValue } from "../../../_utils/sessionStorage";
import ProgressButtons from "../../components/ProgressButtons";
import { type PersonalInformationData } from "../PersonalInformationData";

const PersonalDetailsStep3: React.FC = () => {
  const [dataHasLoaded, setDataHasLoaded] = useState<boolean>(false);
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
  };

  useEffect(() => {
    setDataHasLoaded(true);
  }, []);

  return (
    <div>
      {dataHasLoaded && (
        <Form
          onSubmit={() => {
            throw new Error(
              "Form submission does not use the onSubmit handler, use ProgressButtons instead",
            );
          }}
          className="maxw-tablet"
        >
          <h2 className="font-heading-md">Provider IDs</h2>
          <Label htmlFor="npiNumber">
            NPI number <RequiredMarker />
          </Label>
          <TextInput id="npiNumber" type="text" required {...register("npiNumber")} />
          <Label htmlFor="upinNumber">UPIN number (if applicable)</Label>
          <TextInput type="text" id="upinNumber" inputMode="text" {...register("upinNumber")} />
          <Label htmlFor="medicaidProviderId">Medicaid provider ID (if applicable)</Label>
          <TextInput
            type="text"
            id="medicaidProviderId"
            inputMode="text"
            {...register("medicaidProviderId")}
          />
        </Form>
      )}
      <ProgressButtons onClickHandler={handleSubmit(onSubmit)} />
    </div>
  );
};

export default PersonalDetailsStep3;
