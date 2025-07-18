"use client";

import {
  DatePicker,
  Fieldset,
  Form,
  Label,
  Select,
  TextInput,
  TextInputMask,
} from "@trussworks/react-uswds";
import React, { useEffect, useState } from "react";
import { type SubmitHandler, Controller, useForm } from "react-hook-form";
import { formatDateOfBirthDefaultValue } from "../../../_utils/inputFields/dateOfBirth";
import { AddressState } from "../../../_utils/inputFields/enums";
import { getValue, setKeyValue } from "../../../_utils/sessionStorage";
import ProgressButtons from "../../components/ProgressButtons";

interface PersonalInformationData {
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  phoneNumber: string | null;
  email: string | null;
  npiNumber: string | null;
  socialSecurityNumber: string | null;
  streetAddress1: string | null;
  streetAddress2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
}

const MM_DD_YYYY = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;

const dateIsValid = (date: string): boolean => {
  const found = date.match(MM_DD_YYYY);
  return !!found;
};

const PersonalDetailsStep1: React.FC = () => {
  const [dataHasLoaded, setDataHasLoaded] = useState<boolean>(false);
  const { register, handleSubmit, control } = useForm<PersonalInformationData>({
    defaultValues: {
      firstName: getValue("firstName") || "",
      middleName: getValue("middleName") || "",
      lastName: getValue("lastName") || "",
      phoneNumber: getValue("phoneNumber") || "",
      email: getValue("email") || "",
      dateOfBirth: getValue("dateOfBirth") || "",
      npiNumber: getValue("npiNumber") || "",
      socialSecurityNumber: getValue("socialSecurityNumber") || "",
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
          <Fieldset legend="Name" legendStyle="srOnly" className="grid-row grid-gap">
            <div className="tablet:grid-col-4">
              <Label htmlFor="firstName">First name</Label>
              <TextInput id="firstName" type="text" required {...register("firstName")} />
            </div>
            <div className="tablet:grid-col-4">
              <Label htmlFor="middleName" hint=" (optional)">
                Middle name
              </Label>
              <TextInput id="middleName" type="text" {...register("middleName")} />
            </div>
            <div className="tablet:grid-col-4">
              <Label htmlFor="lastName">Last name</Label>
              <TextInput id="lastName" type="text" required {...register("lastName")} />
            </div>
          </Fieldset>

          <hr />

          <Label id="dateOfBirthLabel" htmlFor="dateOfBirth">
            Date of birth
          </Label>
          <div className="usa-hint" id="dateOfBirthHint">
            mm/dd/yyyy
          </div>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <DatePicker
                name="dateOfBirth"
                id="dateOfBirth"
                aria-describedby="dateOfBirthHint"
                aria-labelledby="dateOfBirthLabel"
                value={field.value || ""}
                onChange={(value) => {
                  if (value === undefined || !dateIsValid(value)) {
                    return;
                  }
                  field.onChange(value);
                }}
                onBlur={field.onBlur}
                key={dataHasLoaded.toString()}
                defaultValue={
                  field.value ? formatDateOfBirthDefaultValue(new Date(field.value)) : undefined
                }
              />
            )}
          />
          <Label htmlFor="phoneNumber">Phone number</Label>
          <TextInputMask
            id="phoneNumber"
            type="tel"
            inputMode="numeric"
            mask="___-___-____"
            pattern="\d{3}-\d{3}-\d{4}"
            required
            {...register("phoneNumber")}
          />

          <Label htmlFor="email">Email address</Label>
          <TextInput
            id="email"
            type="email"
            autoCorrect="off"
            autoCapitalize="off"
            required
            {...register("email")}
          />

          <Label htmlFor="npiNumber">NPI number</Label>
          <TextInputMask
            id="npiNumber"
            type="tel"
            inputMode="numeric"
            mask="__________"
            pattern="\d{10}"
            required
            {...register("npiNumber")}
          />

          <Label htmlFor="socialSecurityNumber">Social security number</Label>
          <TextInputMask
            id="socialSecurityNumber"
            type="text"
            inputMode="numeric"
            mask="___-__-____"
            pattern="\d{3}-\d{2}-\d{4}"
            required
            {...register("socialSecurityNumber")}
          />

          <hr />

          <Fieldset legend="Mail to address" legendStyle="srOnly">
            <Label htmlFor="streetAddress1">Street address 1</Label>
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
                <Label htmlFor="city">City</Label>
                <TextInput
                  className="usa-input"
                  id="city"
                  type="text"
                  required
                  {...register("city")}
                />
              </div>
              <div className="mobile-lg:grid-col-4">
                <Label htmlFor="state">State</Label>
                <Select className="usa-select" id="state" required {...register("state")}>
                  {Object.keys(AddressState).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <Label htmlFor="zip">ZIP code</Label>
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
      )}
      <ProgressButtons onClickHandler={handleSubmit(onSubmit)} />
    </div>
  );
};

export default PersonalDetailsStep1;
