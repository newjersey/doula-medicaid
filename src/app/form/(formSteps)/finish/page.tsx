"use client";

import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { fillAllForms, getFormData } from "@form/_utils/fillPdf/form";
import { zipForms } from "@form/_utils/fillPdf/zip";
import { useEffect, useState } from "react";

const FinishSection = () => {
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
          Download your forms
        </a>
      )}
      <FormProgressButtons />
    </div>
  );
};

export default FinishSection;
