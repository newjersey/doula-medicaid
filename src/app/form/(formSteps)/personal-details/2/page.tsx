"use client";

import ErrorSummary from "@/app/form/(formSteps)/components/ErrorSummary";
import PublicInformationExplainer from "@/app/form/(formSteps)/personal-details/2/PublicInformationExplainer";
import { typecheckAutocomplete } from "@/app/form/_utils/types/autocomplete";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { type PersonalDetails2Data } from "@form/(formSteps)/personal-details/PersonalDetailsData";
import { routeToNextStep, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { AddressState } from "@form/_utils/inputFields/enums";
import { getDefaultValue, setKeyValue } from "@form/_utils/sessionStorage";
import {
  Fieldset,
  Form,
  Label,
  Radio,
  RequiredMarker,
  Select,
  TextInput,
  TextInputMask,
} from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitErrorHandler, type SubmitHandler } from "react-hook-form";

const orderedInputNameToLabel: { [key in keyof PersonalDetails2Data]: string } = {
  streetAddress1: "Street address",
  streetAddress2: "Street address line 2",
  city: "City",
  state: "State",
  zip: "ZIP code",
  hasSameBillingMailingAddress: "Are your billing and residential addresses the same?",
  billingStreetAddress1: "Street address",
  billingStreetAddress2: "Street address line 2",
  billingCity: "City",
  billingState: "State",
  billingZip: "ZIP code",
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
    watch,
  } = useForm<PersonalDetails2Data>({
    defaultValues: {
      streetAddress1: getDefaultValue("streetAddress1") || "",
      streetAddress2: getDefaultValue("streetAddress2") || "",
      city: getDefaultValue("city") || "",
      state: getDefaultValue("state") || "NJ",
      zip: getDefaultValue("zip") || "",
      hasSameBillingMailingAddress: getDefaultValue("hasSameBillingMailingAddress") || "",
      billingStreetAddress1: getDefaultValue("billingStreetAddress1") || "",
      billingStreetAddress2: getDefaultValue("billingStreetAddress2") || "",
      billingCity: getDefaultValue("billingCity") || "",
      billingState: getDefaultValue("billingState") || "NJ",
      billingZip: getDefaultValue("billingZip") || "",
    },
    shouldFocusError: false,
  });
  const [shouldSummarizeErrors, setShouldSummarizeErrors] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const zip = watch("zip");
  const billingZip = watch("billingZip");
  const hasSameBillingMailingAddress = watch("hasSameBillingMailingAddress");

  const onSubmit: SubmitHandler<PersonalDetails2Data> = (data) => {
    let key: keyof PersonalDetails2Data;
    for (key in data) {
      const value = data[key] ?? "";
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
          <div className="form-grid">
            <div>
              <ErrorSummary<PersonalDetails2Data>
                shouldSummarizeErrors={shouldSummarizeErrors}
                errors={errors}
                ref={errorSummaryRef}
                setFocus={setFocus}
              />
              <h2 className="font-heading-md">Mailing address</h2>
              <p className="usa-hint">
                We will send official mail here. It can be your home address.
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
                      autoComplete={typecheckAutocomplete("shipping address-line1")}
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
                      autoComplete={typecheckAutocomplete("shipping address-line2")}
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
                      autoComplete={typecheckAutocomplete("shipping address-level2")}
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
                      autoComplete={typecheckAutocomplete("shipping address-level1")}
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
                      autoComplete={typecheckAutocomplete("shipping postal-code")}
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
            <div className="form-explainer">
              <PublicInformationExplainer />
            </div>
            <div>
              <h2 className="font-heading-md">Billing address</h2>
              <p className="usa-hint">
                This is the location where you want to receive your payments.
              </p>
              <Fieldset
                legend={
                  <div>
                    <p className="font-ui-xs text-normal">
                      {orderedInputNameToLabel["hasSameBillingMailingAddress"]}
                    </p>
                    <p className="font-ui-xs text-normal">
                      Select one <RequiredMarker />
                    </p>
                  </div>
                }
              >
                <Radio
                  id="sameBillingMailingAddressYes"
                  label="Yes"
                  value="true"
                  checked={hasSameBillingMailingAddress === "true"}
                  required
                  {...register("hasSameBillingMailingAddress", {
                    required: `This question is required`,
                  })}
                  aria-invalid={errors.hasSameBillingMailingAddress ? "true" : "false"}
                  aria-describedby={
                    errors.hasSameBillingMailingAddress &&
                    "hasSameBillingMailingAddressErrorMessage"
                  }
                />
                <Radio
                  id="sameBillingMailingAddressNo"
                  label="No"
                  value="false"
                  checked={hasSameBillingMailingAddress === "false"}
                  required
                  {...register("hasSameBillingMailingAddress", {
                    required: `This question is required`,
                  })}
                  aria-invalid={errors.hasSameBillingMailingAddress ? "true" : "false"}
                  aria-describedby={
                    errors.hasSameBillingMailingAddress &&
                    "hasSameBillingMailingAddressErrorMessage"
                  }
                />
                {errors.hasSameBillingMailingAddress && (
                  <span
                    id="hasSameBillingMailingAddressErrorMessage"
                    className="usa-error-message"
                    role="alert"
                  >
                    {errors.hasSameBillingMailingAddress.message}
                  </span>
                )}
              </Fieldset>

              {hasSameBillingMailingAddress === "false" && (
                <Fieldset
                  legend={
                    <p className="font-ui-xs text-normal margin-top-5">
                      What&apos;s your billing address?
                    </p>
                  }
                >
                  <div className="grid-row grid-gap">
                    <div className="mobile-lg:grid-col-6">
                      <Label htmlFor="billingStreetAddress1" requiredMarker>
                        {orderedInputNameToLabel["billingStreetAddress1"]}
                      </Label>
                      <TextInput
                        id="billingStreetAddress1"
                        type="text"
                        required
                        validationStatus={errors.billingStreetAddress1 ? "error" : undefined}
                        aria-invalid={errors.billingStreetAddress1 ? "true" : "false"}
                        aria-describedby={
                          errors.billingStreetAddress1 && "billingStreetAddress1ErrorMessage"
                        }
                        {...register("billingStreetAddress1", {
                          required: `Billing ${orderedInputNameToLabel["billingStreetAddress1"].toLowerCase()} is required`,
                        })}
                      />
                      {errors.billingStreetAddress1 && (
                        <span
                          id="billingStreetAddress1ErrorMessage"
                          className="usa-error-message"
                          role="alert"
                        >
                          {errors.billingStreetAddress1.message}
                        </span>
                      )}
                    </div>
                    <div className="mobile-lg:grid-col-6">
                      <Label htmlFor="billingStreetAddress2">
                        {orderedInputNameToLabel["billingStreetAddress2"]}
                      </Label>
                      <TextInput
                        id="billingStreetAddress2"
                        type="text"
                        {...register("billingStreetAddress2")}
                      />
                    </div>
                  </div>
                  <div className="grid-row grid-gap">
                    <div className="mobile-lg:grid-col-6">
                      <Label htmlFor="billingCity" requiredMarker>
                        {orderedInputNameToLabel["billingCity"]}
                      </Label>
                      <TextInput
                        id="billingCity"
                        type="text"
                        required
                        validationStatus={errors.billingCity ? "error" : undefined}
                        aria-invalid={errors.billingCity ? "true" : "false"}
                        aria-describedby={errors.billingCity && "billingCityErrorMessage"}
                        {...register("billingCity", {
                          required: `Billing ${orderedInputNameToLabel["billingCity"].toLowerCase()} is required`,
                        })}
                      />
                      {errors.billingCity && (
                        <span
                          id="billingCityErrorMessage"
                          className="usa-error-message"
                          role="alert"
                        >
                          {errors.billingCity.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid-row grid-gap">
                    <div className="mobile-lg:grid-col-6">
                      <Label htmlFor="billingState" requiredMarker>
                        {orderedInputNameToLabel["billingState"]}
                      </Label>
                      <Select
                        className="usa-select"
                        id="billingState"
                        required
                        {...register("billingState")}
                      >
                        {Object.keys(AddressState).map((billingState) => (
                          <option key={billingState} value={billingState}>
                            {billingState}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="mobile-lg:grid-col-4">
                      <Label htmlFor="billingZip" requiredMarker>
                        {orderedInputNameToLabel["billingZip"]}
                      </Label>
                      <TextInputMask
                        className="usa-input--medium"
                        id="billingZip"
                        type="text"
                        value={billingZip ?? ""}
                        mask="#####"
                        pattern="\d{5}"
                        required
                        validationStatus={errors.billingZip ? "error" : undefined}
                        aria-invalid={errors.billingZip ? "true" : "false"}
                        aria-describedby={errors.billingZip && "billingZipErrorMessage"}
                        {...register("billingZip", {
                          required: `Billing ${orderedInputNameToLabel["billingZip"].toLowerCase()} is required`,
                          minLength: {
                            value: 5,
                            message: `Billing ${orderedInputNameToLabel["billingZip"].toLowerCase()} must have five digits`,
                          },
                        })}
                      />
                      {errors.billingZip && (
                        <span id="billingZipErrorMessage" className="usa-error-message">
                          {errors.billingZip.message}
                        </span>
                      )}
                    </div>
                  </div>
                </Fieldset>
              )}
            </div>
          </div>
          <FormProgressButtons />
        </Form>
      )}
    </div>
  );
};

export default PersonalDetailsStep2;
