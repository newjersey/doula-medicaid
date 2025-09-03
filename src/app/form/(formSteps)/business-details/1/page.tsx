"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import type { BusinessDetails1Data } from "@/app/form/(formSteps)/business-details/BusinessDetailsData";
import DoulaTextInput from "@/app/form/(formSteps)/components/DoulaTextInput";
import DoulaYesNoRadio from "@/app/form/(formSteps)/components/DoulaYesNoRadio";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { AddressState } from "@form/_utils/inputFields/enums";
import { Fieldset, Label, Select } from "@trussworks/react-uswds";
import { useForm } from "react-hook-form";

const mayHaveThreeOrMoreErrors = false;
const BusinessDetails1 = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
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
      errors={errors}
      handleSubmit={handleSubmit}
      mayHaveThreeOrMoreErrors={mayHaveThreeOrMoreErrors}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md">Business address</h2>
          <p className="usa-hint">This is the physical location where your business operates.</p>
          <DoulaYesNoRadio
            name="hasSameBusinessAddress"
            value={hasSameBusinessAddress}
            label="Is your business address the same as your residential and billing address?"
            required
            register={register}
            errors={errors}
          />
        </div>
        {hasSameBusinessAddress === "false" && (
          <Fieldset legend="Business address" legendStyle="srOnly">
            <div className="grid-row grid-gap">
              <div className="mobile-lg:grid-col-6">
                <DoulaTextInput
                  name="businessStreetAddress1"
                  label="Street address"
                  required
                  register={register}
                />
              </div>
              <div className="mobile-lg:grid-col-6">
                <DoulaTextInput
                  name="businessStreetAddress2"
                  label="Street address line 2"
                  register={register}
                />
              </div>
            </div>
            <div className="grid-row grid-gap">
              <div className="mobile-lg:grid-col-6">
                <DoulaTextInput name="businessCity" label="City" required register={register} />
              </div>
            </div>
            <div className="grid-row grid-gap">
              <div className="mobile-lg:grid-col-6">
                <Label requiredMarker htmlFor="businessState">
                  State
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
                <DoulaTextInput
                  name="businessZip"
                  label="ZIP code"
                  pattern="[\d]{5}(-[\d]{4})?"
                  required
                  register={register}
                />
              </div>
            </div>
          </Fieldset>
        )}
      </div>
      <HorizontalDivider />
      <FormProgressButtons />
    </DoulaForm>
  );
};

export default BusinessDetails1;
