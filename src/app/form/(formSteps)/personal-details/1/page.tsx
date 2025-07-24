"use client";

import {
  DatePicker,
  Fieldset,
  Form,
  Label,
  RequiredMarker,
  TextInput,
} from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { type SubmitHandler, Controller, useForm } from "react-hook-form";
import { routeToNextStep, useFormProgressPosition } from "../../../_utils/formProgressRouting";
import { formatDateOfBirthDefaultValue } from "../../../_utils/inputFields/dateOfBirth";
import { getValue, setKeyValue } from "../../../_utils/sessionStorage";
import FormProgressButtons from "../../components/FormProgressButtons";
import { type PersonalInformationData } from "../PersonalInformationData";

const MM_DD_YYYY = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;

const dateIsValid = (date: string): boolean => {
  const found = date.match(MM_DD_YYYY);
  return !!found;
};

const PersonalDetailsStep1: React.FC = () => {
  const router = useRouter();
  const formProgressPosition = useFormProgressPosition();
  const [dataHasLoaded, setDataHasLoaded] = useState<boolean>(false);
  const { register, handleSubmit, control } = useForm<PersonalInformationData>({
    defaultValues: {
      firstName: getValue("firstName") || "",
      middleName: getValue("middleName") || "",
      lastName: getValue("lastName") || "",
      dateOfBirth: getValue("dateOfBirth") || "",
      socialSecurityNumber: getValue("socialSecurityNumber") || "",
      email: getValue("email") || "",
      phoneNumber: getValue("phoneNumber") || "",
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
            <h2 className="font-heading-md">Personal Identification</h2>
            <Fieldset legend="Name" legendStyle="srOnly" className="grid-row grid-gap">
              <div className="tablet:grid-col-4">
                <Label htmlFor="firstName">
                  First name <RequiredMarker />{" "}
                </Label>
                <TextInput id="firstName" type="text" required {...register("firstName")} />
              </div>
              <div className="tablet:grid-col-4">
                <Label htmlFor="middleName" hint=" (optional)">
                  Middle name
                </Label>
                <TextInput id="middleName" type="text" {...register("middleName")} />
              </div>
              <div className="tablet:grid-col-4">
                <Label htmlFor="lastName">
                  Last name <RequiredMarker />{" "}
                </Label>
                <TextInput id="lastName" type="text" required {...register("lastName")} />
              </div>
            </Fieldset>
            <Label id="dateOfBirthLabel" htmlFor="dateOfBirth">
              Date of birth <RequiredMarker />
            </Label>
            <p className="usa-hint">For example: March 18 1986</p>
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
                  required
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

            <Label htmlFor="socialSecurityNumber">
              Social security number <RequiredMarker />
            </Label>
            <p className="usa-hint">Format XXX-XX-XXXX</p>
            <TextInput
              id="socialSecurityNumber"
              type="text"
              required
              {...register("socialSecurityNumber")}
            />
          </div>
          <hr className="margin-top-5 margin-bottom-5" />
          <div className="maxw-tablet">
            <h2 className="font-heading-md">Contact Information</h2>
            <p>This is where we&lsquo;ll send official updates and communications.</p>
            <Label htmlFor="email">
              Email address <RequiredMarker />
            </Label>
            <TextInput
              id="email"
              type="email"
              autoCorrect="off"
              autoCapitalize="off"
              required
              {...register("email")}
            />

            <Label htmlFor="phoneNumber">
              Phone number <RequiredMarker />{" "}
            </Label>
            <TextInput id="phoneNumber" type="tel" required {...register("phoneNumber")} />
          </div>
          <FormProgressButtons />
        </Form>
      )}
    </div>
  );
};

export default PersonalDetailsStep1;
