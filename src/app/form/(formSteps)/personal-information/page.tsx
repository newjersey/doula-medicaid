"use client";

import { DatePicker, Fieldset, Form, Label, Select, TextInput } from "@trussworks/react-uswds";
import React, { useEffect, useState } from "react";
import { formatDateOfBirthDefaultValue } from "../../_utils/inputFields/dateOfBirth";
import { AddressState } from "../../_utils/inputFields/types";
import { getValue, setKeyValue } from "../../_utils/sessionStorage";

interface PersonalInformationData {
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  streetAddress1: string | null;
  streetAddress2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
}

const PersonalInformationStep: React.FC = () => {
  const [defaultDateOfBirth, setDefaultDateOfBirth] = useState<string | undefined>(undefined);
  const [personalInformationData, setPersonalInformationData] = useState<PersonalInformationData>({
    firstName: null,
    middleName: null,
    lastName: null,
    dateOfBirth: null,
    streetAddress1: null,
    streetAddress2: null,
    city: null,
    state: null,
    zip: null,
  });

  useEffect(() => {
    setPersonalInformationData({
      firstName: getValue("firstName"),
      middleName: getValue("middleName"),
      lastName: getValue("lastName"),
      dateOfBirth: getValue("dateOfBirth"),
      streetAddress1: getValue("streetAddress1"),
      streetAddress2: getValue("streetAddress2"),
      city: getValue("city"),
      state: getValue("state") || "NJ",
      zip: getValue("zip"),
    });
    setDefaultDateOfBirth(getValue("dateOfBirth") || undefined);
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
      <Form
        onSubmit={() => {
          throw "Not implemented";
        }}
      >
        <Fieldset legend="Name">
          <Label htmlFor="firstName">First name</Label>
          <TextInput
            id="firstName"
            name="firstName"
            type="text"
            required
            aria-required="true"
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
            aria-required="true"
            value={personalInformationData.lastName || ""}
            onChange={handleChange}
          />
        </Fieldset>

        <Label id="dateOfBirthLabel" htmlFor="dateOfBirth">
          Date of Birth
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
          key={defaultDateOfBirth}
          {...(defaultDateOfBirth && {
            defaultValue:
              defaultDateOfBirth && formatDateOfBirthDefaultValue(new Date(defaultDateOfBirth)),
          })}
          onChange={(value) => handleValueChange("dateOfBirth", value)}
        />

        <Fieldset legend="Mail to address">
          <Label htmlFor="streetAddress1">Street address 1</Label>
          <TextInput
            id="streetAddress1"
            name="streetAddress1"
            type="text"
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

          <Label htmlFor="zip">ZIP</Label>
          <TextInput
            className="usa-input usa-input--medium"
            id="zip"
            name="zip"
            type="text"
            pattern="[\d]{5}(-[\d]{4})?"
            value={personalInformationData.zip || ""}
            onChange={handleChange}
          />
        </Fieldset>
      </Form>
    </div>
  );
};

export default PersonalInformationStep;
