"use client";

import type { BusinessDetails1Data } from "@/app/form/(formSteps)/business-details/BusinessDetailsData";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { AddressState } from "@form/_utils/inputFields/enums";
import { Fieldset, Label, Radio, RequiredMarker, Select, TextInput } from "@trussworks/react-uswds";
import { useForm } from "react-hook-form";

const orderedInputNameToLabel: { [key in keyof BusinessDetails1Data]: string } = {
  hasSameBusinessAddress:
    "Is your business address the same as your residential and billing address?",
  businessStreetAddress1: "Street address",
  businessStreetAddress2: "Street address line 2",
  businessCity: "City",
  businessState: "State",
  businessZip: "ZIP code",
};

const mayHaveThreeOrMoreErrors = false;
const BusinessDetails1 = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setFocus,
  } = useForm<BusinessDetails1Data>({
    defaultValues: {
      hasSameBusinessAddress: "",
      businessStreetAddress1: "",
      businessStreetAddress2: "",
      businessCity: "",
      businessState: "NJ",
      businessZip: "",
    },
    shouldFocusError: !mayHaveThreeOrMoreErrors,
  });

  const hasSameBusinessAddress = watch("hasSameBusinessAddress");

  return (
    <DoulaForm<BusinessDetails1Data>
      orderedInputNameToLabel={orderedInputNameToLabel}
      errors={errors}
      setFocus={setFocus}
      handleSubmit={handleSubmit}
      mayHaveThreeOrMoreErrors={mayHaveThreeOrMoreErrors}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md margin-top-5">Business address</h2>
          <p className="usa-hint">This is the physical location where your business operates.</p>
          <Fieldset
            legend={
              <div className="usa-label">
                <p className="font-ui-xs text-normal">
                  Is your business address the same as your residential and billing address?
                </p>
                <p className="font-ui-xs text-normal">
                  Select one <RequiredMarker />
                </p>
              </div>
            }
            legendStyle="large"
          >
            <Radio
              id="sameBusinessAddressYes"
              label="Yes"
              value="true"
              {...register("hasSameBusinessAddress")}
            />
            <Radio
              id="sameBusinessAddressNo"
              label="No"
              value="false"
              {...register("hasSameBusinessAddress")}
            />
          </Fieldset>
        </div>

        {hasSameBusinessAddress === "false" && (
          <Fieldset legend="Business address" legendStyle="srOnly">
            <div className="grid-row grid-gap">
              <div className="mobile-lg:grid-col-6">
                <Label requiredMarker htmlFor="businessStreetAddress1">
                  {orderedInputNameToLabel["businessStreetAddress1"]}
                </Label>
                <TextInput
                  id="businessStreetAddress1"
                  type="text"
                  required
                  {...register("businessStreetAddress1")}
                />
              </div>
              <div className="mobile-lg:grid-col-6">
                <Label htmlFor="businessStreetAddress2">
                  {" "}
                  {orderedInputNameToLabel["businessStreetAddress2"]}
                </Label>
                <TextInput
                  id="businessStreetAddress2"
                  type="text"
                  {...register("businessStreetAddress2")}
                />
              </div>
            </div>
            <div className="grid-row grid-gap">
              <div className="mobile-lg:grid-col-6">
                <Label requiredMarker htmlFor="businessCity">
                  {orderedInputNameToLabel["businessCity"]}
                </Label>
                <TextInput
                  className="usa-input"
                  id="businessCity"
                  type="text"
                  required
                  {...register("businessCity")}
                />
              </div>
            </div>
            <div className="grid-row grid-gap">
              <div className="mobile-lg:grid-col-6">
                <Label requiredMarker htmlFor="businessState">
                  {orderedInputNameToLabel["businessState"]}
                </Label>
                <Select
                  className="usa-select"
                  id="businessState"
                  required
                  {...register("businessState")}
                >
                  {Object.keys(AddressState).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="mobile-lg:grid-col-4">
                <Label requiredMarker htmlFor="businessZip">
                  {orderedInputNameToLabel["businessZip"]}
                </Label>
                <TextInput
                  className="usa-input usa-input--medium"
                  id="businessZip"
                  type="text"
                  pattern="[\d]{5}(-[\d]{4})?"
                  required
                  {...register("businessZip")}
                />
              </div>
            </div>
          </Fieldset>
        )}
      </div>
      <FormProgressButtons />
    </DoulaForm>
  );
};

export default BusinessDetails1;
