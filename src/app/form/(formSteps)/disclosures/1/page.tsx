"use client";

import {
  Fieldset,
  Form,
  Label,
  Radio,
  RequiredMarker,
  Select,
  TextInput,
} from "@trussworks/react-uswds";
import React, { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { AddressState, DisclosingEntity } from "../../../_utils/inputFields/enums";
import { removeKey, setKeyValue } from "../../../_utils/sessionStorage";
import ProgressButtons from "../../components/ProgressButtons";

interface DisclosureBusinessAddressData {
  isSoleProprietorship: string;
  hasSeparateBusinessAddress: string;
  businessStreetAddress1: string | null;
  businessStreetAddress2: string | null;
  businessCity: string | null;
  businessState: string | null;
  businessZip: string | null;
}

const DisclosuresStep1: React.FC = () => {
  const { register, handleSubmit, watch } = useForm<DisclosureBusinessAddressData>({
    defaultValues: {
      isSoleProprietorship: "",
      hasSeparateBusinessAddress: "",
      businessStreetAddress1: "",
      businessStreetAddress2: "",
      businessCity: "",
      businessState: "NJ",
      businessZip: "",
    },
  });

  const isSoleProprietorship = watch("isSoleProprietorship");
  const hasSeparateBusinessAddress = watch("hasSeparateBusinessAddress");

  useEffect(() => {
    if (isSoleProprietorship === "yes") {
      setKeyValue("natureOfDisclosingEntity", DisclosingEntity.SoleProprietorship);
    }
    if (isSoleProprietorship === "no") {
      removeKey("natureOfDisclosingEntity");
    }
    if (hasSeparateBusinessAddress) {
      setKeyValue(
        "separateBusinessAddress",
        hasSeparateBusinessAddress === "yes" ? "true" : "false",
      );
    }
  }, [isSoleProprietorship, hasSeparateBusinessAddress]);

  const onSubmit: SubmitHandler<DisclosureBusinessAddressData> = (data) => {
    for (const key in data) {
      const value = data[key as keyof DisclosureBusinessAddressData] ?? "";
      setKeyValue(key, value);
    }
  };

  return (
    <div>
      <Form
        onSubmit={() => {
          throw new Error(
            "Form submission does not use the onSubmit handler, use ProgressButtons instead",
          );
        }}
        className="maxw-tablet"
      >
        <h2 className="font-heading-md">Business details</h2>
        <p>Are you the sole proprietor of your business?</p>
        <Fieldset
          legend={
            <p className="font-ui-xs">
              Select one <RequiredMarker />
            </p>
          }
          legendStyle="large"
        >
          <Radio
            id="soleProprietorshipYes"
            data-testid="soleProprietorshipYes"
            label="Yes"
            value="yes"
            {...register("isSoleProprietorship")}
          />
          <Radio
            id="soleProprietorshipNo"
            data-testid="soleProprietorshipNo"
            label="No"
            value="no"
            {...register("isSoleProprietorship")}
          />
        </Fieldset>

        {isSoleProprietorship === "yes" && (
          <div>
            <h2 className="font-heading-md margin-top-5">Business address</h2>
            <p className="usa-hint">This is the physical location where your business operates.</p>
            <p>Is your business address the same as your residential and billing address?</p>
            <Fieldset
              legend={
                <p className="font-ui-xs">
                  Select one <RequiredMarker />
                </p>
              }
              legendStyle="large"
            >
              <Radio
                id="separateBusinessAddressYes"
                data-testid="separateBusinessAddressYes"
                label="Yes"
                value="yes"
                {...register("hasSeparateBusinessAddress")}
              />
              <Radio
                id="separateBusinessAddressNo"
                data-testid="separateBusinessAddressNo"
                label="No"
                value="no"
                {...register("hasSeparateBusinessAddress")}
              />
            </Fieldset>
          </div>
        )}

        {hasSeparateBusinessAddress === "yes" && (
          <Fieldset legend="Business address" legendStyle="srOnly">
            <Label htmlFor="businessStreetAddress1">
              Street address 1 <RequiredMarker />
            </Label>
            <TextInput
              id="businessStreetAddress1"
              type="text"
              inputMode="numeric"
              required
              {...register("businessStreetAddress1")}
            />

            <Label htmlFor="businessStreetAddress2" hint=" (optional)">
              Street address 2
            </Label>
            <TextInput
              id="businessStreetAddress2"
              type="text"
              {...register("businessStreetAddress2")}
            />

            <div className="grid-row grid-gap">
              <div className="mobile-lg:grid-col-8">
                <Label htmlFor="businessCity">
                  City <RequiredMarker />
                </Label>
                <TextInput
                  className="usa-input"
                  id="businessCity"
                  type="text"
                  required
                  {...register("businessCity")}
                />
              </div>
              <div className="mobile-lg:grid-col-4">
                <Label htmlFor="businessState">
                  State <RequiredMarker />
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
            </div>

            <Label htmlFor="businessZip">
              ZIP code <RequiredMarker />
            </Label>
            <TextInput
              className="usa-input usa-input--medium"
              id="businessZip"
              type="text"
              pattern="[\d]{5}(-[\d]{4})?"
              required
              {...register("businessZip")}
            />
          </Fieldset>
        )}
      </Form>
      <ProgressButtons onClickHandler={handleSubmit(onSubmit)} />
    </div>
  );
};

export default DisclosuresStep1;
