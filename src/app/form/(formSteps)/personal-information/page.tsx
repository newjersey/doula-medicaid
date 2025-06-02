"use client";

import React, { useEffect, useState } from "react";

interface FormData {
  firstName: string | null;
}

const PersonalInformationStep: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ firstName: null });
  // const [formData, setFormData] = useState<>();
  // const { formData, setFormData } = useContext(FormContext);

  useEffect(() => {
    setFormData({
      firstName: window?.sessionStorage.getItem("firstName"),
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    window.sessionStorage.setItem("firstName", value);
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
      </form>
    </div>
  );
};

export default PersonalInformationStep;
