"use client";

import { Fieldset, Form, Label, Select, TextInput } from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { routeToNextStep, useFormProgressPosition } from "../../../_utils/formProgressRouting";
import { AddressState } from "../../../_utils/inputFields/enums";
import { getValue, setKeyValue } from "../../../_utils/sessionStorage";
import FormProgressButtons from "../../components/FormProgressButtons";
import { type PersonalInformationData } from "../PersonalInformationData";

const PersonalDetailsStep2: React.FC = () => {
  const [dataHasLoaded, setDataHasLoaded] = useState<boolean>(false);
  const router = useRouter();
  const formProgressPosition = useFormProgressPosition();
  const { register, handleSubmit } = useForm<PersonalInformationData>({
    defaultValues: {
      streetAddress1: getValue("streetAddress1") || "",
      streetAddress2: getValue("streetAddress2") || "",
      city: getValue("city") || "",
      state: getValue("state") || "NJ",
      zip: getValue("zip") || "",
    },
  });

  const onSubmit: SubmitHandler<PersonalInformationData> = (data) => {
    for (const key in data) {
      const value = data[key as keyof PersonalInformationData] ?? "";
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
            <h2 className="font-heading-md">Mailing address</h2>
            <p className="usa-hint">
              This is the location where you want to receive official mail.
            </p>
            <Fieldset legend="Mailing address" legendStyle="srOnly">
              <div className="grid-row grid-gap">
                <div className="mobile-lg:grid-col-6">
                  <Label htmlFor="streetAddress1" requiredMarker>
                    Street address 1
                  </Label>
                  <TextInput
                    id="streetAddress1"
                    type="text"
                    inputMode="numeric"
                    required
                    {...register("streetAddress1")}
                  />
                </div>
                <div className="mobile-lg:grid-col-6">
                  <Label htmlFor="streetAddress2">Street address line 2</Label>
                  <TextInput id="streetAddress2" type="text" {...register("streetAddress2")} />
                </div>
              </div>
              <div className="grid-row grid-gap">
                <div className="mobile-lg:grid-col-6">
                  <Label htmlFor="city" requiredMarker>
                    City
                  </Label>
                  <TextInput
                    className="usa-input"
                    id="city"
                    type="text"
                    required
                    {...register("city")}
                  />
                </div>
              </div>
              <div className="grid-row grid-gap">
                <div className="mobile-lg:grid-col-6">
                  <Label htmlFor="state" requiredMarker>
                    State, territory, or military post
                  </Label>
                  <Select className="usa-select" id="state" required {...register("state")}>
                    {Object.keys(AddressState).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="mobile-lg:grid-col-4">
                  <Label htmlFor="zip" requiredMarker>
                    ZIP code
                  </Label>
                  <TextInput
                    className="usa-input usa-input--medium"
                    id="zip"
                    type="text"
                    pattern="[\d]{5}(-[\d]{4})?"
                    required
                    {...register("zip")}
                  />
                </div>
              </div>
            </Fieldset>
          </div>
          <FormProgressButtons />
        </Form>
      )}
    </div>
  );
};

export default PersonalDetailsStep2;
