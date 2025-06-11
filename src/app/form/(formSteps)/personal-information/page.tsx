"use client";

import React, { useEffect, useState } from "react";
import { AddressState } from "../../_utils/types";

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
      firstName: window?.sessionStorage.getItem("firstName"),
      middleName: window?.sessionStorage.getItem("middleName"),
      lastName: window?.sessionStorage.getItem("lastName"),
      dateOfBirth: window?.sessionStorage.getItem("dateOfBirth"),
      streetAddress1: window?.sessionStorage.getItem("streetAddress1"),
      streetAddress2: window?.sessionStorage.getItem("streetAddress2"),
      city: window?.sessionStorage.getItem("city"),
      state: window?.sessionStorage.getItem("state") || "NJ",
      zip: window?.sessionStorage.getItem("zip"),
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonalInformationData((prev) => ({ ...prev, [name]: value }));
    window.sessionStorage.setItem(name, value);
  };
  return (
    <div>
      <form className="usa-form">
        <fieldset className="usa-fieldset">
          <legend className="usa-legend">Name</legend>

          <label className="usa-label" htmlFor="firstName">
            First name
          </label>
          <input
            className="usa-input"
            id="firstName"
            name="firstName"
            type="text"
            required
            aria-required="true"
            value={personalInformationData.firstName || ""}
            onChange={handleChange}
          />

          <label className="usa-label" htmlFor="middleName">
            Middle name <span className="usa-hint">(optional)</span>
          </label>
          <input
            className="usa-input"
            id="middleName"
            name="middleName"
            type="text"
            value={personalInformationData.middleName || ""}
            onChange={handleChange}
          />

          <label className="usa-label" htmlFor="lastName">
            Last name
          </label>
          <input
            className="usa-input"
            id="lastName"
            name="lastName"
            type="text"
            required
            aria-required="true"
            value={personalInformationData.lastName || ""}
            onChange={handleChange}
          />
        </fieldset>

        <label className="usa-label" htmlFor="dateOfBirth">
          Date of Birth
        </label>
        <div className="usa-hint" id="dateOfBirthDescription">
          mm/dd/yyyy
        </div>
        <div className="usa-date-picker">
          <input
            className="usa-input"
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            aria-describedby="dateOfBirthDescription"
            value={personalInformationData.dateOfBirth || ""}
            onChange={handleChange}
          />
        </div>
        <fieldset className="usa-fieldset">
          <legend className="usa-legend">Mail to address</legend>
          <label className="usa-label" htmlFor="streetAddress1">
            Street address 1
          </label>
          <input
            className="usa-input"
            id="streetAddress1"
            name="streetAddress1"
            type="text"
            value={personalInformationData.streetAddress1 || ""}
            onChange={handleChange}
          />

          <label className="usa-label" htmlFor="streetAddress2">
            Street address 2 <span className="usa-hint">(optional)</span>
          </label>
          <input
            className="usa-input"
            id="streetAddress2"
            name="streetAddress2"
            type="text"
            value={personalInformationData.streetAddress2 || ""}
            onChange={handleChange}
          />

          <div className="grid-row grid-gap">
            <div className="mobile-lg:grid-col-8">
              <label className="usa-label" htmlFor="city">
                City
              </label>
              <input
                className="usa-input"
                id="city"
                name="city"
                type="text"
                value={personalInformationData.city || ""}
                onChange={handleChange}
              />
            </div>
            <div className="mobile-lg:grid-col-4">
              <label className="usa-label" htmlFor="state">
                State
              </label>
              <select
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
              </select>
            </div>
          </div>

          <label className="usa-label" htmlFor="zip">
            ZIP
          </label>
          <input
            className="usa-input usa-input--medium"
            id="zip"
            name="zip"
            type="text"
            pattern="[\d]{5}(-[\d]{4})?"
            value={personalInformationData.zip || ""}
            onChange={handleChange}
          />
        </fieldset>
      </form>
    </div>
  );
};

export default PersonalInformationStep;
