"use client";

import { Form, Label, RequiredMarker, TextInput, TextInputMask } from "@trussworks/react-uswds";
import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { getValue, setKeyValue } from "../../../_utils/sessionStorage";
import ProgressButtons from "../../components/ProgressButtons";
import { PersonalInformationData } from "../PersonalInformationData";

const PersonalDetailsStep3: React.FC = () => {
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

  return (
    <div>
      <Form
        onSubmit={() => {
          throw new Error(
            "Form submission does not use the onSubmit handler, use ProgressButtons instead",
          );
        }}
      >
        <Label htmlFor="npiNumber">
          NPI number <RequiredMarker />
        </Label>
        <TextInputMask
          id="npiNumber"
          type="tel"
          inputMode="numeric"
          mask="__________"
          pattern="\d{10}"
          required
          {...register("npiNumber")}
        />
        <Label htmlFor="upinNumber">UPIN number (if applicable)</Label>
        <TextInput type="number" id="upinNumber" inputMode="numeric" {...register("upinNumber")} />
        <Label htmlFor="medicaidProviderId">Medicaid provider ID (if applicable)</Label>
        <TextInput
          type="number"
          id="medicaidProviderId"
          inputMode="numeric"
          {...register("medicaidProviderId")}
        />
      </Form>
      <ProgressButtons onClickHandler={handleSubmit(onSubmit)} />
    </div>
  );
};

export default PersonalDetailsStep3;
