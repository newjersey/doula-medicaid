import React, { useState } from 'react';
import { fillAllForms, FormData } from './forms/form';
import { zipForms } from './utils/zip';

const Form: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(
    {
      ccEmail: '',
      dob: '',
      firstName: '',
      groupPracticeAddress: '',
      groupPracticeName: '',
      lastName: ''
    }
  );
  const [zipDownloadUrl, setZipDownloadUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const filledForms = await fillAllForms(formData);
    const zipBlob = await zipForms(filledForms);
    setZipDownloadUrl(URL.createObjectURL(zipBlob));

    // TODO: I want to replace this with simply drafting an email
    // Send the PDF to the backend
    // await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ ccEmail: formData.ccEmail, pdfBytes: aetnaBase64 }),
    // });
  };

  return (
    <form onSubmit={handleSubmit} className="usa-form">
      <label className="usa-label" htmlFor="ccEmail">Your Email</label>
      <input
        className="usa-input"
        id="ccEmail"
        name="ccEmail"
        type="email"
        value={formData.ccEmail}
        onChange={handleChange}
      />

      <label className="usa-label" htmlFor="firstName">First Name</label>
      <input
        className="usa-input"
        id="firstName"
        name="firstName"
        type="text"
        value={formData.firstName}
        onChange={handleChange}
      />

      <label className="usa-label" htmlFor="lastName">Last Name</label>
      <input
        className="usa-input"
        id="lastName"
        name="lastName"
        type="text"
        value={formData.lastName}
        onChange={handleChange}
      />

      <label className="usa-label" htmlFor="dob">Date of Birth</label>
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

      {
        zipDownloadUrl && (
          <div>
            <a href={zipDownloadUrl} download="filled_forms.zip">
              Click here to download the ZIP
            </a>
          </div>
        )
      }
<div>
      <label>Upload filled pdf:
      <input type="file" name="filledForm" accept=".pdf" />
      </label>
</div>
    </form>
  );
};

export default Form;
