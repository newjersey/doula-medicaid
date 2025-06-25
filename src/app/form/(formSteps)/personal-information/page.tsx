"use client";

import {
  DatePicker,
  Fieldset,
  Form,
  Label,
  Select,
  TextInput,
  TextInputMask,
} from "@trussworks/react-uswds";
import React, { useEffect, useState } from "react";
import { formatDateOfBirthDefaultValue } from "../../_utils/inputFields/dateOfBirth";
import { AddressState } from "../../_utils/inputFields/types";
import { getValue, setKeyValue } from "../../_utils/sessionStorage";

interface PersonalInformationData {
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  phoneNumber: string | null;
  email: string | null;
  npiNumber: string | null;
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
    dateOfBirth: null,
    phoneNumber: null,
    email: null,
    npiNumber: null,
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
      dateOfBirth: getValue("dateOfBirth"),
      phoneNumber: getValue("phoneNumber"),
      email: getValue("email"),
      npiNumber: getValue("npiNumber"),
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
            throw "Not implemented";
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

            <Label htmlFor="middleName" hint=" (optional)">
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

          <Label id="dateOfBirthLabel" htmlFor="dateOfBirth">
            Date of birth
          </Label>
          <div className="usa-hint" id="dateOfBirthHint">
            mm/dd/yyyy
          </div>
          <DatePicker
            id="dateOfBirth"
            name="dateOfBirth"
            aria-describedby="dateOfBirthHint"
            aria-labelledby="dateOfBirthLabel"
            /**
            The DatePicker component is a little weird, vs the other input components in the library
            1. Unlike other input components, it lacks a value prop for the parent to control its value. See https://github.com/trussworks/react-uswds/issues/3000
            2. Unlike other input components, the onChange fires with a string value, instead of a change event
            3. The change string value has the format MM/DD/YYYY, but the defaultValue prop needs to be in the format YYYY-MM-DD
           */
            key={dataHasLoaded.toString()}
            defaultValue={
              personalInformationData.dateOfBirth
                ? formatDateOfBirthDefaultValue(new Date(personalInformationData.dateOfBirth))
                : undefined
            }
            onChange={(value) => {
              if (value === undefined || !dateIsValid(value)) {
                handleValueChange("dateOfBirth", "");
                return;
              }
              handleValueChange("dateOfBirth", value);
            }}
          />

          <Label htmlFor="phoneNumber">Phone number</Label>
          <TextInputMask
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            inputMode="numeric"
            mask="___-___-____"
            pattern="\d{3}-\d{3}-\d{4}"
            required
            value={personalInformationData.phoneNumber || ""}
            onChange={handleChange}
          />

          <Label htmlFor="email">Email address</Label>
          <TextInput
            id="email"
            name="email"
            type="email"
            autoCorrect="off"
            autoCapitalize="off"
            required
            value={personalInformationData.email || ""}
            onChange={handleChange}
          />

          <Label htmlFor="npiNumber">NPI number</Label>
          <TextInputMask
            id="npiNumber"
            name="npiNumber"
            type="tel"
            inputMode="numeric"
            mask="__________"
            pattern="\d{10}"
            required
            value={personalInformationData.npiNumber || ""}
            onChange={handleChange}
          />

          <hr />

          <Fieldset legend="Mail to address" legendStyle="srOnly">
            <Label htmlFor="streetAddress1">Street address 1</Label>
            <TextInput
              id="streetAddress1"
              name="streetAddress1"
              type="text"
              inputMode="numeric"
              required
              value={personalInformationData.streetAddress1 || ""}
              onChange={handleChange}
            />

            <Label htmlFor="streetAddress2" hint=" (optional)">
              Street address 2
            </Label>
            <TextInput
              id="streetAddress2"
              name="streetAddress2"
              type="text"
              value={personalInformationData.streetAddress2 || ""}
              onChange={handleChange}
            />

            <div className="grid-row grid-gap">
              <div className="mobile-lg:grid-col-8">
                <Label htmlFor="city">City</Label>
                <TextInput
                  className="usa-input"
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={personalInformationData.city || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mobile-lg:grid-col-4">
                <Label htmlFor="state">State</Label>
                <Select
                  className="usa-select"
                  id="state"
                  name="state"
                  required
                  value={personalInformationData.state || ""}
                  onChange={handleChange}
                >
                  {Object.keys(AddressState).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <Label htmlFor="zip">ZIP code</Label>
            <TextInput
              className="usa-input usa-input--medium"
              id="zip"
              name="zip"
              type="text"
              pattern="[\d]{5}(-[\d]{4})?"
              required
              value={personalInformationData.zip || ""}
              onChange={handleChange}
            />
          </Fieldset>
        </Form>
      )}
    </div>
  );
};

export default PersonalInformationStep;
