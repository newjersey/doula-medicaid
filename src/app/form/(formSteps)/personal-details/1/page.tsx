"use client";

import { Fieldset, Form, Label, Select, TextInput, TextInputMask } from "@trussworks/react-uswds";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AddressState } from "../../../_utils/inputFields/enums";
import { setKeyValue } from "../../../_utils/sessionStorage";
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

const PersonalDetailsStep1: React.FC = () => {
  const [dataHasLoaded, setDataHasLoaded] = useState<boolean>(false);
  const { register, handleSubmit, control } = useForm<PersonalInformationData>({
    defaultValues: {
      firstName: null,
      middleName: null,
      lastName: null,
      dateOfBirth: null,
      phoneNumber: null,
      email: null,
      npiNumber: null,
      socialSecurityNumber: null,
      streetAddress1: null,
      streetAddress2: null,
      city: null,
      state: "NJ",
      zip: null,
    },
  });
  const onSubmit: SubmitHandler<PersonalInformationData> = (data) => {
    console.log(data);
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
        <Form onSubmit={handleSubmit(onSubmit)} className="maxw-tablet">
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
          {/* <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => <DatePicker {...field} />}
          />
          <DatePicker
            id="dateOfBirth"
            aria-describedby="dateOfBirthHint"
            aria-labelledby="dateOfBirthLabel"
            key={dataHasLoaded.toString()}
            defaultValue={
              personalInformationData.dateOfBirth
                ? formatDateOfBirthDefaultValue(new Date(personalInformationData.dateOfBirth))
                : undefined
            }
            {...register("dateOfBirth")}
          /> */}

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
          <input type="submit" />
        </Form>
      )}
      <ProgressButtons onClickHandler={handleSubmit(onSubmit)} />
    </div>
  );
};

export default PersonalDetailsStep1;
