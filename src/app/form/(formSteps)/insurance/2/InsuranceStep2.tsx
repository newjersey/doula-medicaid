"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { DoulaAddress } from "@/app/form/(formSteps)/components/DoulaAddress";
import DoulaTextInput from "@/app/form/(formSteps)/components/DoulaTextInput";
import type { Insurance2Data } from "@/app/form/(formSteps)/insurance/InsuranceData";
import { getDefaultValue } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useForm, type FieldPath } from "react-hook-form";

const orderedInputNameToLabel: { [key in keyof Insurance2Data]: string } = {
  insuranceCarrierName: "Name of your insurance carrier",
  insurancePolicyNumber: "Policy number",
  insuranceStreetAddress1: "Street address",
  insuranceStreetAddress2: "Street address line 2",
  insuranceCity: "City",
  insuranceState: "State",
  insuranceZip: "ZIP Code",
};

const mayHaveThreeOrMoreErrors = true;

const InsuranceStep2 = () => {
  const { dataStore } = useDataStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<Insurance2Data>({
    defaultValues: {
      insuranceCarrierName: getDefaultValue(dataStore, "insuranceCarrierName") ?? "",
      insurancePolicyNumber: getDefaultValue(dataStore, "insurancePolicyNumber") ?? "",
      insuranceStreetAddress1: getDefaultValue(dataStore, "insuranceStreetAddress1") ?? "",
      insuranceStreetAddress2: getDefaultValue(dataStore, "insuranceStreetAddress2") ?? "",
      insuranceCity: getDefaultValue(dataStore, "insuranceCity") ?? "",
      insuranceState: getDefaultValue(dataStore, "insuranceState") ?? "NJ",
      insuranceZip: getDefaultValue(dataStore, "insuranceZip") ?? "",
    },
    shouldFocusError: !mayHaveThreeOrMoreErrors,
  });
  const insuranceZip = watch("insuranceZip");

  return (
    <DoulaForm<Insurance2Data>
      orderedInputNames={Object.keys(orderedInputNameToLabel) as Array<FieldPath<Insurance2Data>>}
      errors={errors}
      setFocus={setFocus}
      handleSubmit={handleSubmit}
      mayHaveThreeOrMoreErrors={mayHaveThreeOrMoreErrors}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md">Insurance details</h2>
          <p className="usa-hint">Enter your current professional liability insurance.</p>

          <div className="tablet:grid-col-6">
            <DoulaTextInput
              name="insuranceCarrierName"
              label={orderedInputNameToLabel["insuranceCarrierName"]}
              required
              errors={errors}
              register={register}
            />
          </div>
          <div className="tablet:grid-col-6">
            <DoulaTextInput
              name="insurancePolicyNumber"
              label={orderedInputNameToLabel["insurancePolicyNumber"]}
              required
              errors={errors}
              register={register}
            />
          </div>
        </div>
      </div>
      <HorizontalDivider />
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <DoulaAddress<Insurance2Data>
            fieldsetProps={{
              legend: (
                <div>
                  <h2 className="font-heading-md">Insurance address</h2>
                  <p className="usa-hint">This is the office location of your insurance carrier.</p>
                </div>
              ),
            }}
            addressKeys={{
              streetAddress1: "insuranceStreetAddress1",
              streetAddress2: "insuranceStreetAddress2",
              city: "insuranceCity",
              state: "insuranceState",
              zip: "insuranceZip",
            }}
            zipValue={insuranceZip}
            autocomplete="shipping"
            orderedInputNameToLabel={orderedInputNameToLabel}
            errors={errors}
            register={register}
          />
        </div>
      </div>
      <HorizontalDivider />
      <FormProgressButtons />
    </DoulaForm>
  );
};

export default InsuranceStep2;
