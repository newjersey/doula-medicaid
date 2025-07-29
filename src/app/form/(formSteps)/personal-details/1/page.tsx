"use client";

import { DatePicker, Fieldset, Form, Label, TextInput } from "@trussworks/react-uswds";
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
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<PersonalInformationData>({
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
        <Form onSubmit={handleSubmit(onSubmit)} className="maxw-full" noValidate>
          <div className="maxw-tablet">
            <h2 className="font-heading-md">Personal identification</h2>
            <Fieldset legend="Name" legendStyle="srOnly" className="grid-row grid-gap">
              <div className="tablet:grid-col-4">
                <Label htmlFor="firstName" requiredMarker>
                  First name
                </Label>
                <TextInput
                  id="firstName"
                  type="text"
                  required
                  validationStatus={errors.firstName ? "error" : undefined}
                  aria-invalid={errors.firstName ? "true" : "false"}
                  aria-describedby="firstNameErrorMessage"
                  {...register("firstName", { required: true })}
                />
                {errors.firstName?.type === "required" && (
                  <span id="firstNameErrorMessage" className="usa-error-message" role="alert">
                    First name is required
                  </span>
                )}
              </div>
              <div className="tablet:grid-col-4">
                <Label htmlFor="middleName">Middle name</Label>
                <TextInput id="middleName" type="text" {...register("middleName")} />
              </div>
              <div className="tablet:grid-col-4">
                <Label htmlFor="lastName" requiredMarker>
                  Last name
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
                    Last name is required
                  </span>
                )}
              </div>
            </Fieldset>
            <Label id="dateOfBirthLabel" htmlFor="dateOfBirth" requiredMarker>
              Date of birth
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
                Date of birth is required
              </span>
            )}
            <Label htmlFor="socialSecurityNumber" requiredMarker>
              Social security number
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
                Social security number is required
              </span>
            )}
          </div>
          <hr className="margin-top-5 margin-bottom-5" />
          <div className="maxw-tablet">
            <h2 className="font-heading-md">Contact information</h2>
            <p>This is where we&lsquo;ll send official updates and communications.</p>
            <Label htmlFor="email" requiredMarker>
              Email address
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
                required: "required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Entered value does not match email format",
                },
              })}
              type="email"
            />
            {errors.email && (
              <span id="emailErrorMessage" className="usa-error-message" role="alert">
                {errors.email?.type === "required"
                  ? "Email address is required"
                  : errors.email.message}
              </span>
            )}

            <Label htmlFor="phoneNumber" requiredMarker>
              Phone number
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
                Phone number is required
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
