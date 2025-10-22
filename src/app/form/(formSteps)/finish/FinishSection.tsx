"use client";

import { ValueNotFoundError } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { fillFfsIndividualForm } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { getFormData } from "@form/_utils/fillPdf/form";
import { sendGAEvent } from "@next/third-parties/google";
import { useEffect, useState } from "react";

const FinishSection = () => {
  const [downloadData, setDownloadData] = useState<{
    url: string;
    filename: string;
  } | null>(null);
  const [hasMissingValues, setHasMissingValues] = useState<boolean>(false);
  const { dataStore } = useDataStore();

  const stringifiedDataStore = JSON.stringify(dataStore);
  useEffect(() => {
    (async () => {
      try {
        const formData = getFormData(JSON.parse(stringifiedDataStore));
        setHasMissingValues(false);
        const filledFfsIndividualForm = await fillFfsIndividualForm(formData);
        setDownloadData({
          /**
           * `filledFfsIndividualForm.bytes` is a `Uint8Array<ArrayBufferLike>`.
           *
           * Wrapping it in another `new Uint8Array()` is needed to convert it to a
           * `Uint8Array<ArrayBuffer>` (no "Like"), which the Blob constructor wants.
           * https://github.com/microsoft/TypeScript/pull/59417
           */
          url: URL.createObjectURL(new Blob([new Uint8Array(filledFfsIndividualForm.bytes)])),
          filename: filledFfsIndividualForm.filename,
        });
      } catch (e) {
        if (e instanceof ValueNotFoundError) {
          setHasMissingValues(true);
        } else {
          throw e;
        }
      }
    })();
  }, [stringifiedDataStore]);

  return (
    <div className="margin-top-5 margin-bottom-5">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {downloadData === null && hasMissingValues === false && (
          <>
            <h1 className="font-heading-lg">Filling your application...</h1>
          </>
        )}
        {hasMissingValues && (
          <>
            <h1 className="font-heading-lg">Some form fields are missing</h1>
            <p>Please go through previous steps and fill all required fields.</p>
          </>
        )}
        {downloadData && (
          <>
            <div className="font-heading-2xl">🎉</div>
            <h1 className="font-heading-lg">Great job! Next, download your application.</h1>
            <p style={{ textAlign: "center" }}>
              Download your pre-filled application forms and follow the instructions on the cover
              page to complete and submit your Medicaid Fee-for-Service application.
            </p>
            <a
              href={downloadData.url}
              download={downloadData.filename}
              className="usa-button margin-right-0 margin-top-4"
              onClick={() => sendGAEvent("event", "buttonClicked", { name: "downloadApplication" })}
            >
              Download your application
            </a>
          </>
        )}
        <FormProgressButtons overrideClassNames="margin-top-2" />
      </div>
    </div>
  );
};

export default FinishSection;
