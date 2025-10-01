"use client";

import { HorizontalDivider } from "@/app/components/HorizontalDivider";
import DoulaTextInput from "@/app/form/(formSteps)/components/DoulaTextInput";
import DoulaTextInputMask from "@/app/form/(formSteps)/components/DoulaTextInputMask";
import { ErrorMessage } from "@/app/form/(formSteps)/components/ErrorMessage";
import { type PersonalDetails1Data } from "@/app/form/(formSteps)/personal-details/PersonalDetailsData";
import { getDefaultValue } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { DoulaForm } from "@/app/form/components/DoulaForm";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { DateInputGroup, Fieldset, FormGroup, Label, Select } from "@trussworks/react-uswds";
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

          <Fieldset legend="Date of birth" className="margin-top-3" requiredMarker>
            <span className="usa-hint" id="dateOfBirthHint">
              For example: April 28 1986
            </span>
            <DateInputGroup aria-describedby="dateOfBirthHint">
              <FormGroup className="usa-form-group--month usa-form-group--select">
                <Label htmlFor="dateOfBirthMonth" requiredMarker>
                  {orderedInputNameToLabel["dateOfBirthMonth"]}
                </Label>
                <Select
                  id="dateOfBirthMonth"
                  required
                  validationStatus={errors.dateOfBirthMonth ? "error" : undefined}
                  aria-invalid={errors.dateOfBirthMonth ? "true" : "false"}
                  aria-describedby={errors.dateOfBirthMonth ? "dateOfBirthMonthErrorMessage" : ""}
                  {...register("dateOfBirthMonth", {
                    required: `${orderedInputNameToLabel["dateOfBirthMonth"]} is required`,
                  })}
                >
                  <option value="1">01 - January</option>
                  <option value="2">02 - February</option>
                  <option value="3">03 - March</option>
                  <option value="4">04 - April</option>
                  <option value="5">05 - May</option>
                  <option value="6">06 - June</option>
                  <option value="7">07 - July</option>
                  <option value="8">08 - August</option>
                  <option value="9">09 - September</option>
                  <option value="10">10 - October</option>
                  <option value="11">11 - November</option>
                  <option value="12">12 - December</option>
                </Select>
              </FormGroup>
              <FormGroup className="usa-form-group--day">
                <DoulaTextInput
                  name="dateOfBirthDay"
                  label={orderedInputNameToLabel["dateOfBirthDay"]}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={2}
                  minLength={2}
                  required
                  hideErrorMessage
                  errors={errors}
                  register={register}
                  registerOptions={{
                    required: `${orderedInputNameToLabel["dateOfBirthDay"]} is required`,
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: `${orderedInputNameToLabel["dateOfBirthDay"]} must be between 1 and 31`,
                    },
                    max: {
                      value: 31,
                      message: `${orderedInputNameToLabel["dateOfBirthDay"]} must be between 1 and 31`,
                    },
                    validate: (value) => {
                      if (value === null) {
                        return `${orderedInputNameToLabel["dateOfBirthDay"]} is required`;
                      }
                      if (Number.isNaN(value) || typeof value === "string") {
                        return `${orderedInputNameToLabel["dateOfBirthDay"]} must be a number`;
                      }
                      return true;
                    },
                  }}
                />
              </FormGroup>
              <FormGroup className="usa-form-group--year">
                <DoulaTextInput
                  name="dateOfBirthYear"
                  label={orderedInputNameToLabel["dateOfBirthYear"]}
                  maxLength={4}
                  minLength={4}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  required
                  hideErrorMessage
                  errors={errors}
                  register={register}
                  registerOptions={{
                    required: `${orderedInputNameToLabel["dateOfBirthYear"]} is required`,
                    valueAsNumber: true,
                    validate: (value) => {
                      if (value === null) {
                        return `${orderedInputNameToLabel["dateOfBirthYear"]} is required`;
                      }
                      if (Number.isNaN(value) || typeof value === "string") {
                        return `${orderedInputNameToLabel["dateOfBirthYear"]} must be a number`;
                      }
                      if ((value as number).toString().length !== 4) {
                        return `${orderedInputNameToLabel["dateOfBirthYear"]} must have four digits`;
                      }
                      return true;
                    },
                  }}
                />
              </FormGroup>
            </DateInputGroup>
            <ErrorMessage name="dateOfBirthMonth" errors={errors} />
            <ErrorMessage name="dateOfBirthDay" errors={errors} />
            <ErrorMessage name="dateOfBirthYear" errors={errors} />
          </Fieldset>
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
