"use client";

import { Fieldset, Form, Label, Radio, RequiredMarker, Select, TextInput } from "@trussworks/react-uswds";
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
      >
        <Fieldset
          legend={
            <span>
              Is your doula business a sole proprietorship? <RequiredMarker />
            </span>
          }
          legendStyle="large"
        >
          <Radio
            id="soleProprietorshipYes"
            label="Yes, my doula business is a sole proprietorship"
            value="yes"
            {...register("isSoleProprietorship")}
          />
          <Radio
            id="soleProprietorshipNo"
            label="No, my doula business is not a sole proprietorship"
            value="no"
            {...register("isSoleProprietorship")}
          />
        </Fieldset>

        {isSoleProprietorship === "yes" && (
          <Fieldset
            legend={
              <span>
                Do you have a separate business address that&apos;s different from your mailing
                address? <RequiredMarker />
              </span>
            }
            legendStyle="large"
          >
            <Radio
              id="separateBusinessAddressYes"
              label="Yes, I have a separate business address"
              value="yes"
              {...register("hasSeparateBusinessAddress")}
            />
            <Radio
              id="separateBusinessAddressNo"
              label="No, I do not have a separate business address"
              value="no"
              {...register("hasSeparateBusinessAddress")}
            />
          </Fieldset>
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
