import React, { useState } from 'react';
import JSZip from 'jszip';

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

  const fillAetna = async (data: FormData) => {
    const { PDFDocument } = await import('pdf-lib');
    const existingPdfBytes = await fetch('/pdf/aetna.pdf').then((res) =>
      res.arrayBuffer()
    );
  
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
  
    const firstNameField = form.getTextField('Text3');
    firstNameField.setText(data.firstName);
  
    const lastNameField = form.getTextField('Text1');
    lastNameField.setText(data.lastName);
  
    const dobField = form.getTextField('Text2');
    dobField.setText(data.dob);
  
    return await pdfDoc.save();
    // return Buffer.from(pdfBytes).toString('base64');
  };

  const fillFidelis = async (data: FormData) => {
    const { PDFDocument } = await import('pdf-lib');
    const existingPdfBytes = await fetch('/pdf/fidelis.pdf').then((res) =>
      res.arrayBuffer()
    );
  
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
  
    const firstNameField = form.getTextField('Text2');
    firstNameField.setText(data.firstName);
  
    const lastNameField = form.getTextField('Text1');
    lastNameField.setText(data.lastName);
  
    const dobField = form.getTextField('Text3');
    dobField.setText(data.dob);
  
    return await pdfDoc.save();
    // return Buffer.from(pdfBytes).toString('base64');
  };

  const zipForms = async (forms: Uint8Array<ArrayBufferLike>[]) => {
    const zip = new JSZip();

    zip.file('aetna_filled.pdf', forms[0]);
    zip.file('fidelis_filled.pdf', forms[1]);

    return await zip.generateAsync({ type: 'blob' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const aetnaBytes = await fillAetna(formData)
    const fidelisBytes = await fillFidelis(formData)

    const zipBlob = await zipForms([aetnaBytes, fidelisBytes])
  
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filled_forms.zip';
    a.click();

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
    </form>
  );
};

export default Form;
