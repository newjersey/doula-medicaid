"use client";

import { type PersonalDetails1Data } from "@/app/form/(formSteps)/personal-details/PersonalDetailsData";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { routeToNextStep, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { getValue, setKeyValue } from "@form/_utils/sessionStorage";
import {
  DateInputGroup,
  Fieldset,
  Form,
  FormGroup,
  Label,
  Select,
  TextInput,
  TextInputMask,
} from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { type SubmitErrorHandler, type SubmitHandler, useForm } from "react-hook-form";

const orderedInputNameToLabel: { [key in keyof PersonalDetails1Data]: string } = {
  firstName: "First name",
  middleName: "Middle name",
  lastName: "Last name",
  dateOfBirthMonth: "Month",
  dateOfBirthDay: "Day",
  dateOfBirthYear: "Year",
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
    watch,
  } = useForm<PersonalDetails1Data>({
    defaultValues: {
      firstName: getValue("firstName") || "",
      middleName: getValue("middleName") || "",
      lastName: getValue("lastName") || "",
      dateOfBirthMonth: getValue("dateOfBirthMonth") || "",
      dateOfBirthDay: getValue("dateOfBirthDay") || "",
      dateOfBirthYear: getValue("dateOfBirthYear") || "",
      socialSecurityNumber: getValue("socialSecurityNumber") || "",
      email: getValue("email") || "",
      phoneNumber: getValue("phoneNumber") || "",
    },
    shouldFocusError: false,
  });
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const phoneNumber = watch("phoneNumber");
  const socialSecurityNumber = watch("socialSecurityNumber");

  const onSubmit: SubmitHandler<PersonalDetails1Data> = (data) => {
    let key: keyof PersonalDetails1Data;
    for (key in data) {
      const value = data[key] ?? "";
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
                  aria-labelledby="error-summary-heading"
                >
                  <div className="usa-alert__body">
                    <h2 className="usa-alert__heading" id="error-summary-heading">
                      There is a problem
                    </h2>

                    <ul className="usa-list usa-list--unstyled">
                      {Object.entries(errors).map(([field, error]) => {
                        return (
                          <li key={field}>
                            <a
                              href={`#${field}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setFocus(field as keyof PersonalDetails1Data);
                              }}
                            >
                              {error.message}
                            </a>
                          </li>
                        );
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
                  <span id="firstNameErrorMessage" className="usa-error-message">
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
                  <span id="lastNameErrorMessage" className="usa-error-message">
                    {errors.lastName.message}
                  </span>
                )}
              </div>
            </Fieldset>

            <Fieldset legend="Date of birth" className="margin-top-3" requiredMarker>
              <span className="usa-hint" id="dateOfBirthHint">
                For example: April 28 1986
              </span>
              <DateInputGroup aria-describedby="dateOfBirthHint">
                <FormGroup className="usa-form-group--month usa-form-group--select">
                  <Label htmlFor="dateOfBirthMonth" requiredMarker>
                    {orderedInputNameToLabel["dateOfBirthMonth"]}
                  </Label>
                  <Select
                    id="dateOfBirthMonth"
                    required
                    validationStatus={errors.dateOfBirthMonth ? "error" : undefined}
                    aria-invalid={errors.dateOfBirthMonth ? "true" : "false"}
                    aria-describedby="dateOfBirthMonthErrorMessage"
                    {...register("dateOfBirthMonth", {
                      required: `${orderedInputNameToLabel["dateOfBirthMonth"]} is required`,
                    })}
                  >
                    <option value="1">01 - January</option>
                    <option value="2">02 - February</option>
                    <option value="3">03 - March</option>
                    <option value="4">04 - April</option>
                    <option value="5">05 - May</option>
                    <option value="6">06 - June</option>
                    <option value="7">07 - July</option>
                    <option value="8">08 - August</option>
                    <option value="9">09 - September</option>
                    <option value="10">10 - October</option>
                    <option value="11">11 - November</option>
                    <option value="12">12 - December</option>
                  </Select>
                </FormGroup>
                <FormGroup className="usa-form-group--day">
                  <Label htmlFor={"dateOfBirthDay"} requiredMarker>
                    {orderedInputNameToLabel["dateOfBirthDay"]}
                  </Label>
                  <TextInput
                    id={"dateOfBirthDay"}
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={2}
                    minLength={2}
                    required
                    validationStatus={errors.dateOfBirthDay ? "error" : undefined}
                    aria-invalid={errors.dateOfBirthDay ? "true" : "false"}
                    aria-describedby="dateOfBirthDayErrorMessage"
                    {...register("dateOfBirthDay", {
                      required: `${orderedInputNameToLabel["dateOfBirthDay"]} is required`,
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: `${orderedInputNameToLabel["dateOfBirthDay"]} must be between 1 and 31`,
                      },
                      max: {
                        value: 31,
                        message: `${orderedInputNameToLabel["dateOfBirthDay"]} must be between 1 and 31`,
                      },
                      validate: (value) => {
                        if (value === null) {
                          return `${orderedInputNameToLabel["dateOfBirthDay"]} is required`;
                        }
                        if (Number.isNaN(value) || typeof value === "string") {
                          return `${orderedInputNameToLabel["dateOfBirthDay"]} must be a number`;
                        }
                        return true;
                      },
                    })}
                  />
                </FormGroup>
                <FormGroup className="usa-form-group--year">
                  <Label htmlFor="dateOfBirthYear" requiredMarker>
                    {orderedInputNameToLabel["dateOfBirthYear"]}
                  </Label>
                  <TextInput
                    id="dateOfBirthYear"
                    type="text"
                    maxLength={4}
                    minLength={4}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    required
                    validationStatus={errors.dateOfBirthYear ? "error" : undefined}
                    aria-invalid={errors.dateOfBirthYear ? "true" : "false"}
                    aria-describedby="dateOfBirthYearErrorMessage"
                    {...register("dateOfBirthYear", {
                      required: `${orderedInputNameToLabel["dateOfBirthYear"]} is required`,
                      valueAsNumber: true,
                      validate: (value) => {
                        if (value === null) {
                          return `${orderedInputNameToLabel["dateOfBirthYear"]} is required`;
                        }
                        if (Number.isNaN(value) || typeof value === "string") {
                          return `${orderedInputNameToLabel["dateOfBirthYear"]} must be a number`;
                        }
                        if ((value as number).toString().length !== 4) {
                          return `${orderedInputNameToLabel["dateOfBirthYear"]} must have four digits`;
                        }
                        return true;
                      },
                    })}
                  />
                </FormGroup>
              </DateInputGroup>
              {errors.dateOfBirthMonth && (
                <div id="dateOfBirthMonthErrorMessage" className="usa-error-message">
                  {errors.dateOfBirthMonth.message}
                </div>
              )}
              {errors.dateOfBirthDay && (
                <div id="dateOfBirthDayErrorMessage" className="usa-error-message">
                  {errors.dateOfBirthDay.message}
                </div>
              )}
              {errors.dateOfBirthYear && (
                <div id="dateOfBirthYearErrorMessage" className="usa-error-message">
                  {errors.dateOfBirthYear.message}
                </div>
              )}
            </Fieldset>
            <Label htmlFor="socialSecurityNumber" requiredMarker>
              {orderedInputNameToLabel["socialSecurityNumber"]}
            </Label>
            <p id="socialSecurityNumberHint" className="usa-hint">
              Format XXX-XX-XXXX
            </p>
            <TextInputMask
              id="socialSecurityNumber"
              type="text"
              inputMode="numeric"
              value={socialSecurityNumber ?? ""}
              mask="___-__-____"
              pattern="\d{3}-\d{2}-\d{4}"
              required
              validationStatus={errors.socialSecurityNumber ? "error" : undefined}
              aria-invalid={errors.socialSecurityNumber ? "true" : "false"}
              aria-describedby={`${errors.socialSecurityNumber ? "socialSecurityNumberErrorMessage" : ""} socialSecurityNumberHint`}
              {...register("socialSecurityNumber", {
                required: `${orderedInputNameToLabel["socialSecurityNumber"]} is required`,
                pattern: {
                  value: /\d{3}-\d{2}-\d{4}/,
                  message: "Entered value does not match social security number format",
                },
              })}
            />
            {errors.socialSecurityNumber && (
              <span id="socialSecurityNumberErrorMessage" className="usa-error-message">
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
              <span id="emailErrorMessage" className="usa-error-message">
                {errors.email.message}
              </span>
            )}

            <Label htmlFor="phoneNumber" requiredMarker>
              {orderedInputNameToLabel["phoneNumber"]}
            </Label>
            <TextInputMask
              id="phoneNumber"
              type="tel"
              value={phoneNumber ?? ""}
              inputMode="numeric"
              mask="___-___-____"
              pattern="\d{3}-\d{3}-\d{4}"
              required
              validationStatus={errors.phoneNumber ? "error" : undefined}
              aria-invalid={errors.phoneNumber ? "true" : "false"}
              aria-describedby={errors.phoneNumber && "phoneNumberErrorMessage"}
              {...register("phoneNumber", {
                required: `${orderedInputNameToLabel["phoneNumber"]} is required`,
                pattern: {
                  value: /\d{3}-\d{3}-\d{4}/,
                  message: "Entered value does not match phone number format",
                },
              })}
            />
            {errors.phoneNumber && (
              <span id="phoneNumberErrorMessage" className="usa-error-message">
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
