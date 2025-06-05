"use client";

import { zipForms } from "@/app/utils/zip";
import React, { useEffect, useState } from "react";
import { fillAllForms, FormData } from "../../_utils/form";

const getFormData = (): FormData => {
  const dateOfBirthString = window?.sessionStorage.getItem("dateOfBirth");
  const dateOfBirth = dateOfBirthString ? new Date(dateOfBirthString) : null;

  return {
    firstName: window?.sessionStorage.getItem("firstName") || null,
    lastName: window?.sessionStorage.getItem("lastName") || null,
    dateOfBirth: dateOfBirth,
  };
};

const FormStep: React.FC = () => {
  const [zipDownloadUrl, setZipDownloadUrl] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const filledForms = await fillAllForms(getFormData());
      const zipBlob = await zipForms(filledForms);
      setZipDownloadUrl(URL.createObjectURL(zipBlob));
    })();
  }, []);

  return (
    <div>
      {zipDownloadUrl && (
        <a href={zipDownloadUrl} download="filled_forms.zip">
          Click here to download the ZIP
        </a>
      )}
    </div>
  );
};

export default FormStep;
