'use client'

import React, { useState } from 'react';

const CheckerPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const validatePdf = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/validate-pdf', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result);

      // const result = await validatePDF(selectedFile.name);
      // console.log(result);
    } else {
      console.log('No file selected');
    }
  };

  return (
    <div>
      <h1 className="usa-heading">Doula Application PDF Checker</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />
      <button onClick={validatePdf}>Validate PDF</button>
    </div>
  );
};

export default CheckerPage;
