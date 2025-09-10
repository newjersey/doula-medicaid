"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import DoulaTextInput from "@/app/form/(formSteps)/components/DoulaTextInput";
import DoulaTextInputMask from "@/app/form/(formSteps)/components/DoulaTextInputMask";
import DoulaYesNoRadio from "@/app/form/(formSteps)/components/DoulaYesNoRadio";
import FormProgressButtons from "@/app/form/(formSteps)/components/FormProgressButtons";
import PublicInformationExplainer from "@/app/form/(formSteps)/personal-details/2/PublicInformationExplainer";
import { typecheckAutocomplete } from "@/app/form/_utils/types/autocomplete";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import { type PersonalDetails2Data } from "@form/(formSteps)/personal-details/PersonalDetailsData";
import { AddressState } from "@form/_utils/inputFields/enums";
import { getDefaultValue } from "@form/_utils/sessionStorage";
import { Fieldset, Label, Select } from "@trussworks/react-uswds";
import { useForm } from "react-hook-form";

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

const mayHaveThreeOrMoreErrors = true;
const PersonalDetailsStep2 = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<PersonalDetails2Data>({
    defaultValues: {
      streetAddress1: getDefaultValue("streetAddress1") ?? "",
      streetAddress2: getDefaultValue("streetAddress2") ?? "",
      city: getDefaultValue("city") ?? "",
      state: getDefaultValue("state") ?? "NJ",
      zip: getDefaultValue("zip") ?? "",
      hasSameBillingMailingAddress: getDefaultValue("hasSameBillingMailingAddress") ?? "",
      billingStreetAddress1: getDefaultValue("billingStreetAddress1") ?? "",
      billingStreetAddress2: getDefaultValue("billingStreetAddress2") ?? "",
      billingCity: getDefaultValue("billingCity") ?? "",
      billingState: getDefaultValue("billingState") ?? "NJ",
      billingZip: getDefaultValue("billingZip") ?? "",
    },
    shouldFocusError: !mayHaveThreeOrMoreErrors,
  });

  const zip = watch("zip");
  const billingZip = watch("billingZip");
  const hasSameBillingMailingAddress = watch("hasSameBillingMailingAddress");

  return (
    <DoulaForm<PersonalDetails2Data>
      orderedInputNameToLabel={orderedInputNameToLabel}
      errors={errors}
      setFocus={setFocus}
      handleSubmit={handleSubmit}
      mayHaveThreeOrMoreErrors={mayHaveThreeOrMoreErrors}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <div>
            <Fieldset
              legend={
                <div>
                  <h2 className="font-heading-md">Mailing address</h2>
                  <p className="usa-hint">
                    We will send official mail here. It can be your home address.
                  </p>
                </div>
              }
            >
              <div className="grid-row grid-gap">
                <div className="mobile-lg:grid-col-6">
                  <DoulaTextInput
                    name="streetAddress1"
                    label={orderedInputNameToLabel["streetAddress1"]}
                    autoComplete={typecheckAutocomplete("shipping address-line1")}
                    required
                    errors={errors}
                    register={register}
                    registerOptions={{
                      required: `${orderedInputNameToLabel["streetAddress1"]} is required`,
                    }}
                  />
                </div>
                <div className="mobile-lg:grid-col-6">
                  <DoulaTextInput
                    name="streetAddress2"
                    label={orderedInputNameToLabel["streetAddress2"]}
                    autoComplete={typecheckAutocomplete("shipping address-line2")}
                    register={register}
                  />
                </div>
              </div>
              <div className="grid-row grid-gap">
                <div className="mobile-lg:grid-col-6">
                  <DoulaTextInput
                    name="city"
                    label={orderedInputNameToLabel["city"]}
                    autoComplete={typecheckAutocomplete("shipping address-level2")}
                    required
                    errors={errors}
                    register={register}
                    registerOptions={{
                      required: `${orderedInputNameToLabel["city"]} is required`,
                    }}
                  />
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
                  <DoulaTextInputMask
                    className="usa-input--medium"
                    name="zip"
                    label={orderedInputNameToLabel["zip"]}
                    autoComplete={typecheckAutocomplete("shipping postal-code")}
                    value={zip ?? ""}
                    mask="#####"
                    pattern="\d{5}"
                    required
                    errors={errors}
                    register={register}
                    registerOptions={{
                      required: `${orderedInputNameToLabel["zip"]} is required`,
                      minLength: {
                        value: 5,
                        message: `${orderedInputNameToLabel["zip"]} must have five digits`,
                      },
                    }}
                  />
                </div>
              </div>
            </Fieldset>
          </div>
          <div className="margin-top-5">
            <h2 className="font-heading-md">Billing address</h2>
            <p className="usa-hint">
              This is the location where you want to receive your payments.
            </p>
            <DoulaYesNoRadio
              name="hasSameBillingMailingAddress"
              value={hasSameBillingMailingAddress}
              label={orderedInputNameToLabel["hasSameBillingMailingAddress"]}
              required
              register={register}
              errors={errors}
            />

            {hasSameBillingMailingAddress === "false" && (
              <Fieldset legend={<p className="margin-top-5">What&apos;s your billing address?</p>}>
                <div className="grid-row grid-gap">
                  <div className="mobile-lg:grid-col-6">
                    <DoulaTextInput
                      name="billingStreetAddress1"
                      label={orderedInputNameToLabel["billingStreetAddress1"]}
                      required
                      errors={errors}
                      register={register}
                      registerOptions={{
                        required: `Billing ${orderedInputNameToLabel["billingStreetAddress1"].toLowerCase()} is required`,
                      }}
                    />
                  </div>
                  <div className="mobile-lg:grid-col-6">
                    <DoulaTextInput
                      name="billingStreetAddress2"
                      label={orderedInputNameToLabel["billingStreetAddress2"]}
                      register={register}
                    />
                  </div>
                </div>
                <div className="grid-row grid-gap">
                  <div className="mobile-lg:grid-col-6">
                    <DoulaTextInput
                      name="billingCity"
                      label={orderedInputNameToLabel["billingCity"]}
                      required
                      errors={errors}
                      register={register}
                      registerOptions={{
                        required: `Billing ${orderedInputNameToLabel["billingCity"].toLowerCase()} is required`,
                      }}
                    />
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
                    <DoulaTextInputMask
                      className="usa-input--medium"
                      name="billingZip"
                      label={orderedInputNameToLabel["billingZip"]}
                      value={billingZip ?? ""}
                      mask="#####"
                      pattern="\d{5}"
                      required
                      errors={errors}
                      register={register}
                      registerOptions={{
                        required: `Billing ${orderedInputNameToLabel["billingZip"].toLowerCase()} is required`,
                        minLength: {
                          value: 5,
                          message: `Billing ${orderedInputNameToLabel["billingZip"].toLowerCase()} must have five digits`,
                        },
                      }}
                    />
                  </div>
                </div>
              </Fieldset>
            )}
          </div>
        </div>

        <div className="form-explainer desktop:grid-col-4">
          <PublicInformationExplainer />
        </div>
      </div>
      <HorizontalDivider />
      <FormProgressButtons />
    </DoulaForm>
  );
};
export default PersonalDetailsStep2;
