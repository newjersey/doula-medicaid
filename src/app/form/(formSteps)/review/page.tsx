"use client";

import { zipForms } from "@/app/utils/zip";
import React, { useEffect, useState } from "react";
import { fillAllForms, FormData } from "../../_utils/form";
import { AddressState } from "../../_utils/types";

const getFormData = (): FormData => {
  const dateOfBirthString = window?.sessionStorage.getItem("dateOfBirth");
  const dateOfBirth = dateOfBirthString ? new Date(dateOfBirthString) : null;

  const stateString =
    (window?.sessionStorage.getItem("state") as keyof typeof AddressState) || null;
  const state = stateString ? AddressState[stateString] : null;

  return {
    firstName: window?.sessionStorage.getItem("firstName"),
    middleName: window?.sessionStorage.getItem("middleName"),
    lastName: window?.sessionStorage.getItem("lastName"),
    dateOfBirth: dateOfBirth,
    streetAddress1: window?.sessionStorage.getItem("streetAddress1"),
    streetAddress2: window?.sessionStorage.getItem("streetAddress2"),
    city: window?.sessionStorage.getItem("city"),
    state: state,
    zip: window?.sessionStorage.getItem("zip"),
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
