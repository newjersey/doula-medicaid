"use client";

import type { BusinessDetails1Data } from "@/app/form/(formSteps)/business-details/BusinessDetailsData";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { createFormSubmitHandler } from "@form/_utils/formHandlers";
import { useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { AddressState } from "@form/_utils/inputFields/enums";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const BusinessDetails1 = () => {
  const [dataHasLoaded, setDataHasLoaded] = useState<boolean>(false);
  const router = useRouter();
  const formProgressPosition = useFormProgressPosition();
  const { register, handleSubmit, watch } = useForm<BusinessDetails1Data>({
    defaultValues: {
      hasSameBusinessAddress: "",
      businessStreetAddress1: "",
      businessStreetAddress2: "",
      businessCity: "",
      businessState: "NJ",
      businessZip: "",
    },
  });

  const hasSameBusinessAddress = watch("hasSameBusinessAddress");

  const onSubmit = createFormSubmitHandler<BusinessDetails1Data>(router, formProgressPosition);

  useEffect(() => {
    setDataHasLoaded(true);
  }, []);

  return (
    <div>
      {dataHasLoaded && (
        <Form onSubmit={handleSubmit(onSubmit)} className="maxw-full">
          <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
            <div className="desktop:grid-col-8">
              <h2 className="font-heading-md">Business address</h2>
              <p className="usa-hint">
                This is the physical location where your business operates.
              </p>
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
                      Street address
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

export default BusinessDetails1;
