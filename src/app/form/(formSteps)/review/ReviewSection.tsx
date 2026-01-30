import { BASE_PATH } from "@/app/basePath";
import { ValueNotFoundError } from "@/app/form/_utils/dataStore";
import { useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { fillFfsIndividualForm } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import { getFormData } from "@form/_utils/fillPdf/form";
import { useEffect, useState } from "react";

const ReviewSection = () => {
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
            <div>
              <img src={`${BASE_PATH}/img/review_checklist.png`} width={53} alt="Checklist" />
            </div>
            <h1 className="font-heading-lg">Great job! You are almost done.</h1>
            <p>
              We pre-populated your Medicaid FFS application with the information you entered, but
              you need to finish some remaining sections.
            </p>
            <p>
              Click <span className="text-italic">“Download and review”</span> below. Carefully
              follow instructions on the cover page to review, complete, and submit your application
              packet.
            </p>
            <a
              href={downloadData.url}
              download={downloadData.filename}
              className="usa-button margin-right-0 margin-top-4"
              onClick={() => gtag("event", "downloadApplication")}
            >
              Download and review
            </a>
          </>
        )}
        <FormProgressButtons overrideClassNames="margin-top-2" />
      </div>
    </div>
  );
};

export default ReviewSection;
