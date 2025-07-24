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
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { routeToNextStep, useFormProgressPosition } from "../../../_utils/formProgressRouting";
import { AddressState } from "../../../_utils/inputFields/enums";
import { setKeyValue } from "../../../_utils/sessionStorage";
import FormProgressButtons from "../../components/FormProgressButtons";

interface DisclosureBusinessAddressData {
  isSoleProprietorship: "true" | "false" | "";
  hasSeparateBusinessAddress: "true" | "false" | "";
  businessStreetAddress1: string | null;
  businessStreetAddress2: string | null;
  businessCity: string | null;
  businessState: string | null;
  businessZip: string | null;
}

const DisclosuresStep1: React.FC = () => {
  const [dataHasLoaded, setDataHasLoaded] = useState<boolean>(false);
  const router = useRouter();
  const formProgressPosition = useFormProgressPosition();
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

  const onSubmit: SubmitHandler<DisclosureBusinessAddressData> = (data) => {
    for (const key in data) {
      const value = data[key as keyof DisclosureBusinessAddressData] ?? "";
      setKeyValue(key, value);
    }
    routeToNextStep(router, formProgressPosition);
  };

  useEffect(() => {
    setDataHasLoaded(true);
  }, []);

  return (
    <div>
      {dataHasLoaded && (
        <Form onSubmit={handleSubmit(onSubmit)} className="maxw-full">
          <div className="maxw-tablet">
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
                value="true"
                {...register("isSoleProprietorship")}
              />
              <Radio
                id="soleProprietorshipNo"
                data-testid="soleProprietorshipNo"
                label="No"
                value="false"
                {...register("isSoleProprietorship")}
              />
            </Fieldset>

            {isSoleProprietorship === "true" && (
              <div>
                <h2 className="font-heading-md margin-top-5">Business address</h2>
                <p className="usa-hint">
                  This is the physical location where your business operates.
                </p>
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
                    value="true"
                    {...register("hasSeparateBusinessAddress")}
                  />
                  <Radio
                    id="separateBusinessAddressNo"
                    data-testid="separateBusinessAddressNo"
                    label="No"
                    value="false"
                    {...register("hasSeparateBusinessAddress")}
                  />
                </Fieldset>
              </div>
            )}

            {hasSeparateBusinessAddress === "true" && (
              <Fieldset legend="Business address" legendStyle="srOnly">
                <div className="grid-row grid-gap">
                  <div className="mobile-lg:grid-col-6">
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
                  </div>
                  <div className="mobile-lg:grid-col-6">
                    <Label htmlFor="businessStreetAddress2">Street address line 2</Label>
                    <TextInput
                      id="businessStreetAddress2"
                      type="text"
                      {...register("businessStreetAddress2")}
                    />
                  </div>
                </div>
                <div className="grid-row grid-gap">
                  <div className="mobile-lg:grid-col-6">
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
                </div>
                <div className="grid-row grid-gap">
                  <div className="mobile-lg:grid-col-6">
                    <Label htmlFor="businessState">
                      State, territory, or military post <RequiredMarker />{" "}
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
                  </div>
                </div>
              </Fieldset>
            )}
          </div>
          <FormProgressButtons />
        </Form>
      )}
    </div>
  );
};

export default DisclosuresStep1;
