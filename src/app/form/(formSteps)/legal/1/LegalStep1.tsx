"use client";
import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import DoulaRadio from "@/app/form/(formSteps)/components/DoulaRadio";
import DoulaTextareaCharacterCount from "@/app/form/(formSteps)/components/DoulaTextareaCharacterCount";
import { type Legal1Data } from "@/app/form/(formSteps)/legal/LegalData";
import { getDefaultValue } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { useForm } from "react-hook-form";

const orderedInputNameToLabel: { [key in keyof Legal1Data]: string } = {
  usersRoleWithState: "In a few words please explain your role with the State of New Jersey",
  usersServicesProvided:
    "What services did you provide and what is your current provider status? Please explain in a few words.",
  employedByState: "Are you employed by the State of New Jersey?",
  approvedForMedicaidProgram:
    "Have you previously been approved to provide services under any state's Medicaid program, such as NJ FamilyCare?",
};

const mayHaveThreeOrMoreErrors = false;

const LegalStep1 = () => {
  const { dataStore } = useDataStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Legal1Data>({
    defaultValues: {
      employedByState: getDefaultValue(dataStore, "employedByState") ?? "",
      usersRoleWithState: getDefaultValue(dataStore, "usersRoleWithState") ?? "",
      approvedForMedicaidProgram: getDefaultValue(dataStore, "approvedForMedicaidProgram") ?? "",
      usersServicesProvided: getDefaultValue(dataStore, "usersServicesProvided") ?? "",
    },
    shouldFocusError: !mayHaveThreeOrMoreErrors,
  });

  const employedByState = watch("employedByState");
  const approvedForMedicaidProgram = watch("approvedForMedicaidProgram");

  return (
    <DoulaForm<object>
      errors={errors}
      handleSubmit={handleSubmit}
      mayHaveThreeOrMoreErrors={mayHaveThreeOrMoreErrors}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md margin-bottom-0">Medicaid statements</h2>
          <p className="usa-hint">
            To meet legal requirements, we ask these questions. Answering &quot;Yes&quot; will not
            automatically disqualify you.
          </p>
          <DoulaRadio
            name="employedByState"
            value={employedByState}
            label={orderedInputNameToLabel["employedByState"]}
            required
            options={[
              {
                label: "Yes",
                value: "true",
              },
              {
                label: "No",
                value: "false",
              },
            ]}
            errors={errors}
            register={register}
          />
          {employedByState === "true" && (
            <DoulaTextareaCharacterCount
              name="usersRoleWithState"
              label={orderedInputNameToLabel["usersRoleWithState"]}
              className="tablet:grid-col-6"
              // aria-describedby="nameOfTrainingOrganizationAlert"
              errors={errors}
              register={register}
              maxLength={100}
            />
          )}
        </div>
      </div>
      <HorizontalDivider />
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <DoulaRadio
            name="approvedForMedicaidProgram"
            value={approvedForMedicaidProgram}
            label={orderedInputNameToLabel["approvedForMedicaidProgram"]}
            required
            options={[
              {
                label: "Yes",
                value: "true",
              },
              {
                label: "No",
                value: "false",
              },
            ]}
            errors={errors}
            register={register}
          />
          {approvedForMedicaidProgram === "true" && (
            <DoulaTextareaCharacterCount
              name="usersServicesProvided"
              label={orderedInputNameToLabel["usersServicesProvided"]}
              className="tablet:grid-col-6"
              // aria-describedby="nameOfTrainingOrganizationAlert"
              errors={errors}
              register={register}
              maxLength={100}
            />
          )}
        </div>
      </div>
      <HorizontalDivider />
      <FormProgressButtons />
    </DoulaForm>
  );
};

export default LegalStep1;
