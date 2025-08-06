"use client";

import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import type { FormData } from "@form/_utils/fillPdf/form";
import { fillAllForms } from "@form/_utils/fillPdf/form";
import { zipForms } from "@form/_utils/fillPdf/zip";
import { AddressState, DisclosingEntity } from "@form/_utils/inputFields/enums";
import { getValue, setKeyValue } from "@form/_utils/sessionStorage";
import dynamic from "next/dynamic";
import React, { useState } from "react";

const SignatureMaker = dynamic(
  () => import("@docuseal/signature-maker-react").then((mod) => ({ default: mod.SignatureMaker })),
  {
    ssr: false,
  },
);

const convertToBoolean = (value: string | null): boolean | null => {
  if (value === null) return null;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Invalid boolean value: ${value}`);
};

const getFormData = (): FormData => {
  const dateOfBirthString = getValue("dateOfBirth");
  const dateOfBirth = dateOfBirthString ? new Date(dateOfBirthString) : null;

  const stateString = (getValue("state") as keyof typeof AddressState) || null;
  const state = stateString ? AddressState[stateString] : null;
  const disclosingEntity =
    convertToBoolean(getValue("isSoleProprietorship")) === true
      ? DisclosingEntity.SoleProprietorship
      : null;

  return {
    firstName: getValue("firstName"),
    middleName: getValue("middleName"),
    lastName: getValue("lastName"),
    dateOfBirth: dateOfBirth,
    phoneNumber: getValue("phoneNumber"),
    email: getValue("email"),
    npiNumber: getValue("npiNumber"),
    socialSecurityNumber: getValue("socialSecurityNumber"),
    streetAddress1: getValue("streetAddress1"),
    streetAddress2: getValue("streetAddress2"),
    city: getValue("city"),
    state: state,
    zip: getValue("zip"),
    natureOfDisclosingEntity: disclosingEntity,
    hasSameBusinessAddress: convertToBoolean(getValue("hasSameBusinessAddress")),
    businessStreetAddress1: getValue("businessStreetAddress1"),
    businessStreetAddress2: getValue("businessStreetAddress2"),
    businessCity: getValue("businessCity"),
    businessState: getValue("businessState") as AddressState | null,
    businessZip: getValue("businessZip"),
    signature: getValue("signature"),
  };
};

const DownloadStep: React.FC = () => {
  const [zipDownloadUrl, setZipDownloadUrl] = useState<string | null>(null);
  // const [hasSignature, setHasSignature] = useState<boolean>(!!getValue("signature"));

  const handleSignatureChange = async (event: { base64: string | null }) => {
    console.log("Signature event:", event);
    if (event === undefined) {
      return;
    }
    setKeyValue("signature", event.base64 || "");
    // setHasSignature(!!event.base64);

    if (zipDownloadUrl) {
      URL.revokeObjectURL(zipDownloadUrl);
      setZipDownloadUrl(null);
    }

    const filledForms = await fillAllForms(getFormData());
    const zipBlob = await zipForms(filledForms);
    setZipDownloadUrl(URL.createObjectURL(zipBlob));
  };

  // useEffect(() => {
  //   console.log("hasSignature:", hasSignature);
  //   if (hasSignature) {
  //     (async () => {
  //       const filledForms = await fillAllForms(getFormData());
  //       const zipBlob = await zipForms(filledForms);
  //       setZipDownloadUrl(URL.createObjectURL(zipBlob));
  //     })();
  //   }
  // }, [hasSignature]);

  return (
    <div>
      <SignatureMaker withSubmit={false} onChange={handleSignatureChange} />
      {zipDownloadUrl && (
        <a href={zipDownloadUrl} download="filled_forms.zip">
          Download your forms
        </a>
      )}
      <FormProgressButtons />
    </div>
  );
};

export default DownloadStep;
