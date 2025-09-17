"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { DoulaAddress } from "@/app/form/(formSteps)/components/DoulaAddress";
import DoulaRadio from "@/app/form/(formSteps)/components/DoulaRadio";
import DoulaTextInput from "@/app/form/(formSteps)/components/DoulaTextInput";
import DoulaTextInputMask from "@/app/form/(formSteps)/components/DoulaTextInputMask";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import type { TrainingData } from "@form/(formSteps)/training/TrainingData";
import { StateApprovedTraining } from "@form/_utils/inputFields/enums";
import { getDefaultValue } from "@form/_utils/sessionStorage";
import { Alert, Label, RequiredMarker, Select } from "@trussworks/react-uswds";
import { type FieldPath, useForm } from "react-hook-form";
import DoulaTrainingExplainer from "./DoulaTrainingExplainer";

const orderedInputNameToLabel: { [key in FieldPath<TrainingData>]: string } = {
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

const mayHaveThreeOrMoreErrors = true;
const TrainingStep1 = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<TrainingData>({
    defaultValues: {
      stateApprovedTraining: getDefaultValue("stateApprovedTraining") ?? "",
      nameOfTrainingOrganization: getDefaultValue("nameOfTrainingOrganization") ?? "",
      trainingStreetAddress1: getDefaultValue("trainingStreetAddress1") ?? "",
      trainingStreetAddress2: getDefaultValue("trainingStreetAddress2") ?? "",
      trainingCity: getDefaultValue("trainingCity") ?? "",
      trainingState: getDefaultValue("trainingState") ?? "NJ",
      trainingZip: getDefaultValue("trainingZip") ?? "",
      isDoulaTrainingInPerson: getDefaultValue("isDoulaTrainingInPerson") ?? "",
      instructorFirstName: getDefaultValue("instructorFirstName") ?? "",
      instructorLastName: getDefaultValue("instructorLastName") ?? "",
      instructorEmail: getDefaultValue("instructorEmail") ?? "",
      instructorPhoneNumber: getDefaultValue("instructorPhoneNumber") ?? "",
    },
    shouldFocusError: !mayHaveThreeOrMoreErrors,
  });
  const stateApprovedTraining = watch("stateApprovedTraining");
  const trainingZip = watch("trainingZip");
  const instructorPhoneNumber = watch("instructorPhoneNumber");
  const isDoulaTrainingInPerson = watch("isDoulaTrainingInPerson");

  return (
    <DoulaForm<TrainingData>
      orderedInputNameToLabel={orderedInputNameToLabel}
      errors={errors}
      setFocus={setFocus}
      handleSubmit={handleSubmit}
      mayHaveThreeOrMoreErrors={mayHaveThreeOrMoreErrors}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md">Doula training organization</h2>
          <Label htmlFor="stateApprovedTraining">
            <p>{orderedInputNameToLabel["stateApprovedTraining"]}</p>
            <p>
              Select one <RequiredMarker />
            </p>
          </Label>
          <Select
            className="tablet:grid-col-6"
            id="stateApprovedTraining"
            required
            validationStatus={errors.stateApprovedTraining ? "error" : undefined}
            aria-invalid={errors.stateApprovedTraining ? "true" : "false"}
            aria-describedby={errors.stateApprovedTraining && "stateApprovedTrainingErrorMessage"}
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
          {errors.stateApprovedTraining && (
            <span id="stateApprovedTrainingErrorMessage" className="usa-error-message">
              {errors.stateApprovedTraining.message}
            </span>
          )}
          {stateApprovedTraining === StateApprovedTraining.NONE && (
            <div>
              <DoulaTextInput
                name="nameOfTrainingOrganization"
                label={orderedInputNameToLabel["nameOfTrainingOrganization"]}
                className="tablet:grid-col-6"
                required
                aria-describedby="nameOfTrainingOrganizationAlert"
                errors={errors}
                register={register}
                registerOptions={{
                  required: `This question is required`,
                }}
              />
              <Alert id="nameOfTrainingOrganizationAlert" type="info" headingLevel="h3" noIcon>
                If your training organization isn&apos;t listed, you may not be eligible to apply
                right now. Contact the Doula Guides at mahs.doulaguide@dhs.nj.gov to learn more.
              </Alert>
            </div>
          )}
        </div>
        <div className="form-explainer desktop:grid-col-4">
          <DoulaTrainingExplainer />
        </div>
      </div>
      <HorizontalDivider />
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md">Training organization address</h2>
          <p className="usa-hint">This is where you completed your doula training.</p>
          <DoulaRadio
            name="isDoulaTrainingInPerson"
            value={isDoulaTrainingInPerson}
            label={orderedInputNameToLabel["isDoulaTrainingInPerson"]}
            required
            options={[
              {
                label: "Yes, in person or hybrid",
                value: "true",
              },
              {
                label: "No, it was virtual",
                value: "false",
              },
            ]}
            errors={errors}
            register={register}
          />

          {isDoulaTrainingInPerson === "true" && (
            <DoulaAddress<TrainingData>
              fieldsetProps={{
                legend: (
                  <p className="margin-top-3">
                    What is the address of your training organization? <RequiredMarker />
                  </p>
                ),
              }}
              addressKeys={{
                streetAddress1: "trainingStreetAddress1",
                streetAddress2: "trainingStreetAddress2",
                city: "trainingCity",
                state: "trainingState",
                zip: "trainingZip",
              }}
              zipValue={trainingZip}
              errorLabelPrefix="Training"
              orderedInputNameToLabel={orderedInputNameToLabel}
              errors={errors}
              register={register}
            />
          )}
        </div>
      </div>
      <HorizontalDivider />
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md">Training organization point of contact</h2>
          <p className="usa-hint">Most doulas use their program instructor&apos;s information.</p>

          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-6">
              <DoulaTextInput
                name="instructorFirstName"
                label={orderedInputNameToLabel["instructorFirstName"]}
                required
                errors={errors}
                register={register}
                registerOptions={{
                  required: `${orderedInputNameToLabel["instructorFirstName"]} is required`,
                }}
              />
            </div>
            <div className="tablet:grid-col-6">
              <DoulaTextInput
                name="instructorLastName"
                label={orderedInputNameToLabel["instructorLastName"]}
                required
                errors={errors}
                register={register}
                registerOptions={{
                  required: `${orderedInputNameToLabel["instructorLastName"]} is required`,
                }}
              />
            </div>
          </div>
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-6">
              <DoulaTextInput
                name="instructorEmail"
                label={orderedInputNameToLabel["instructorEmail"]}
                autoCorrect="off"
                autoCapitalize="off"
                required
                errors={errors}
                register={register}
                registerOptions={{
                  required: `${orderedInputNameToLabel["instructorEmail"]} is required`,
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Entered value does not match email format",
                  },
                }}
                type="email"
              />
            </div>
          </div>
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-6">
              <DoulaTextInputMask
                name="instructorPhoneNumber"
                label={orderedInputNameToLabel["instructorPhoneNumber"]}
                type="tel"
                value={instructorPhoneNumber ?? ""}
                inputMode="numeric"
                mask="___-___-____"
                pattern="\d{3}-\d{3}-\d{4}"
                errors={errors}
                register={register}
                registerOptions={{
                  pattern: {
                    value: /\d{3}-\d{3}-\d{4}/,
                    message: "Entered value does not match phone number format",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <HorizontalDivider />
      <FormProgressButtons />
    </DoulaForm>
  );
};

export default TrainingStep1;
