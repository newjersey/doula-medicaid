"use client";

import ErrorSummary from "@form/(formSteps)/components/ErrorSummary";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { routeToNextStep, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { AddressState } from "@form/_utils/inputFields/enums";
import { getValue, setKeyValue } from "@form/_utils/sessionStorage";
import {
  Fieldset,
  Form,
  Label,
  Radio,
  RequiredMarker,
  Select,
  TextInput,
  TextInputMask,
} from "@trussworks/react-uswds";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { type SubmitErrorHandler, type SubmitHandler, useForm } from "react-hook-form";
import type { TrainingData } from "../TrainingData";

const orderedInputNameToLabel: { [key in keyof TrainingData]: string } = {
  trainingStreetAddress1: "Street address",
  trainingStreetAddress2: "Street address line 2",
  trainingCity: "City",
  trainingState: "State",
  trainingZip: "ZIP code",
  doulaTrainingInPerson: "Did you attend your doula training classes in person?",
};

const TrainingSectionStep1 = () => {
  const router = useRouter();
  const formProgressPosition = useFormProgressPosition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<TrainingData>({
    defaultValues: {
      trainingStreetAddress1: getValue("trainingStreetAddress1") || "",
      trainingStreetAddress2: getValue("trainingStreetAddress2") || "",
      trainingCity: getValue("trainingCity") || "",
      trainingState: getValue("trainingState") || "NJ",
      trainingZip: getValue("trainingZip") || "",
      doulaTrainingInPerson: getValue("doulaTrainingInPerson") || "",
    },
    shouldFocusError: false,
  });
  const trainingZip = watch("trainingZip");
  const doulaTrainingInPerson = watch("doulaTrainingInPerson");
  const [shouldSummarizeErrors, setShouldSummarizeErrors] = useState(false);
  const [dataHasLoaded, setDataHasLoaded] = useState<boolean>(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const onSubmit: SubmitHandler<TrainingData> = (data) => {
    let key: keyof TrainingData;
    for (key in data) {
      const value = data[key] ?? "";
      setKeyValue(key, value);
    }
    routeToNextStep(router, formProgressPosition);
  };

  const onError: SubmitErrorHandler<TrainingData> = (errors) => {
    if (Object.keys(errors).length >= 3) {
      setShouldSummarizeErrors(true);
      errorSummaryRef.current?.focus();
    } else {
      setShouldSummarizeErrors(false);
      for (const inputName of Object.keys(orderedInputNameToLabel) as Array<keyof TrainingData>) {
        if (errors[inputName] !== undefined) {
          setFocus(inputName);
          break;
        }
      }
    }
  };

  useEffect(() => {
    setDataHasLoaded(true);
  }, []);

  return (
    <div>
      {dataHasLoaded && (
        <Form onSubmit={handleSubmit(onSubmit, onError)} className="maxw-full" noValidate>
          <ErrorSummary<TrainingData>
            shouldSummarizeErrors={shouldSummarizeErrors}
            errors={errors}
            ref={errorSummaryRef}
            setFocus={setFocus}
          />

          <h2 className="font-heading-md">Training organization address</h2>
          <p className="usa-hint">This is where you completed your doula training.</p>
          <Fieldset
            legend={
              <div>
                <p className="font-ui-xs text-normal">
                  {orderedInputNameToLabel["doulaTrainingInPerson"]}
                </p>
                <p className="font-ui-xs text-normal">
                  Select one <RequiredMarker />
                </p>
              </div>
            }
          >
            <Radio
              id="doulaTrainingInPersonYes"
              label="Yes, in person or hybrid"
              value="true"
              checked={doulaTrainingInPerson === "true"}
              required
              {...register("doulaTrainingInPerson", {
                required: `This question is required`,
              })}
              aria-invalid={errors.doulaTrainingInPerson ? "true" : "false"}
              aria-describedby={errors.doulaTrainingInPerson && "doulaTrainingInPersonErrorMessage"}
            />
            <Radio
              id="doulaTrainingInPersonNo"
              label="No, it was virtual"
              value="false"
              checked={doulaTrainingInPerson === "false"}
              required
              {...register("doulaTrainingInPerson", {
                required: `This question is required`,
              })}
              aria-invalid={errors.doulaTrainingInPerson ? "true" : "false"}
              aria-describedby={errors.doulaTrainingInPerson && "doulaTrainingInPersonErrorMessage"}
            />
            {errors.doulaTrainingInPerson && (
              <span
                id="doulaTrainingInPersonErrorMessage"
                className="usa-error-message"
                role="alert"
              >
                {errors.doulaTrainingInPerson.message}
              </span>
            )}
          </Fieldset>

          {doulaTrainingInPerson === "true" && (
            <Fieldset
              legend={
                <p className="font-ui-xs text-normal margin-top-5">
                  What is the address of your training organization? <RequiredMarker />
                </p>
              }
            >
              <div className="grid-row grid-gap">
                <div className="mobile-lg:grid-col-6">
                  <Label htmlFor="trainingStreetAddress1" requiredMarker>
                    {orderedInputNameToLabel["trainingStreetAddress1"]}
                  </Label>
                  <TextInput
                    id="trainingStreetAddress1"
                    type="text"
                    required
                    validationStatus={errors.trainingStreetAddress1 ? "error" : undefined}
                    aria-invalid={errors.trainingStreetAddress1 ? "true" : "false"}
                    aria-describedby={
                      errors.trainingStreetAddress1 && "trainingStreetAddress1ErrorMessage"
                    }
                    {...register("trainingStreetAddress1", {
                      required: `Training ${orderedInputNameToLabel["trainingStreetAddress1"].toLowerCase()} is required`,
                    })}
                  />
                  {errors.trainingStreetAddress1 && (
                    <span
                      id="trainingStreetAddress1ErrorMessage"
                      className="usa-error-message"
                      role="alert"
                    >
                      {errors.trainingStreetAddress1.message}
                    </span>
                  )}
                </div>
                <div className="mobile-lg:grid-col-6">
                  <Label htmlFor="trainingStreetAddress2">
                    {orderedInputNameToLabel["trainingStreetAddress2"]}
                  </Label>
                  <TextInput
                    id="trainingStreetAddress2"
                    type="text"
                    {...register("trainingStreetAddress2")}
                  />
                </div>
              </div>
              <div className="grid-row grid-gap">
                <div className="mobile-lg:grid-col-6">
                  <Label htmlFor="trainingCity" requiredMarker>
                    {orderedInputNameToLabel["trainingCity"]}
                  </Label>
                  <TextInput
                    id="trainingCity"
                    type="text"
                    required
                    validationStatus={errors.trainingCity ? "error" : undefined}
                    aria-invalid={errors.trainingCity ? "true" : "false"}
                    aria-describedby={errors.trainingCity && "trainingCityErrorMessage"}
                    {...register("trainingCity", {
                      required: `Training ${orderedInputNameToLabel["trainingCity"].toLowerCase()} is required`,
                    })}
                  />
                  {errors.trainingCity && (
                    <span id="trainingCityErrorMessage" className="usa-error-message" role="alert">
                      {errors.trainingCity.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid-row grid-gap">
                <div className="mobile-lg:grid-col-6">
                  <Label htmlFor="trainingState" requiredMarker>
                    {orderedInputNameToLabel["trainingState"]}
                  </Label>
                  <Select
                    className="usa-select"
                    id="trainingState"
                    required
                    {...register("trainingState")}
                  >
                    {Object.keys(AddressState).map((trainingState) => (
                      <option key={trainingState} value={trainingState}>
                        {trainingState}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="mobile-lg:grid-col-4">
                  <Label htmlFor="trainingZip" requiredMarker>
                    {orderedInputNameToLabel["trainingZip"]}
                  </Label>
                  <TextInputMask
                    className="usa-input--medium"
                    id="trainingZip"
                    type="text"
                    value={trainingZip ?? ""}
                    mask="#####"
                    pattern="\d{5}"
                    required
                    validationStatus={errors.trainingZip ? "error" : undefined}
                    aria-invalid={errors.trainingZip ? "true" : "false"}
                    aria-describedby={errors.trainingZip && "trainingZipErrorMessage"}
                    {...register("trainingZip", {
                      required: `Training ${orderedInputNameToLabel["trainingZip"].toLowerCase()} is required`,
                      minLength: {
                        value: 5,
                        message: `Training ${orderedInputNameToLabel["trainingZip"].toLowerCase()} must have five digits`,
                      },
                    })}
                  />
                  {errors.trainingZip && (
                    <span id="trainingZipErrorMessage" className="usa-error-message">
                      {errors.trainingZip.message}
                    </span>
                  )}
                </div>
              </div>
            </Fieldset>
          )}
          <FormProgressButtons />
        </Form>
      )}
    </div>
  );
};

export default TrainingSectionStep1;
