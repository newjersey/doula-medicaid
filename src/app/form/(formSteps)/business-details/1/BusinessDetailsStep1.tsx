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
  type DataStore,
} from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useForm, type FieldPath } from "react-hook-form";

const orderedInputNameToLabel: { [key in keyof BusinessDetails1Data]: string } = {
  businessAddressSameAsOtherAddress: "Is your business address the same as a previous address?",
  businessStreetAddress1: "Street address",
  businessStreetAddress2: "Street address line 2",
  businessCity: "City",
  businessState: "State",
  businessZip: "ZIP code",
};

const mayHaveThreeOrMoreErrors = true;
const BusinessDetailsStep1 = () => {
  const { dataStore } = useDataStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<BusinessDetails1Data>({
    defaultValues: {
      businessAddressSameAsOtherAddress:
        getBusinessAddressSameAsOtherAddress(dataStore, false) ?? "",
      businessStreetAddress1: getDefaultValue(dataStore, "businessStreetAddress1") ?? "",
      businessStreetAddress2: getDefaultValue(dataStore, "businessStreetAddress2") ?? "",
      businessCity: getDefaultValue(dataStore, "businessCity") ?? "",
      businessState: getDefaultValue(dataStore, "businessState") ?? "NJ",
      businessZip: getDefaultValue(dataStore, "businessZip") ?? "",
    },
    shouldFocusError: !mayHaveThreeOrMoreErrors,
  });
  const businessAddressSameAsOtherAddress = watch("businessAddressSameAsOtherAddress");
  const businessZip = watch("businessZip");

  let addressOptions = null;
  try {
    addressOptions = getAddressOptions(dataStore);
  } catch (e) {
    if (e instanceof ValueNotFoundError) {
    } else {
      throw e;
    }
  }

  if (addressOptions === null) {
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
      orderedInputNames={
        Object.keys(orderedInputNameToLabel) as Array<FieldPath<BusinessDetails1Data>>
      }
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
          <div className="usa-hint">
            <p>
              Medicaid wants to help clients find your services easily.{" "}
              <span className="text-bold">
                Many doulas use their home address as their business address.
              </span>
            </p>
            <p>
              If you use a PO box or a Private Mail Box, ensure the address matches the area where
              you work, and excludes the words “PO Box”. For example:
            </p>
            <div className="margin-top-0">
              <div>123 Main St</div>
              <div>
                <span className="text-bold">#456</span>
              </div>
              <div>Trenton, NJ 08601</div>
            </div>
          </div>
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

const getAddressOptions = (dataStore: DataStore): Array<DoulaRadioOption<BusinessDetails1Data>> => {
  const mailingOption = {
    label: (
      <div>
        <div>Mailing address:</div>
        {formatAddressLabel(
          getValue(dataStore, "streetAddress1", true),
          getValue(dataStore, "streetAddress2", false),
          getValue(dataStore, "city", true),
          getAddressState(dataStore, "state", true),
          getValue(dataStore, "zip", true),
        )}
      </div>
    ),
    value: "mailing",
  };

  const addressOptions: Array<DoulaRadioOption<BusinessDetails1Data>> = [mailingOption];

  const hasSameBillingMailingAddress = getValue(dataStore, "hasSameBillingMailingAddress", false);
  if (hasSameBillingMailingAddress === "false") {
    const billingOption = {
      label: (
        <div>
          <div>Billing address:</div>
          {formatAddressLabel(
            getValue(dataStore, "billingStreetAddress1", true),
            getValue(dataStore, "billingStreetAddress2", false),
            getValue(dataStore, "billingCity", true),
            getAddressState(dataStore, "billingState", true),
            getValue(dataStore, "billingZip", true),
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

export default BusinessDetailsStep1;
