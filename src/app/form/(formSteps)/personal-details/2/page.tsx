"use client";

import {
  Fieldset,
  Form,
  Label,
  RequiredMarker,
  Select,
  TextInput,
  TextInputMask,
} from "@trussworks/react-uswds";
import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AddressState } from "../../../_utils/inputFields/enums";
import { getValue, setKeyValue } from "../../../_utils/sessionStorage";
import ProgressButtons from "../../components/ProgressButtons";
import { PersonalInformationData } from "../PersonalInformationData";

const PersonalDetailsStep2: React.FC = () => {
  const { register, handleSubmit, control } = useForm<PersonalInformationData>({
    defaultValues: {
      npiNumber: getValue("npiNumber") || "",
      streetAddress1: getValue("streetAddress1") || "",
      streetAddress2: getValue("streetAddress2") || "",
      city: getValue("city") || "",
      state: getValue("state") || "NJ",
      zip: getValue("zip") || "",
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
        <Fieldset legend="Mail to address" legendStyle="srOnly">
          <Label htmlFor="streetAddress1">
            Street address 1 <RequiredMarker />
          </Label>
          <TextInput
            id="streetAddress1"
            type="text"
            inputMode="numeric"
            required
            {...register("streetAddress1")}
          />

          <Label htmlFor="streetAddress2" hint=" (optional)">
            Street address 2
          </Label>
          <TextInput id="streetAddress2" type="text" {...register("streetAddress2")} />

          <div className="grid-row grid-gap">
            <div className="mobile-lg:grid-col-8">
              <Label htmlFor="city">
                City <RequiredMarker />
              </Label>
              <TextInput
                className="usa-input"
                id="city"
                type="text"
                required
                {...register("city")}
              />
            </div>
            <div className="mobile-lg:grid-col-4">
              <Label htmlFor="state">
                State <RequiredMarker />{" "}
              </Label>
              <Select className="usa-select" id="state" required {...register("state")}>
                {Object.keys(AddressState).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <Label htmlFor="zip">
            ZIP code <RequiredMarker />
          </Label>
          <TextInput
            className="usa-input usa-input--medium"
            id="zip"
            type="text"
            pattern="[\d]{5}(-[\d]{4})?"
            required
            {...register("zip")}
          />
        </Fieldset>
      </Form>
      <ProgressButtons onClickHandler={handleSubmit(onSubmit)} />
    </div>
  );
};

export default PersonalDetailsStep2;
