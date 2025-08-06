"use client";

import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { type PersonalDetails2Data } from "@form/(formSteps)/personal-details/PersonalDetailsData";
import { routeToNextStep, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { AddressState } from "@form/_utils/inputFields/enums";
import { getValue, setKeyValue } from "@form/_utils/sessionStorage";
import { Fieldset, Form, Label, Select, TextInput } from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form";

const orderedInputNameToLabel: { [key in keyof PersonalDetails2Data]: string } = {
  streetAddress1: "Street address 1",
  streetAddress2: "Street address line 2",
  city: "City",
  state: "State",
  zip: "ZIP code",
};

const PersonalDetailsStep2 = () => {
  const [dataHasLoaded, setDataHasLoaded] = useState<boolean>(false);
  const router = useRouter();
  const formProgressPosition = useFormProgressPosition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<PersonalDetails2Data>({
    defaultValues: {
      streetAddress1: getValue("streetAddress1") || "",
      streetAddress2: getValue("streetAddress2") || "",
      city: getValue("city") || "",
      state: getValue("state") || "NJ",
      zip: getValue("zip") || "",
    },
    shouldFocusError: false,
  });
  const [shouldSummarizeErrors, setShouldSummarizeErrors] = useState(false);
  const errorSummaryRef = useRef<HTMLInputElement>(null);

  const onSubmit: SubmitHandler<PersonalDetails2Data> = (data) => {
    for (const key in data) {
      const value = data[key as keyof PersonalDetails2Data] ?? "";
      setKeyValue(key, value);
    }
    routeToNextStep(router, formProgressPosition);
  };
  const onError: SubmitErrorHandler<PersonalDetails2Data> = (errors) => {
    if (Object.keys(errors).length >= 3) {
      setShouldSummarizeErrors(true);
      errorSummaryRef.current?.focus();
    } else {
      setShouldSummarizeErrors(false);
      for (const inputName of Object.keys(orderedInputNameToLabel) as Array<
        keyof PersonalDetails2Data
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
                      {Object.entries(errors).map(([field, error]) => (
                        <li key={field}>{error.message}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <h2 className="font-heading-md">Mailing address</h2>
            <p className="usa-hint">
              This is the location where you want to receive official mail.
            </p>
            <Fieldset legend="Mailing address" legendStyle="srOnly">
              <div className="grid-row grid-gap">
                <div className="mobile-lg:grid-col-6">
                  <Label htmlFor="streetAddress1" requiredMarker>
                    {orderedInputNameToLabel["streetAddress1"]}
                  </Label>
                  <TextInput
                    id="streetAddress1"
                    type="text"
                    required
                    validationStatus={errors.streetAddress1 ? "error" : undefined}
                    aria-invalid={errors.streetAddress1 ? "true" : "false"}
                    aria-describedby={errors.streetAddress1 && "streetAddress1ErrorMessage"}
                    {...register("streetAddress1", {
                      required: `${orderedInputNameToLabel["streetAddress1"]} is required`,
                    })}
                  />
                  {errors.streetAddress1 && (
                    <span
                      id="streetAddress1ErrorMessage"
                      className="usa-error-message"
                      role="alert"
                    >
                      {errors.streetAddress1.message}
                    </span>
                  )}
                </div>
                <div className="mobile-lg:grid-col-6">
                  <Label htmlFor="streetAddress2">
                    {orderedInputNameToLabel["streetAddress2"]}
                  </Label>
                  <TextInput id="streetAddress2" type="text" {...register("streetAddress2")} />
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
                    required
                    validationStatus={errors.city ? "error" : undefined}
                    aria-invalid={errors.city ? "true" : "false"}
                    aria-describedby={errors.city && "cityErrorMessage"}
                    {...register("city", {
                      required: `${orderedInputNameToLabel["city"]} is required`,
                    })}
                  />
                  {errors.city && (
                    <span id="cityErrorMessage" className="usa-error-message" role="alert">
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
                  <Select className="usa-select" id="state" required {...register("state")}>
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
                  <TextInput
                    className="usa-input--medium"
                    id="zip"
                    type="text"
                    required
                    validationStatus={errors.zip ? "error" : undefined}
                    aria-invalid={errors.zip ? "true" : "false"}
                    aria-describedby={errors.zip && "zipErrorMessage"}
                    {...register("zip", {
                      required: `${orderedInputNameToLabel["zip"]} is required`,
                    })}
                  />
                  {errors.zip && (
                    <span id="zipErrorMessage" className="usa-error-message" role="alert">
                      {errors.zip.message}
                    </span>
                  )}
                </div>
              </div>
            </Fieldset>
          </div>
          <FormProgressButtons />
        </Form>
      )}
    </div>
  );
};

export default PersonalDetailsStep2;
