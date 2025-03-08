import React, { useState } from 'react';

interface FormData {
  ccEmail: string;
  dob: string;
  firstName: string;
  lastName: string;
}

const Form: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(
    { ccEmail: '', dob: '', firstName: '', lastName: '' }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const { PDFDocument } = await import('pdf-lib');
    const existingPdfBytes = await fetch('/aetna_application_form.pdf').then((res) =>
      res.arrayBuffer()
    );
  
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
  
    // Fill in the fields
    const firstNameField = form.getTextField('Text3');
    firstNameField.setText(formData.firstName);
  
    const lastNameField = form.getTextField('Text1');
    lastNameField.setText(formData.lastName);
  
    const dobField = form.getTextField('Text2');
    dobField.setText(formData.dob);
  
    const pdfBytes = await pdfDoc.save();
    const base64Pdf = Buffer.from(pdfBytes).toString('base64');
  
    // const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'filled-form.pdf';
    // a.click();

    // Send the PDF to the backend
    await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ccEmail: formData.ccEmail, pdfBytes: base64Pdf }),
    });
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
    </form>
  );
};

export default Form;
