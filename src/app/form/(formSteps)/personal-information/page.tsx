"use client";

import JuiceShopExplainer from "@/app/form/(formSteps)/personal-information/JuiceShopExplainer";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { routeToNextStep, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { AddressState } from "@form/_utils/inputFields/enums";
import {
  DateInputGroup,
  Fieldset,
  Form,
  FormGroup,
  Label,
  Select,
  Textarea,
  TextInput,
  TextInputMask,
} from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { type SubmitErrorHandler, type SubmitHandler, useForm } from "react-hook-form";

export interface PersonalInformationData {
  juiceShopRelationship: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  dateOfBirthMonth: string | null;
  dateOfBirthDay: string | null;
  dateOfBirthYear: string | null;
  streetAddress1: string | null;
  streetAddress2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
}

const orderedInputNameToLabel: { [key in keyof PersonalInformationData]: string } = {
  juiceShopRelationship: "Juice shop relationship",
  firstName: "First name",
  middleName: "Middle name",
  lastName: "Last name",
  dateOfBirthMonth: "Month",
  dateOfBirthDay: "Day",
  dateOfBirthYear: "Year",
  streetAddress1: "Street address 1",
  streetAddress2: "Street address line 2",
  city: "City",
  state: "State",
  zip: "ZIP code",
};
const mailingAddressHeader = "Mailing address";

const PersonalInformationStep: React.FC = () => {
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
  } = useForm<PersonalInformationData>({
    defaultValues: {
      juiceShopRelationship: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirthMonth: "",
      dateOfBirthDay: "",
      dateOfBirthYear: "",
    },
    shouldFocusError: false,
  });
  const errorSummaryRef = useRef<HTMLInputElement>(null);
  const zip = watch("zip");

  const onSubmit: SubmitHandler<PersonalInformationData> = () => {
    routeToNextStep(router, formProgressPosition);
  };
  const onError: SubmitErrorHandler<PersonalInformationData> = (errors) => {
    if (Object.keys(errors).length >= 3) {
      setShouldSummarizeErrors(true);
      errorSummaryRef.current?.focus();
    } else {
      setShouldSummarizeErrors(false);
      for (const inputName of Object.keys(orderedInputNameToLabel) as Array<
        keyof PersonalInformationData
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
          <div className="form-grid">
            <div>
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
                                  setFocus(field as keyof PersonalInformationData);
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
              <h2 className="font-heading-md">Personal relationships</h2>
              <Label htmlFor="juiceShopRelationship">
                {orderedInputNameToLabel["juiceShopRelationship"]}
              </Label>
              <span className="usa-hint" id="juiceShopRelationshipHint">
                Describe your personal relationship with the juice shop.
              </span>
              <Textarea
                id="juiceShopRelationship"
                rows={2}
                aria-describedby="juiceShopRelationshipHint"
                {...register("juiceShopRelationship")}
              />
              {errors.juiceShopRelationship && (
                <span id="juiceShopRelationshipErrorMessage" className="usa-error-message">
                  {errors.juiceShopRelationship.message}
                </span>
              )}
            </div>

            <div>
              <JuiceShopExplainer />
            </div>
            <div>
              <hr className="margin-top-5 margin-bottom-5" />
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
                    autoComplete="given-name"
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
                  <TextInput
                    id="middleName"
                    type="text"
                    autoComplete="additional-name"
                    {...register("middleName")}
                  />
                </div>
                <div className="tablet:grid-col-4">
                  <Label htmlFor="lastName" requiredMarker>
                    {orderedInputNameToLabel["lastName"]}
                  </Label>
                  <TextInput
                    id="lastName"
                    type="text"
                    required
                    autoComplete="family-name"
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
                      autoComplete="bday-month"
                      validationStatus={errors.dateOfBirthMonth ? "error" : undefined}
                      aria-invalid={errors.dateOfBirthMonth ? "true" : "false"}
                      aria-describedby={errors.dateOfBirthMonth && "dateOfBirthMonthErrorMessage"}
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
                      autoComplete="bday-month"
                      validationStatus={errors.dateOfBirthDay ? "error" : undefined}
                      aria-invalid={errors.dateOfBirthDay ? "true" : "false"}
                      aria-describedby={errors.dateOfBirthDay && "dateOfBirthDayErrorMessage"}
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
                      autoComplete="bday-year"
                      validationStatus={errors.dateOfBirthYear ? "error" : undefined}
                      aria-invalid={errors.dateOfBirthYear ? "true" : "false"}
                      aria-describedby={errors.dateOfBirthYear && "dateOfBirthYearErrorMessage"}
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
              <hr className="margin-top-5 margin-bottom-5" />
              <h2 className="font-heading-md">{mailingAddressHeader}</h2>
              <Fieldset legend={mailingAddressHeader} legendStyle="srOnly">
                <div className="grid-row grid-gap">
                  <div className="mobile-lg:grid-col-6">
                    <Label htmlFor="streetAddress1" requiredMarker>
                      {orderedInputNameToLabel["streetAddress1"]}
                    </Label>
                    <TextInput
                      id="streetAddress1"
                      type="text"
                      autoComplete="shipping address-line1"
                      required
                      validationStatus={errors.streetAddress1 ? "error" : undefined}
                      aria-invalid={errors.streetAddress1 ? "true" : "false"}
                      aria-describedby={errors.streetAddress1 && "streetAddress1ErrorMessage"}
                      {...register("streetAddress1", {
                        required: `${orderedInputNameToLabel["streetAddress1"]} is required`,
                      })}
                    />
                    {errors.streetAddress1 && (
                      <span id="streetAddress1ErrorMessage" className="usa-error-message">
                        {errors.streetAddress1.message}
                      </span>
                    )}
                  </div>
                  <div className="mobile-lg:grid-col-6">
                    <Label htmlFor="streetAddress2">
                      {orderedInputNameToLabel["streetAddress2"]}
                    </Label>
                    <TextInput
                      id="streetAddress2"
                      type="text"
                      autoComplete="shipping address-line2"
                      {...register("streetAddress2")}
                    />
                  </div>
                </div>
                <div className="grid-row grid-gap">
                  <div className="mobile-lg:grid-col-6">
                    <Label htmlFor="city" requiredMarker>
                      {orderedInputNameToLabel["city"]}
                    </Label>
                    <TextInput
                      id="city"
                      type="text"
                      autoComplete="shipping address-level2"
                      required
                      validationStatus={errors.city ? "error" : undefined}
                      aria-invalid={errors.city ? "true" : "false"}
                      aria-describedby={errors.city && "cityErrorMessage"}
                      {...register("city", {
                        required: `${orderedInputNameToLabel["city"]} is required`,
                      })}
                    />
                    {errors.city && (
                      <span id="cityErrorMessage" className="usa-error-message">
                        {errors.city.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid-row grid-gap">
                  <div className="mobile-lg:grid-col-6">
                    <Label htmlFor="state" requiredMarker>
                      {orderedInputNameToLabel["state"]}
                    </Label>
                    <Select
                      className="usa-select"
                      id="state"
                      autoComplete="shipping address-level1"
                      required
                      {...register("state")}
                    >
                      {Object.keys(AddressState).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="mobile-lg:grid-col-4">
                    <Label htmlFor="zip" requiredMarker>
                      {orderedInputNameToLabel["zip"]}
                    </Label>
                    <TextInputMask
                      className="usa-input--medium"
                      id="zip"
                      type="text"
                      autoComplete="shipping postal-code"
                      value={zip ?? ""}
                      mask="#####"
                      pattern="\d{5}"
                      required
                      validationStatus={errors.zip ? "error" : undefined}
                      aria-invalid={errors.zip ? "true" : "false"}
                      aria-describedby={errors.zip && "zipErrorMessage"}
                      {...register("zip", {
                        required: `${orderedInputNameToLabel["zip"]} is required`,
                        minLength: {
                          value: 5,
                          message: `${orderedInputNameToLabel["zip"]} must have five digits`,
                        },
                      })}
                    />
                    {errors.zip && (
                      <span id="zipErrorMessage" className="usa-error-message">
                        {errors.zip.message}
                      </span>
                    )}
                  </div>
                </div>
              </Fieldset>
            </div>
            <div className="flex-1">
              <JuiceShopExplainer />
            </div>
          </div>
          <FormProgressButtons />
        </Form>
      )}
    </div>
  );
};

export default PersonalInformationStep;
