"use client";

import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { routeToNextStep, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { AddressState } from "@form/_utils/inputFields/enums";
import { setKeyValue } from "@form/_utils/sessionStorage";
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

interface DisclosureBusinessAddressData {
  isSoleProprietorship: "true" | "false" | "";
  hasSameBusinessAddress: "true" | "false" | "";
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
      hasSameBusinessAddress: "",
      businessStreetAddress1: "",
      businessStreetAddress2: "",
      businessCity: "",
      businessState: "NJ",
      businessZip: "",
    },
  });

  const hasSameBusinessAddress = watch("hasSameBusinessAddress");

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
            <Fieldset
              legend={
                <div>
                  <p className="font-ui-xs text-normal">
                    Are you the sole proprietor of your business?
                  </p>
                  <p className="font-ui-xs text-normal">
                    Select one <RequiredMarker />
                  </p>
                </div>
              }
              legendStyle="large"
            >
              <Radio
                id="soleProprietorshipYes"
                label="Yes"
                value="true"
                {...register("isSoleProprietorship")}
              />
              <Radio
                id="soleProprietorshipNo"
                label="No"
                value="false"
                {...register("isSoleProprietorship")}
              />
            </Fieldset>

            <div>
              <h2 className="font-heading-md margin-top-5">Business address</h2>
              <p className="usa-hint">
                This is the physical location where your business operates.
              </p>
              <Fieldset
                legend={
                  <div>
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
                      Street address 1
                    </Label>
                    <TextInput
                      id="businessStreetAddress1"
                      type="text"
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
                    <Label requiredMarker htmlFor="businessCity">
                      City
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
                    <Label requiredMarker htmlFor="businessZip">
                      ZIP code
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
