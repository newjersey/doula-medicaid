"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { formatAddressLabel } from "@/app/form/(formSteps)/business-details/1/_utils/formatAddressLabel";
import type { BusinessDetails1Data } from "@/app/form/(formSteps)/business-details/BusinessDetailsData";
import { DoulaAddress } from "@/app/form/(formSteps)/components/DoulaAddress";
import DoulaRadio, { type DoulaRadioOption } from "@/app/form/(formSteps)/components/DoulaRadio";
import SoleProprietorExplainer from "@/app/form/(formSteps)/components/SoleProprietorExplainer";
import {
  getAddressState,
  getBusinessAddressSameAsOtherAddress,
  getDefaultValue,
  getValue,
  ValueNotFoundError,
} from "@/app/form/_utils/dataStore";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const orderedInputNameToLabel: { [key in keyof BusinessDetails1Data]: string } = {
  businessAddressSameAsOtherAddress: "Is your business address the same as a previous address?",
  businessStreetAddress1: "Street address",
  businessStreetAddress2: "Street address line 2",
  businessCity: "City",
  businessState: "State",
  businessZip: "ZIP code",
};

const mayHaveThreeOrMoreErrors = true;
const BusinessDetails1 = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<BusinessDetails1Data>({
    defaultValues: {
      businessAddressSameAsOtherAddress: getBusinessAddressSameAsOtherAddress(false) ?? "",
      businessStreetAddress1: getDefaultValue("businessStreetAddress1") ?? "",
      businessStreetAddress2: getDefaultValue("businessStreetAddress2") ?? "",
      businessCity: getDefaultValue("businessCity") ?? "",
      businessState: getDefaultValue("businessState") ?? "NJ",
      businessZip: getDefaultValue("businessZip") ?? "",
    },
    shouldFocusError: !mayHaveThreeOrMoreErrors,
  });
  const businessAddressSameAsOtherAddress = watch("businessAddressSameAsOtherAddress");
  const businessZip = watch("businessZip");

  const [hasMissingAddress, setHasMissingAddress] = useState<boolean>(false);
  const [addressOptions, setAddressOptions] = useState<
    Array<DoulaRadioOption<BusinessDetails1Data>>
  >([]);
  useEffect(() => {
    try {
      setAddressOptions(getAddressOptions());
    } catch (e) {
      if (e instanceof ValueNotFoundError) {
        setHasMissingAddress(true);
      } else {
        throw e;
      }
    }
  }, []);
  if (hasMissingAddress) {
    return (
      <>
        <div className="margin-top-5 margin-bottom-5">
          Not all required fields have been filled out. Please fill all required fields.
        </div>
        <HorizontalDivider />
        <FormProgressButtons />
      </>
    );
  }

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
          <h2 className="font-heading-md">
            You verified that you manage your business as an individual doula operating as a Sole
            Proprietor.
          </h2>
          <p>
            Note:{" "}
            <span className="usa-hint">
              This beta site is for doulas operating as Sole Proprietors. If you have an LLC or
              another business type, use the standard{" "}
              <a
                href="https://www.njmmis.com/providerEnrollment.aspx"
                target="_blank"
                rel="noopener"
              >
                Medicaid Fee-for-Service application
              </a>
              .
            </span>
          </p>
        </div>
        <div className="form-explainer desktop:grid-col-4">
          <SoleProprietorExplainer />
        </div>
      </div>
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md">Business address</h2>
          <p className="usa-hint">Many doulas use their home address as their business address.</p>
          <DoulaRadio
            name="businessAddressSameAsOtherAddress"
            value={businessAddressSameAsOtherAddress}
            label={orderedInputNameToLabel["businessAddressSameAsOtherAddress"]}
            required
            options={addressOptions}
            errors={errors}
            register={register}
          />
          {businessAddressSameAsOtherAddress === "different" && (
            <DoulaAddress<BusinessDetails1Data>
              fieldsetProps={{
                legend: <p className="margin-top-5">What is your business address?</p>,
              }}
              addressKeys={{
                streetAddress1: "businessStreetAddress1",
                streetAddress2: "businessStreetAddress2",
                city: "businessCity",
                state: "businessState",
                zip: "businessZip",
              }}
              zipValue={businessZip}
              orderedInputNameToLabel={orderedInputNameToLabel}
              errors={errors}
              register={register}
            />
          )}
        </div>
      </div>
      <HorizontalDivider />
      <FormProgressButtons />
    </DoulaForm>
  );
};

const getAddressOptions = (): Array<DoulaRadioOption<BusinessDetails1Data>> => {
  const mailingOption = {
    label: (
      <div>
        <div>Mailing address:</div>
        {formatAddressLabel(
          getValue("streetAddress1", true),
          getValue("streetAddress2", false),
          getValue("city", true),
          getAddressState("state", true),
          getValue("zip", true),
        )}
      </div>
    ),
    value: "mailing",
  };

  const addressOptions: Array<DoulaRadioOption<BusinessDetails1Data>> = [mailingOption];

  const hasSameBillingMailingAddress = getValue("hasSameBillingMailingAddress", false);
  if (hasSameBillingMailingAddress === "false") {
    const billingOption = {
      label: (
        <div>
          <div>Billing address:</div>
          {formatAddressLabel(
            getValue("billingStreetAddress1", true),
            getValue("billingStreetAddress2", false),
            getValue("billingCity", true),
            getAddressState("billingState", true),
            getValue("billingZip", true),
          )}
        </div>
      ),
      value: "billing",
    };
    addressOptions.push(billingOption);
  }

  addressOptions.push({
    label: "I wish to enter a new address",
    value: "different",
  });
  return addressOptions;
};

export default BusinessDetails1;
