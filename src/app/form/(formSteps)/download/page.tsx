"use client";

import FormProgressButtons from "@form/(formSteps)/components/FormProgressButtons";
import type { FormData } from "@form/_utils/fillPdf/form";
import { fillAllForms } from "@form/_utils/fillPdf/form";
import { zipForms } from "@form/_utils/fillPdf/zip";
import { AddressState, DisclosingEntity } from "@form/_utils/inputFields/enums";
import { getValue } from "@form/_utils/sessionStorage";
import { useEffect, useState } from "react";

const convertToBoolean = (value: string | null): boolean | null => {
  if (value === null) return null;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Invalid boolean value: ${value}`);
};

const getFormData = (): FormData => {
  const dateOfBirth =
    getValue("dateOfBirthMonth") === null ||
    getValue("dateOfBirthDay") === null ||
    getValue("dateOfBirthYear") === null
      ? null
      : new Date(
          `${getValue("dateOfBirthMonth")}/${getValue("dateOfBirthDay")}/${getValue("dateOfBirthYear")}`,
        );

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
  };
};

const DownloadStep = () => {
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

export default DownloadStep;
