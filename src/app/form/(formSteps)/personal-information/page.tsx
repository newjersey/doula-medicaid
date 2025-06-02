"use client";

import React, { useEffect, useState } from "react";

interface PersonalInformationFormData {
  firstName: string | null;
  lastName: string | null;
}

const PersonalInformationStep: React.FC = () => {
  const [formData, setFormData] = useState<PersonalInformationFormData>({
    firstName: null,
    lastName: null,
  });

  useEffect(() => {
    setFormData({
      firstName: window?.sessionStorage.getItem("firstName"),
      lastName: window?.sessionStorage.getItem("lastName"),
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          value={formData.firstName || ""}
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
          value={formData.lastName || ""}
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
            type="text"
            aria-describedby="dateOfBirthDescription"
          />
        </div>
      </form>
    </div>
  );
};

export default PersonalInformationStep;
