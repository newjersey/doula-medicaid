"use client";

import { type PersonalDetails1Data } from "@/app/form/(formSteps)/personal-details/PersonalDetailsData";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { routeToNextStep, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { formatDateOfBirthDefaultValue } from "@form/_utils/inputFields/dateOfBirth";
import { getValue, setKeyValue } from "@form/_utils/sessionStorage";
import { DatePicker, Fieldset, Form, Label, TextInput } from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, type SubmitErrorHandler, type SubmitHandler, useForm } from "react-hook-form";

const MM_DD_YYYY = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;

const dateIsValid = (date: string): boolean => {
  const found = date.match(MM_DD_YYYY);
  return !!found;
};

const orderedInputNameToLabel: { [key in keyof PersonalDetails1Data]: string } = {
  firstName: "First name",
  middleName: "Middle name",
  lastName: "Last name",
  dateOfBirth: "Date of birth",
  socialSecurityNumber: "Social security number",
  email: "Email address",
  phoneNumber: "Phone number",
};

const PersonalDetailsStep1 = () => {
  const router = useRouter();
  const formProgressPosition = useFormProgressPosition();
  const [dataHasLoaded, setDataHasLoaded] = useState<boolean>(false);
  const [shouldSummarizeErrors, setShouldSummarizeErrors] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setFocus,
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
    shouldFocusError: false,
  });
  const errorSummaryRef = useRef<HTMLInputElement>(null);

  const onSubmit: SubmitHandler<PersonalDetails1Data> = (data) => {
    for (const key in data) {
      const value = data[key as keyof PersonalDetails1Data] ?? "";
      setKeyValue(key, value);
    }
    routeToNextStep(router, formProgressPosition);
  };
  const onError: SubmitErrorHandler<PersonalDetails1Data> = (errors) => {
    if (Object.keys(errors).length >= 3) {
      setShouldSummarizeErrors(true);
      errorSummaryRef.current?.focus();
    } else {
      setShouldSummarizeErrors(false);
      for (const inputName of Object.keys(orderedInputNameToLabel) as Array<
        keyof PersonalDetails1Data
      >) {
        if (errors[inputName] !== undefined) {
          setFocus(inputName);
          break;
        }
      }
    }
  };

  useEffect(() => {
    setDataHasLoaded(true);
  }, []);

  return (
    <div>
      {dataHasLoaded && (
        <Form onSubmit={handleSubmit(onSubmit, onError)} className="maxw-full" noValidate>
          <div className="maxw-tablet">
            <div tabIndex={-1} ref={errorSummaryRef}>
              {shouldSummarizeErrors && Object.keys(errors).length >= 1 && (
                <div
                  className="usa-alert usa-alert--error margin-bottom-3 border-05 border-top-105 border-secondary-dark"
                  role="alert"
                  aria-labelledby="error-summary-heading"
                >
                  <div className="usa-alert__body">
                    <h2 className="usa-alert__heading" id="error-summary-heading">
                      There is a problem
                    </h2>

                    <ul className="usa-list usa-list--unstyled">
                      {Object.entries(errors).map(([field, error]) => {
                        return <li key={field}>{error.message}</li>;
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <h2 className="font-heading-md">Personal identification</h2>
            <Fieldset legend="Name" legendStyle="srOnly" className="grid-row grid-gap">
              <div className="tablet:grid-col-4">
                <Label htmlFor="firstName" requiredMarker>
                  {orderedInputNameToLabel["firstName"]}
                </Label>
                <TextInput
                  id="firstName"
                  type="text"
                  required
                  validationStatus={errors.firstName ? "error" : undefined}
                  aria-invalid={errors.firstName ? "true" : "false"}
                  aria-describedby={errors.firstName && "firstNameErrorMessage"}
                  {...register("firstName", {
                    required: `${orderedInputNameToLabel["firstName"]} is required`,
                  })}
                />
                {errors.firstName && (
                  <span
                    id="firstNameErrorMessage"
                    className="usa-error-message"
                    {...(shouldSummarizeErrors ? {} : { role: "alert" })}
                  >
                    {errors.firstName.message}
                  </span>
                )}
              </div>
              <div className="tablet:grid-col-4">
                <Label htmlFor="middleName">{orderedInputNameToLabel["middleName"]}</Label>
                <TextInput id="middleName" type="text" {...register("middleName")} />
              </div>
              <div className="tablet:grid-col-4">
                <Label htmlFor="lastName" requiredMarker>
                  {orderedInputNameToLabel["lastName"]}
                </Label>
                <TextInput
                  id="lastName"
                  type="text"
                  required
                  validationStatus={errors.lastName ? "error" : undefined}
                  aria-invalid={errors.lastName ? "true" : "false"}
                  aria-describedby={errors.lastName && "lastNameErrorMessage"}
                  {...register("lastName", {
                    required: `${orderedInputNameToLabel["lastName"]} is required`,
                  })}
                />
                {errors.lastName && (
                  <span
                    id="lastNameErrorMessage"
                    className="usa-error-message"
                    {...(shouldSummarizeErrors ? {} : { role: "alert" })}
                  >
                    {errors.lastName.message}
                  </span>
                )}
              </div>
            </Fieldset>
            <Label id="dateOfBirthLabel" htmlFor="dateOfBirth" requiredMarker>
              {orderedInputNameToLabel["dateOfBirth"]}
            </Label>
            <div className="usa-hint" id="dateOfBirthHint">
              <p className="usa-hint">For example: 03/31/1986</p>
              mm/dd/yyyy
            </div>
            <Controller
              name="dateOfBirth"
              control={control}
              rules={{ required: `${orderedInputNameToLabel["dateOfBirth"]} is required` }}
              render={({ field }) => (
                <DatePicker
                  name="dateOfBirth"
                  id="dateOfBirth"
                  required
                  validationStatus={errors.dateOfBirth ? "error" : undefined}
                  aria-invalid={errors.dateOfBirth ? "true" : "false"}
                  aria-describedby={`${errors.dateOfBirth ? "dateOfBirthErrorMessage" : ""} dateOfBirthHint`}
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
            {errors.dateOfBirth && (
              <span
                id="dateOfBirthErrorMessage"
                className="usa-error-message"
                {...(shouldSummarizeErrors ? {} : { role: "alert" })}
              >
                {errors.dateOfBirth.message}
              </span>
            )}
            <Label htmlFor="socialSecurityNumber" requiredMarker>
              {orderedInputNameToLabel["socialSecurityNumber"]}
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
              aria-describedby={`${errors.socialSecurityNumber ? "socialSecurityNumberErrorMessage" : ""} socialSecurityNumberHint`}
              {...register("socialSecurityNumber", {
                required: `${orderedInputNameToLabel["socialSecurityNumber"]} is required`,
              })}
            />
            {errors.socialSecurityNumber && (
              <span
                id="socialSecurityNumberErrorMessage"
                className="usa-error-message"
                role="alert"
              >
                {errors.socialSecurityNumber.message}
              </span>
            )}
          </div>
          <hr className="margin-top-5 margin-bottom-5" />
          <div className="maxw-tablet">
            <h2 className="font-heading-md">Contact information</h2>
            <p>This is where we&lsquo;ll send official updates and communications.</p>
            <Label htmlFor="email" requiredMarker>
              {orderedInputNameToLabel["email"]}
            </Label>
            <TextInput
              id="email"
              autoCorrect="off"
              autoCapitalize="off"
              required
              validationStatus={errors.email ? "error" : undefined}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email && "emailErrorMessage"}
              {...register("email", {
                required: `${orderedInputNameToLabel["email"]} is required`,
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Entered value does not match email format",
                },
              })}
              type="email"
            />
            {errors.email && (
              <span
                id="emailErrorMessage"
                className="usa-error-message"
                {...(shouldSummarizeErrors ? {} : { role: "alert" })}
              >
                {errors.email.message}
              </span>
            )}

            <Label htmlFor="phoneNumber" requiredMarker>
              {orderedInputNameToLabel["phoneNumber"]}
            </Label>
            <TextInput
              id="phoneNumber"
              type="tel"
              required
              validationStatus={errors.phoneNumber ? "error" : undefined}
              aria-invalid={errors.phoneNumber ? "true" : "false"}
              aria-describedby={errors.phoneNumber && "phoneNumberErrorMessage"}
              {...register("phoneNumber", {
                required: `${orderedInputNameToLabel["phoneNumber"]} is required`,
              })}
            />
            {errors.phoneNumber && (
              <span
                id="phoneNumberErrorMessage"
                className="usa-error-message"
                {...(shouldSummarizeErrors ? {} : { role: "alert" })}
              >
                {errors.phoneNumber.message}
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
