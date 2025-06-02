"use client";

import { zipForms } from "@/app/utils/zip";
import React, { useEffect, useState } from "react";
import { fillAllForms } from "../../_utils/form";

const getFormData = () => {
  return {
    firstName: window?.sessionStorage.getItem("firstName") || "",
    lastName: window?.sessionStorage.getItem("lastName") || "",
    ccEmail: "",
    dob: "",
    groupPracticeAddress: "",
    groupPracticeName: "",
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
