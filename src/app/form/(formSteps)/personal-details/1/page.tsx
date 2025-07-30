"use client";

import { DatePicker, Fieldset, Form, Label, SummaryBox, TextInput } from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { type SubmitHandler, Controller, useForm } from "react-hook-form";
import { routeToNextStep, useFormProgressPosition } from "../../../_utils/formProgressRouting";
import { formatDateOfBirthDefaultValue } from "../../../_utils/inputFields/dateOfBirth";
import { getValue, setKeyValue } from "../../../_utils/sessionStorage";
import FormProgressButtons from "../../components/FormProgressButtons";
import { type PersonalDetails1Data } from "../PersonalDetailsData";

const MM_DD_YYYY = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;

const dateIsValid = (date: string): boolean => {
  const found = date.match(MM_DD_YYYY);
  return !!found;
};

const inputNameToLabel: { [key in keyof PersonalDetails1Data]: string } = {
  firstName: "First name",
  middleName: "Middle name",
  lastName: "Last name",
  dateOfBirth: "Date of birth",
  socialSecurityNumber: "Social security number",
  email: "Email address",
  phoneNumber: "Phone number",
};

const PersonalDetailsStep1: React.FC = () => {
  const router = useRouter();
  const formProgressPosition = useFormProgressPosition();
  const [dataHasLoaded, setDataHasLoaded] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<PersonalDetails1Data>({
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

  const onSubmit: SubmitHandler<PersonalDetails1Data> = (data) => {
    for (const key in data) {
      const value = data[key as keyof PersonalDetails1Data] ?? "";
      setKeyValue(key, value);
    }
    routeToNextStep(router, formProgressPosition);
  };
  console.log(Object.values(errors).map((error) => error.message));

  useEffect(() => {
    setDataHasLoaded(true);
  }, []);

  return (
    <div>
      {dataHasLoaded && (
        <Form onSubmit={handleSubmit(onSubmit)} className="maxw-full" noValidate>
          <div className="maxw-tablet">
            <SummaryBox>
              {Object.keys(errors).length > 0 && (
                <ul>
                  {Object.entries(errors).map(([field, error]) => {
                    console.log("field", field);
                    return "hi";
                    // <li key={field}>{error.type + error.message || "This field is required"}</li>
                  })}
                </ul>
              )}
            </SummaryBox>
            <h2 className="font-heading-md">Personal identification</h2>
            <Fieldset legend="Name" legendStyle="srOnly" className="grid-row grid-gap">
              <div className="tablet:grid-col-4">
                <Label htmlFor="firstName" requiredMarker>
                  {inputNameToLabel["firstName"]}
                </Label>
                <TextInput
                  id="firstName"
                  type="text"
                  required
                  validationStatus={errors.firstName ? "error" : undefined}
                  aria-invalid={errors.firstName ? "true" : "false"}
                  aria-describedby="firstNameErrorMessage"
                  {...register("firstName", {
                    required: `${inputNameToLabel["firstName"]} is required`,
                  })}
                />
                {errors.firstName && (
                  <span id="firstNameErrorMessage" className="usa-error-message" role="alert">
                    {errors.firstName.message}
                  </span>
                )}
              </div>
              <div className="tablet:grid-col-4">
                <Label htmlFor="middleName">{inputNameToLabel["middleName"]}</Label>
                <TextInput id="middleName" type="text" {...register("middleName")} />
              </div>
              <div className="tablet:grid-col-4">
                <Label htmlFor="lastName" requiredMarker>
                  {inputNameToLabel["lastName"]}
                </Label>
                <TextInput
                  id="lastName"
                  type="text"
                  required
                  validationStatus={errors.lastName ? "error" : undefined}
                  aria-invalid={errors.lastName ? "true" : "false"}
                  aria-describedby="lastNameErrorMessage"
                  {...register("lastName", { required: true })}
                />
                {errors.lastName?.type === "required" && (
                  <span id="lastNameErrorMessage" className="usa-error-message" role="alert">
                    {inputNameToLabel["lastName"]} is required
                  </span>
                )}
              </div>
            </Fieldset>
            <Label id="dateOfBirthLabel" htmlFor="dateOfBirth" requiredMarker>
              {inputNameToLabel["dateOfBirth"]}
            </Label>
            <div className="usa-hint" id="dateOfBirthHint">
              <p className="usa-hint">For example: 03/31/1986</p>
              mm/dd/yyyy
            </div>
            <Controller
              name="dateOfBirth"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <DatePicker
                  name="dateOfBirth"
                  id="dateOfBirth"
                  required
                  validationStatus={errors.dateOfBirth ? "error" : undefined}
                  aria-invalid={errors.dateOfBirth ? "true" : "false"}
                  aria-describedby="dateOfBirthErrorMessage dateOfBirthHint"
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
            {errors.dateOfBirth?.type === "required" && (
              <span id="dateOfBirthErrorMessage" className="usa-error-message" role="alert">
                {inputNameToLabel["dateOfBirth"]} is required
              </span>
            )}
            <Label htmlFor="socialSecurityNumber" requiredMarker>
              {inputNameToLabel["socialSecurityNumber"]}
            </Label>
            <p id="socialSecurityNumberHint" className="usa-hint">
              Format XXX-XX-XXXX
            </p>
            <TextInput
              id="socialSecurityNumber"
              type="text"
              required
              validationStatus={errors.socialSecurityNumber ? "error" : undefined}
              aria-invalid={errors.socialSecurityNumber ? "true" : "false"}
              aria-describedby="socialSecurityNumberHint socialSecurityNumberErrorMessage"
              {...register("socialSecurityNumber", { required: true })}
            />
            {errors.socialSecurityNumber?.type === "required" && (
              <span
                id="socialSecurityNumberErrorMessage"
                className="usa-error-message"
                role="alert"
              >
                {inputNameToLabel["socialSecurityNumber"]} is required
              </span>
            )}
          </div>
          <hr className="margin-top-5 margin-bottom-5" />
          <div className="maxw-tablet">
            <h2 className="font-heading-md">Contact information</h2>
            <p>This is where we&lsquo;ll send official updates and communications.</p>
            <Label htmlFor="email" requiredMarker>
              {inputNameToLabel["email"]}
            </Label>
            <TextInput
              id="email"
              required
              validationStatus={errors.email ? "error" : undefined}
              aria-invalid={errors.email ? "true" : "false"}
              autoCorrect="off"
              autoCapitalize="off"
              aria-describedby="emailErrorMessage"
              {...register("email", {
                required: `${inputNameToLabel["email"]} is required`,
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Entered value does not match email format",
                },
              })}
              type="email"
            />
            {errors.email && (
              <span id="emailErrorMessage" className="usa-error-message" role="alert">
                {errors.email.message}
              </span>
            )}

            <Label htmlFor="phoneNumber" requiredMarker>
              {inputNameToLabel["phoneNumber"]}
            </Label>
            <TextInput
              id="phoneNumber"
              type="tel"
              required
              validationStatus={errors.phoneNumber ? "error" : undefined}
              aria-invalid={errors.phoneNumber ? "true" : "false"}
              aria-describedby="phoneNumberErrorMessage"
              {...register("phoneNumber", { required: true })}
            />
            {errors.phoneNumber?.type === "required" && (
              <span id="phoneNumberErrorMessage" className="usa-error-message" role="alert">
                {inputNameToLabel["phoneNumber"]} is required
              </span>
            )}
          </div>
          <FormProgressButtons />
        </Form>
      )}
    </div>
  );
};

export default PersonalDetailsStep1;
