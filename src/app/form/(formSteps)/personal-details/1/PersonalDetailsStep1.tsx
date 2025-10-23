"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import { DoulaDateInput } from "@/app/form/(formSteps)/components/DoulaDateInput";
import DoulaTextInput from "@/app/form/(formSteps)/components/DoulaTextInput";
import DoulaTextInputMask from "@/app/form/(formSteps)/components/DoulaTextInputMask";
import { type PersonalDetails1Data } from "@/app/form/(formSteps)/personal-details/PersonalDetailsData";
import { getDefaultValue } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { Fieldset } from "@trussworks/react-uswds";
import { useForm } from "react-hook-form";

const orderedInputNameToLabel: { [key in keyof PersonalDetails1Data]: string } = {
  firstName: "First name",
  middleName: "Middle name",
  lastName: "Last name",
  dateOfBirthMonth: "Month",
  dateOfBirthDay: "Day",
  dateOfBirthYear: "Year",
  socialSecurityNumber: "Social security number",
  email: "Email address",
  phoneNumber: "Phone number",
};

const mayHaveThreeOrMoreErrors = true;
const PersonalDetailsStep1 = () => {
  const { dataStore } = useDataStore();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setFocus,
    watch,
  } = useForm<PersonalDetails1Data>({
    defaultValues: {
      firstName: getDefaultValue(dataStore, "firstName") ?? "",
      middleName: getDefaultValue(dataStore, "middleName") ?? "",
      lastName: getDefaultValue(dataStore, "lastName") ?? "",
      dateOfBirthMonth: getDefaultValue(dataStore, "dateOfBirthMonth") ?? "",
      dateOfBirthDay: getDefaultValue(dataStore, "dateOfBirthDay") ?? "",
      dateOfBirthYear: getDefaultValue(dataStore, "dateOfBirthYear") ?? "",
      socialSecurityNumber: getDefaultValue(dataStore, "socialSecurityNumber") ?? "",
      email: getDefaultValue(dataStore, "email") ?? "",
      phoneNumber: getDefaultValue(dataStore, "phoneNumber") ?? "",
    },
    shouldFocusError: !mayHaveThreeOrMoreErrors,
  });

  const phoneNumber = watch("phoneNumber");
  const socialSecurityNumber = watch("socialSecurityNumber");

  return (
    <DoulaForm<PersonalDetails1Data>
      orderedInputNameToLabel={orderedInputNameToLabel}
      errors={errors}
      setFocus={setFocus}
      handleSubmit={handleSubmit}
      mayHaveThreeOrMoreErrors={mayHaveThreeOrMoreErrors}
    >
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div>
          <h2 className="font-heading-md">Personal identification</h2>
          <Fieldset legend="Name" legendStyle="srOnly" className="grid-row grid-gap">
            <div className="tablet:grid-col-4">
              <DoulaTextInput
                name="firstName"
                label={orderedInputNameToLabel["firstName"]}
                required
                errors={errors}
                register={register}
                registerOptions={{
                  required: `${orderedInputNameToLabel["firstName"]} is required`,
                }}
              />
            </div>
            <div className="tablet:grid-col-4">
              <DoulaTextInput
                name="middleName"
                label={orderedInputNameToLabel["middleName"]}
                register={register}
              />
            </div>
            <div className="tablet:grid-col-4">
              <DoulaTextInput
                name="lastName"
                label={orderedInputNameToLabel["lastName"]}
                required
                errors={errors}
                register={register}
                registerOptions={{
                  required: `${orderedInputNameToLabel["lastName"]} is required`,
                }}
              />
            </div>
          </Fieldset>
          <DoulaDateInput
            name="dateOfBirth"
            label="Date of birth"
            hint="For example: April 28 1986"
            monthName="dateOfBirthMonth"
            dayName="dateOfBirthDay"
            yearName="dateOfBirthYear"
            errors={errors}
            register={register}
          />
          <DoulaTextInputMask
            name="socialSecurityNumber"
            label={orderedInputNameToLabel["socialSecurityNumber"]}
            hint="Format XXX-XX-XXXX"
            inputMode="numeric"
            value={socialSecurityNumber ?? ""}
            mask="___-__-____"
            pattern="\d{3}-\d{2}-\d{4}"
            required
            errors={errors}
            register={register}
            registerOptions={{
              required: `${orderedInputNameToLabel["socialSecurityNumber"]} is required`,
              pattern: {
                value: /\d{3}-\d{2}-\d{4}/,
                message: "Entered value does not match social security number format",
              },
            }}
          />
        </div>
      </div>
      <HorizontalDivider />
      <div className="grid-row grid-gap-3 margin-top-3 margin-bottom-5">
        <div className="desktop:grid-col-8">
          <h2 className="font-heading-md">Contact information</h2>
          <p>We&apos;ll send official updates here.</p>
          <DoulaTextInput
            name="email"
            label={orderedInputNameToLabel["email"]}
            type="email"
            autoCorrect="off"
            autoCapitalize="off"
            required
            errors={errors}
            register={register}
            registerOptions={{
              required: `${orderedInputNameToLabel["email"]} is required`,
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Entered value does not match email format",
              },
            }}
          />
          <DoulaTextInputMask
            name="phoneNumber"
            label={orderedInputNameToLabel["phoneNumber"]}
            type="tel"
            value={phoneNumber ?? ""}
            inputMode="numeric"
            mask="___-___-____"
            pattern="\d{3}-\d{3}-\d{4}"
            required
            errors={errors}
            register={register}
            registerOptions={{
              required: `${orderedInputNameToLabel["phoneNumber"]} is required`,
              pattern: {
                value: /\d{3}-\d{3}-\d{4}/,
                message: "Entered value does not match phone number format",
              },
            }}
          />
        </div>
      </div>
      <HorizontalDivider />
      <FormProgressButtons />
    </DoulaForm>
  );
};

export default PersonalDetailsStep1;
