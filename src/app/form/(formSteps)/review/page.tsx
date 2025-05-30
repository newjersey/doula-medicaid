"use client";

import { zipForms } from "@/app/utils/zip";
import React, { useEffect, useState } from "react";
import { fillAllForms } from "../../_utils/form";

const FormStep: React.FC = () => {
  const [zipDownloadUrl, setZipDownloadUrl] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const filledForms = await fillAllForms({
        firstName: window?.sessionStorage.getItem("firstName") || "",
        ccEmail: "",
        dob: "",
        groupPracticeAddress: "",
        groupPracticeName: "",
        lastName: "",
      });
      const zipBlob = await zipForms(filledForms);
      setZipDownloadUrl(URL.createObjectURL(zipBlob));
    })();
  }, []);

  return (
    <div>
      <a href={zipDownloadUrl} download="filled_forms.zip">
        Click here to download the ZIP
      </a>
    </div>
  );
};

export default FormStep;
