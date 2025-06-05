"use client";

import React, { useEffect, useState } from "react";

interface PersonalInformationData {
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
}

const PersonalInformationStep: React.FC = () => {
  const [personalInformationData, setPersonalInformationData] = useState<PersonalInformationData>({
    firstName: null,
    lastName: null,
    dateOfBirth: null,
  });

  useEffect(() => {
    setPersonalInformationData({
      firstName: window?.sessionStorage.getItem("firstName"),
      lastName: window?.sessionStorage.getItem("lastName"),
      dateOfBirth: window?.sessionStorage.getItem("dateOfBirth"),
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInformationData((prev) => ({ ...prev, [name]: value }));
    window.sessionStorage.setItem(name, value);
  };
  return (
    <div>
      <form className="usa-form">
        <label className="usa-label" htmlFor="firstName">
          First Name
        </label>
        <input
          className="usa-input"
          id="firstName"
          name="firstName"
          type="text"
          value={personalInformationData.firstName || ""}
          onChange={handleChange}
        />
        <label className="usa-label" htmlFor="lastName">
          Last Name
        </label>
        <input
          className="usa-input"
          id="lastName"
          name="lastName"
          type="text"
          value={personalInformationData.lastName || ""}
          onChange={handleChange}
        />
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
      </form>
    </div>
  );
};

export default PersonalInformationStep;
