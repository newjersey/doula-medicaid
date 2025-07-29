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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInformationData>({
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
        <Form onSubmit={handleSubmit(onSubmit)} className="maxw-full" noValidate>
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
                    required
                    aria-describedby="streetAddress1ErrorMessage"
                    validationStatus={errors.streetAddress1 ? "error" : undefined}
                    aria-invalid={errors.streetAddress1 ? "true" : "false"}
                    {...register("streetAddress1", { required: true })}
                  />
                  {errors.streetAddress1?.type === "required" && (
                    <span
                      id="streetAddress1ErrorMessage"
                      className="usa-error-message"
                      role="alert"
                    >
                      Street address 1 is required
                    </span>
                  )}
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
                    id="city"
                    type="text"
                    required
                    aria-describedby="cityErrorMessage"
                    validationStatus={errors.city ? "error" : undefined}
                    aria-invalid={errors.city ? "true" : "false"}
                    {...register("city", { required: true })}
                  />
                  {errors.city?.type === "required" && (
                    <span id="cityErrorMessage" className="usa-error-message" role="alert">
                      City is required
                    </span>
                  )}
                </div>
              </div>
              <div className="grid-row grid-gap">
                <div className="mobile-lg:grid-col-6">
                  <Label htmlFor="state" requiredMarker>
                    State, territory, or military post
                  </Label>
                  <Select className="usa-select" id="state" {...register("state")}>
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
                    className="usa-input--medium"
                    id="zip"
                    type="text"
                    pattern="[\d]{5}(-[\d]{4})?"
                    required
                    aria-describedby="zipErrorMessage"
                    validationStatus={errors.zip ? "error" : undefined}
                    aria-invalid={errors.zip ? "true" : "false"}
                    {...register("zip", { required: true })}
                  />
                  {errors.zip?.type === "required" && (
                    <span id="zipErrorMessage" className="usa-error-message" role="alert">
                      ZIP code is required
                    </span>
                  )}
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
