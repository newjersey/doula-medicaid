"use client";

import { zipForms } from "@/app/utils/zip";
import React, { useEffect, useState } from "react";
import { fillAllForms, FormData } from "../../_utils/fillPdf/form";
import { AddressState, DisclosingEntity } from "../../_utils/inputFields/enums";
import { getValue } from "../../_utils/sessionStorage";

const getFormData = (): FormData => {
  const dateOfBirthString = getValue("dateOfBirth");
  const dateOfBirth = dateOfBirthString ? new Date(dateOfBirthString) : null;

  const stateString = (getValue("state") as keyof typeof AddressState) || null;
  const state = stateString ? AddressState[stateString] : null;
  const disclosingEntityString =
    (getValue("natureOfDisclosingEntity") as keyof typeof DisclosingEntity) || null;
  const disclosingEntity = disclosingEntityString ? DisclosingEntity[disclosingEntityString] : null;

  return {
    firstName: getValue("firstName"),
    middleName: getValue("middleName"),
    lastName: getValue("lastName"),
    dateOfBirth: dateOfBirth,
    phoneNumber: getValue("phoneNumber"),
    email: getValue("email"),
    npiNumber: getValue("npiNumber"),
    streetAddress1: getValue("streetAddress1"),
    streetAddress2: getValue("streetAddress2"),
    city: getValue("city"),
    state: state,
    zip: getValue("zip"),
    natureOfDisclosingEntity: disclosingEntity,
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
