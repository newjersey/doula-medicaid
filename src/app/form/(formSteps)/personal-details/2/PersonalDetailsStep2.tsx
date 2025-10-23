"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { DoulaAddress } from "@/app/form/(formSteps)/components/DoulaAddress";
import DoulaYesNoRadio from "@/app/form/(formSteps)/components/DoulaYesNoRadio";
import FormProgressButtons from "@/app/form/(formSteps)/components/FormProgressButtons";
import PublicInformationExplainer from "@/app/form/(formSteps)/personal-details/2/PublicInformationExplainer";
import { getDefaultValue } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import { type PersonalDetails2Data } from "@form/(formSteps)/personal-details/PersonalDetailsData";
import { useForm, type FieldPath } from "react-hook-form";

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
  const { dataStore } = useDataStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<PersonalDetails2Data>({
    defaultValues: {
      streetAddress1: getDefaultValue(dataStore, "streetAddress1") ?? "",
      streetAddress2: getDefaultValue(dataStore, "streetAddress2") ?? "",
      city: getDefaultValue(dataStore, "city") ?? "",
      state: getDefaultValue(dataStore, "state") ?? "NJ",
      zip: getDefaultValue(dataStore, "zip") ?? "",
      hasSameBillingMailingAddress:
        getDefaultValue(dataStore, "hasSameBillingMailingAddress") ?? "",
      billingStreetAddress1: getDefaultValue(dataStore, "billingStreetAddress1") ?? "",
      billingStreetAddress2: getDefaultValue(dataStore, "billingStreetAddress2") ?? "",
      billingCity: getDefaultValue(dataStore, "billingCity") ?? "",
      billingState: getDefaultValue(dataStore, "billingState") ?? "NJ",
      billingZip: getDefaultValue(dataStore, "billingZip") ?? "",
    },
    shouldFocusError: !mayHaveThreeOrMoreErrors,
  });

  const zip = watch("zip");
  const billingZip = watch("billingZip");
  const hasSameBillingMailingAddress = watch("hasSameBillingMailingAddress");

  return (
    <DoulaForm<PersonalDetails2Data>
      orderedInputNames={
        Object.keys(orderedInputNameToLabel) as Array<FieldPath<PersonalDetails2Data>>
      }
      errors={errors}
      setFocus={setFocus}
      handleSubmit={handleSubmit}
      mayHaveThreeOrMoreErrors={mayHaveThreeOrMoreErrors}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <div>
            <DoulaAddress<PersonalDetails2Data>
              fieldsetProps={{
                legend: (
                  <div>
                    <h2 className="font-heading-md">Mailing address</h2>
                    <p className="usa-hint">
                      We will send official mail here. It can be your home address.
                    </p>
                  </div>
                ),
              }}
              addressKeys={{
                streetAddress1: "streetAddress1",
                streetAddress2: "streetAddress2",
                city: "city",
                state: "state",
                zip: "zip",
              }}
              zipValue={zip}
              autocomplete="shipping"
              orderedInputNameToLabel={orderedInputNameToLabel}
              errors={errors}
              register={register}
            />
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
              <DoulaAddress<PersonalDetails2Data>
                fieldsetProps={{
                  legend: <p className="margin-top-5">What is your billing address?</p>,
                }}
                addressKeys={{
                  streetAddress1: "billingStreetAddress1",
                  streetAddress2: "billingStreetAddress2",
                  city: "billingCity",
                  state: "billingState",
                  zip: "billingZip",
                }}
                zipValue={billingZip}
                orderedInputNameToLabel={orderedInputNameToLabel}
                errorLabelPrefix="Billing"
                errors={errors}
                register={register}
              />
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
