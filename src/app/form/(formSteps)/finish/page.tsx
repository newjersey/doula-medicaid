"use client";

import { ValueNotFoundError } from "@/app/form/_utils/sessionStorage";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { fillAllForms, getFormData } from "@form/_utils/fillPdf/form";
import { zipForms } from "@form/_utils/fillPdf/zip";
import { useEffect, useState } from "react";

const FinishSection = () => {
  const [zipDownloadUrl, setZipDownloadUrl] = useState<string | null>(null);
  const [hasMissingValues, setHasMissingValues] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      try {
        const formData = getFormData();
        setHasMissingValues(false);
        const filledForms = await fillAllForms(formData);
        const zipBlob = await zipForms(filledForms);
        setZipDownloadUrl(URL.createObjectURL(zipBlob));
      } catch (e) {
        if (e instanceof ValueNotFoundError) {
          setHasMissingValues(true);
        } else {
          throw e;
        }
      }
    })();
  }, []);

  return (
    <div>
      {zipDownloadUrl && (
        <a href={zipDownloadUrl} download="filled_forms.zip">
          Download your forms
        </a>
      )}
      {hasMissingValues && (
        <div>Not all required fields have been filled out. Please fill all required fields.</div>
      )}
      <FormProgressButtons />
    </div>
  );
};

export default FinishSection;
