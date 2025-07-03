import React, { useState } from "react";
import { zipForms } from "../utils/zip";
import { parseAetnaForm } from "./forms/aetna";
import type { FormData } from "./forms/form";
import { fillAllForms } from "./forms/form";

const Form: React.FC = () => {
  const [file, setFile] = useState<File>();
  const [formData, setFormData] = useState<FormData>({
    ccEmail: "",
    dob: "",
    firstName: "",
    groupPracticeAddress: "",
    groupPracticeName: "",
    lastName: "",
  });
  const [zipDownloadUrl, setZipDownloadUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (file) {
      const parsedFormData = await parseAetnaForm(file);
      setFormData({
        ...formData,
        ...parsedFormData,
      });
      return;
    }

    const filledForms = await fillAllForms(formData);
    const zipBlob = await zipForms(filledForms);
    setZipDownloadUrl(URL.createObjectURL(zipBlob));

    // TODO: I want to replace this with simply drafting an email
    // Send the PDF to the backend
    // await fetch("/api/send-email", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ ccEmail: formData.ccEmail, pdfBytes: aetnaBase64 }),
    // });
  };

  return (
    <form onSubmit={void handleSubmit} className="usa-form">
      <label className="usa-label" htmlFor="ccEmail">
        Your Email
      </label>
      <input
        className="usa-input"
        id="ccEmail"
        name="ccEmail"
        type="email"
        value={formData.ccEmail}
        onChange={handleChange}
      />

      <label className="usa-label" htmlFor="firstName">
        First Name
      </label>
      <input
        className="usa-input"
        id="firstName"
        name="firstName"
        type="text"
        value={formData.firstName}
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
        value={formData.lastName}
        onChange={handleChange}
      />

      <label className="usa-label" htmlFor="dob">
        Date of Birth
      </label>
      <input
        className="usa-input"
        id="dob"
        name="dob"
        type="text"
        value={formData.dob}
        onChange={handleChange}
      />

      <button className="usa-button" type="submit">
        Submit
      </button>

      {zipDownloadUrl && (
        <div>
          <a href={zipDownloadUrl} download="filled_forms.zip">
            Click here to download the ZIP
          </a>
        </div>
      )}

      <div>
        <label className="usa-label">
          Upload filled pdf:
          <input
            className="usa-input"
            type="file"
            name="filledForm"
            accept=".pdf"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </form>
  );
};

export default Form;
