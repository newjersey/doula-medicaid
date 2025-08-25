"use client";

import ErrorSummary from "@form/(formSteps)/components/ErrorSummary";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import type { TrainingData } from "@form/(formSteps)/training/TrainingData";
import { routeToNextStep, useFormProgressPosition } from "@form/_utils/formProgressRouting";
import { AddressState, StateApprovedTraining } from "@form/_utils/inputFields/enums";
import { getDefaultValue, setKeyValue } from "@form/_utils/sessionStorage";
import {
  Alert,
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
import DoulaTrainingExplainer from "./DoulaTrainingExplainer";

const orderedInputNameToLabel: { [key in keyof TrainingData]: string } = {
  stateApprovedTraining: "Which state-approved training did you complete?",
  nameOfTrainingOrganization: "What is the name of your training organization?",
  trainingStreetAddress1: "Street address",
  trainingStreetAddress2: "Street address line 2",
  trainingCity: "City",
  trainingState: "State",
  trainingZip: "ZIP code",
  isDoulaTrainingInPerson: "Did you attend your doula training classes in person?",
  instructorFirstName: "First name",
  instructorLastName: "Last name",
  instructorEmail: "Email address",
  instructorPhoneNumber: "Phone number",
};

const TrainingStep1 = () => {
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
      stateApprovedTraining: getDefaultValue("stateApprovedTraining") || "",
      nameOfTrainingOrganization: getDefaultValue("nameOfTrainingOrganization") || "",
      trainingStreetAddress1: getDefaultValue("trainingStreetAddress1") || "",
      trainingStreetAddress2: getDefaultValue("trainingStreetAddress2") || "",
      trainingCity: getDefaultValue("trainingCity") || "",
      trainingState: getDefaultValue("trainingState") || "NJ",
      trainingZip: getDefaultValue("trainingZip") || "",
      isDoulaTrainingInPerson: getDefaultValue("isDoulaTrainingInPerson") || "",
      instructorFirstName: getDefaultValue("instructorFirstName") || "",
      instructorLastName: getDefaultValue("instructorLastName") || "",
      instructorEmail: getDefaultValue("instructorEmail") || "",
      instructorPhoneNumber: getDefaultValue("instructorPhoneNumber") || "",
    },
    shouldFocusError: false,
  });
  const stateApprovedTraining = watch("stateApprovedTraining");
  const trainingZip = watch("trainingZip");
  const instructorPhoneNumber = watch("instructorPhoneNumber");
  const isDoulaTrainingInPerson = watch("isDoulaTrainingInPerson");
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
          <div className="form-grid">
            <div>
              <ErrorSummary<TrainingData>
                shouldSummarizeErrors={shouldSummarizeErrors}
                errors={errors}
                ref={errorSummaryRef}
                setFocus={setFocus}
              />
              <h2 className="font-heading-md margin-top-0">Doula training organization</h2>
              <Label htmlFor="stateApprovedTraining">
                <p className="font-ui-xs text-normal">
                  {orderedInputNameToLabel["stateApprovedTraining"]}
                </p>
                <p className="font-ui-xs text-normal">
                  Select one <RequiredMarker />
                </p>
              </Label>
              <Select
                className="tablet:grid-col-6"
                id="stateApprovedTraining"
                required
                validationStatus={errors.stateApprovedTraining ? "error" : undefined}
                aria-invalid={errors.stateApprovedTraining ? "true" : "false"}
                aria-describedby={
                  errors.stateApprovedTraining && "stateApprovedTrainingErrorMessage"
                }
                {...register("stateApprovedTraining", {
                  required: `This question is required`,
                })}
              >
                {Object.values(StateApprovedTraining).map((trainingOrg) => (
                  <option key={trainingOrg} value={trainingOrg}>
                    {trainingOrg}
                  </option>
                ))}
              </Select>
              {stateApprovedTraining === StateApprovedTraining.NONE && (
                <div>
                  <Label htmlFor="nameOfTrainingOrganization" requiredMarker>
                    {orderedInputNameToLabel["nameOfTrainingOrganization"]}
                  </Label>
                  <TextInput
                    className="tablet:grid-col-6"
                    id="nameOfTrainingOrganization"
                    type="text"
                    required
                    validationStatus={errors.nameOfTrainingOrganization ? "error" : undefined}
                    aria-invalid={errors.nameOfTrainingOrganization ? "true" : "false"}
                    aria-describedby={`${errors.nameOfTrainingOrganization ? "nameOfTrainingOrganizationErrorMessage" : ""} nameOfTrainingOrganizationAlert`}
                    {...register("nameOfTrainingOrganization", {
                      required: `This question is required`,
                    })}
                  />
                  {errors.nameOfTrainingOrganization && (
                    <span
                      id="nameOfTrainingOrganizationErrorMessage"
                      className="usa-error-message"
                      role="alert"
                    >
                      {errors.nameOfTrainingOrganization.message}
                    </span>
                  )}

                  <Alert id="nameOfTrainingOrganizationAlert" type="info" headingLevel="h3" noIcon>
                    If your training organization isn&apos;t listed, you may not be eligible to
                    apply right now. Contact the Doula Guides at mahs.doulaguide@dhs.nj.gov to learn
                    more.
                  </Alert>
                </div>
              )}
              <hr className="margin-top-5" />
            </div>
            <div className="form-explainer">
              <DoulaTrainingExplainer />
            </div>
            <div>
              <div>
                <h2 className="font-heading-md">Training organization address</h2>
                <p className="usa-hint">This is where you completed your doula training.</p>
                <Fieldset
                  legend={
                    <div>
                      <p className="font-ui-xs text-normal margin-top-4">
                        {orderedInputNameToLabel["isDoulaTrainingInPerson"]}
                      </p>
                      <p className="font-ui-xs text-normal">
                        Select one <RequiredMarker />
                      </p>
                    </div>
                  }
                >
                  <Radio
                    id="isDoulaTrainingInPersonYes"
                    label="Yes, in person or hybrid"
                    value="true"
                    checked={isDoulaTrainingInPerson === "true"}
                    required
                    {...register("isDoulaTrainingInPerson", {
                      required: `This question is required`,
                    })}
                    aria-invalid={errors.isDoulaTrainingInPerson ? "true" : "false"}
                    aria-describedby={
                      errors.isDoulaTrainingInPerson && "isDoulaTrainingInPersonErrorMessage"
                    }
                  />
                  <Radio
                    id="isDoulaTrainingInPersonNo"
                    label="No, it was virtual"
                    value="false"
                    checked={isDoulaTrainingInPerson === "false"}
                    required
                    {...register("isDoulaTrainingInPerson", {
                      required: `This question is required`,
                    })}
                    aria-invalid={errors.isDoulaTrainingInPerson ? "true" : "false"}
                    aria-describedby={
                      errors.isDoulaTrainingInPerson && "isDoulaTrainingInPersonErrorMessage"
                    }
                  />
                  {errors.isDoulaTrainingInPerson && (
                    <span
                      id="isDoulaTrainingInPersonErrorMessage"
                      className="usa-error-message"
                      role="alert"
                    >
                      {errors.isDoulaTrainingInPerson.message}
                    </span>
                  )}
                </Fieldset>

                {isDoulaTrainingInPerson === "true" && (
                  <Fieldset
                    legend={
                      <p className="font-ui-xs text-normal margin-top-3">
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
                          <span
                            id="trainingCityErrorMessage"
                            className="usa-error-message"
                            role="alert"
                          >
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
              </div>
              <hr className="margin-top-5" />

              <div>
                <h2 className="font-heading-md margin-top-5">
                  Training organization point of contact
                </h2>
                <p className="usa-hint">
                  Most doulas use their program instructor&apos;s information.
                </p>

                <div className="grid-row grid-gap">
                  <div className="tablet:grid-col-6">
                    <Label htmlFor="instructorFirstName" requiredMarker>
                      {orderedInputNameToLabel["instructorFirstName"]}
                    </Label>
                    <TextInput
                      id="instructorFirstName"
                      type="text"
                      required
                      validationStatus={errors.instructorFirstName ? "error" : undefined}
                      aria-invalid={errors.instructorFirstName ? "true" : "false"}
                      aria-describedby={
                        errors.instructorFirstName && "instructorFirstNameErrorMessage"
                      }
                      {...register("instructorFirstName", {
                        required: `${orderedInputNameToLabel["instructorFirstName"]} is required`,
                      })}
                    />
                    {errors.instructorFirstName && (
                      <span id="instructorFirstNameErrorMessage" className="usa-error-message">
                        {errors.instructorFirstName.message}
                      </span>
                    )}
                  </div>
                  <div className="tablet:grid-col-6">
                    <Label htmlFor="instructorLastName" requiredMarker>
                      {orderedInputNameToLabel["instructorLastName"]}
                    </Label>
                    <TextInput
                      id="instructorLastName"
                      type="text"
                      required
                      validationStatus={errors.instructorLastName ? "error" : undefined}
                      aria-invalid={errors.instructorLastName ? "true" : "false"}
                      aria-describedby={
                        errors.instructorLastName && "instructorLastNameErrorMessage"
                      }
                      {...register("instructorLastName", {
                        required: `${orderedInputNameToLabel["instructorLastName"]} is required`,
                      })}
                    />
                    {errors.instructorLastName && (
                      <span id="instructorLastNameErrorMessage" className="usa-error-message">
                        {errors.instructorLastName.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid-row grid-gap">
                  <div className="tablet:grid-col-6">
                    <Label htmlFor="instructorEmail" requiredMarker>
                      {orderedInputNameToLabel["instructorEmail"]}
                    </Label>
                    <TextInput
                      id="instructorEmail"
                      autoCorrect="off"
                      autoCapitalize="off"
                      required
                      validationStatus={errors.instructorEmail ? "error" : undefined}
                      aria-invalid={errors.instructorEmail ? "true" : "false"}
                      aria-describedby={errors.instructorEmail && "instructorEmailErrorMessage"}
                      {...register("instructorEmail", {
                        required: `${orderedInputNameToLabel["instructorEmail"]} is required`,
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Entered value does not match email format",
                        },
                      })}
                      type="email"
                    />
                    {errors.instructorEmail && (
                      <span id="instructorEmailErrorMessage" className="usa-error-message">
                        {errors.instructorEmail.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid-row grid-gap">
                  <div className="tablet:grid-col-6">
                    <Label htmlFor="instructorPhoneNumber">
                      {orderedInputNameToLabel["instructorPhoneNumber"]}
                    </Label>
                    <TextInputMask
                      id="instructorPhoneNumber"
                      type="tel"
                      value={instructorPhoneNumber ?? ""}
                      inputMode="numeric"
                      mask="___-___-____"
                      pattern="\d{3}-\d{3}-\d{4}"
                      validationStatus={errors.instructorPhoneNumber ? "error" : undefined}
                      aria-invalid={errors.instructorPhoneNumber ? "true" : "false"}
                      aria-describedby={
                        errors.instructorPhoneNumber && "instructorPhoneNumberErrorMessage"
                      }
                      {...register("instructorPhoneNumber", {
                        pattern: {
                          value: /\d{3}-\d{3}-\d{4}/,
                          message: "Entered value does not match phone number format",
                        },
                      })}
                    />
                    {errors.instructorPhoneNumber && (
                      <span id="instructorPhoneNumberErrorMessage" className="usa-error-message">
                        {errors.instructorPhoneNumber.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <FormProgressButtons />
        </Form>
      )}
    </div>
  );
};

export default TrainingStep1;
