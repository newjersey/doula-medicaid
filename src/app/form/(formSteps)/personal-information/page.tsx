"use client";

import {
  DatePicker,
  Fieldset,
  Form,
  Label,
  TextInput,
  TextInputMask,
} from "@trussworks/react-uswds";
import React, { useEffect, useState } from "react";
import { formatDateOfBirthDefaultValue as formatAppointmentDateDefaultValue } from "../../_utils/inputFields/dateOfBirth";
import { getValue, setKeyValue } from "../../_utils/sessionStorage";

interface PersonalInformationData {
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  appointmentDate: string | null;
  phoneNumber: string | null;
  email: string | null;
  npiNumber: string | null;
  socialSecurityNumber: string | null;
  streetAddress1: string | null;
  streetAddress2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
}

const MM_DD_YYYY = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;

const dateIsValid = (date: string): boolean => {
  const found = date.match(MM_DD_YYYY);
  return !!found;
};

const PersonalInformationStep: React.FC = () => {
  const [dataHasLoaded, setDataHasLoaded] = useState<boolean>(false);
  const [personalInformationData, setPersonalInformationData] = useState<PersonalInformationData>({
    firstName: null,
    middleName: null,
    lastName: null,
    appointmentDate: null,
    phoneNumber: null,
    email: null,
    npiNumber: null,
    socialSecurityNumber: null,
    streetAddress1: null,
    streetAddress2: null,
    city: null,
    state: null,
    zip: null,
  });

  useEffect(() => {
    const storedState = getValue("state");
    if (!storedState) {
      setKeyValue("state", "NJ");
    }
    setPersonalInformationData({
      firstName: getValue("firstName"),
      middleName: getValue("middleName"),
      lastName: getValue("lastName"),
      appointmentDate: getValue("dateOfBirth"),
      phoneNumber: getValue("phoneNumber"),
      email: getValue("email"),
      npiNumber: getValue("npiNumber"),
      socialSecurityNumber: getValue("socialSecurityNumber"),
      streetAddress1: getValue("streetAddress1"),
      streetAddress2: getValue("streetAddress2"),
      city: getValue("city"),
      state: getValue("state"),
      zip: getValue("zip"),
    });
    setDataHasLoaded(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    handleValueChange(name, value);
  };

  const handleValueChange = (name: string, value: string | undefined) => {
    if (value === undefined) value = "";
    setPersonalInformationData((prev) => ({ ...prev, [name]: value }));
    setKeyValue(name, value);
  };
  return (
    <div>
      {dataHasLoaded && (
        <Form
          onSubmit={() => {
            throw new Error("Not implemented");
          }}
        >
          <Fieldset legend="Name" legendStyle="srOnly">
            <Label htmlFor="firstName">First name</Label>
            <TextInput
              id="firstName"
              name="firstName"
              type="text"
              required
              value={personalInformationData.firstName || ""}
              onChange={handleChange}
            />

            <Label
              // htmlFor="middleName"
              htmlFor="midddleName"
              hint=" (optional)"
            >
              Middle name
            </Label>
            <TextInput
              id="middleName"
              name="middleName"
              type="text"
              value={personalInformationData.middleName || ""}
              onChange={handleChange}
            />

            <Label htmlFor="lastName">Last name</Label>
            <TextInput
              id="lastName"
              name="lastName"
              type="text"
              required
              value={personalInformationData.lastName || ""}
              onChange={handleChange}
            />
          </Fieldset>

          <hr />

          <Label id="appointmentDateLabel" htmlFor="appointmentDate">
            Appointment date
          </Label>
          <div
            className="usa-hint"
            // id="appointmentDateHint"
          >
            mm/dd/yyyy
          </div>
          <DatePicker
            id="appointmentDate"
            name="appointmentDate"
            // aria-describedby="appointmentDateHint"
            aria-labelledby="appointmentDateLabel"
            /**
            The DatePicker component is a little weird, vs the other input components in the library
            1. Unlike other input components, it lacks a value prop for the parent to control its value. See https://github.com/trussworks/react-uswds/issues/3000
            2. Unlike other input components, the onChange fires with a string value, instead of a change event
            3. The change string value has the format MM/DD/YYYY, but the defaultValue prop needs to be in the format YYYY-MM-DD
           */
            key={dataHasLoaded.toString()}
            defaultValue={
              personalInformationData.appointmentDate
                ? formatAppointmentDateDefaultValue(
                    new Date(personalInformationData.appointmentDate),
                  )
                : undefined
            }
            onChange={(value) => {
              if (value === undefined || !dateIsValid(value)) {
                handleValueChange("appointmentDate", "");
                return;
              }
              handleValueChange("appointmentDate", value);
            }}
          />

          <Label htmlFor="phoneNumber">Phone number</Label>
          <TextInputMask
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            inputMode="text"
            mask="___-___-____"
            pattern="\d{3}-\d{3}-\d{4}"
            required
            value={personalInformationData.phoneNumber || ""}
            onChange={handleChange}
          />
        </Form>
      )}
    </div>
  );
};

export default PersonalInformationStep;
