import { formatCityStateZipAddressSingleField } from "@/app/form/_utils/formatters";
import type { AddressState } from "@/app/form/_utils/inputFields/addressState";
import { type FormData } from "@form/_utils/fillPdf/form";

export const formatNaIfBlank = (value: string | null) => {
  return value === null || value.trim() === "" ? "N/A" : value;
};

export const formatNumericStringAsIndividualFields = (
  numericString: string,
  fieldKeys: Array<string>,
): { [key in string]: string } => {
  const isNumeric = /^\d+$/.test(numericString);
  if (!isNumeric) {
    throw new Error(`${numericString} contains non-numeric characters`);
  }
  if (numericString.length !== fieldKeys.length) {
    throw new Error(`${numericString} is a different length than ${fieldKeys}`);
  }

  const individualFields = new Map<string, string>();
  Array.from(fieldKeys).forEach((key: string, index: number) => [
    individualFields.set(key, numericString[index]),
  ]);
  return Object.fromEntries(individualFields);
};

export const formatName = (formData: FormData): string => {
  if (formData.middleName) {
    return `${formData.firstName} ${formData.middleName} ${formData.lastName}`;
  }
  return `${formData.firstName} ${formData.lastName}`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const formatStreetAddressSingleField = (
  streetAddress1: string,
  streetAddress2: string | null,
): string => {
  return `${streetAddress1}${streetAddress2 ? ` ${streetAddress2}` : ""}`;
};

export const formatFullAddressSingleField = (
  streetAddress1: string,
  streetAddress2: string | null,
  city: string,
  state: AddressState,
  zip: string,
): string => {
  return `${streetAddress1}${streetAddress2 ? `\n${streetAddress2}` : ""}\n${formatCityStateZipAddressSingleField(
    city,
    state,
    zip,
  )}`;
};

export const formatFullAddressThreeFields = (
  streetAddress1: string,
  streetAddress2: string | null,
  city: string,
  state: AddressState,
  zip: string,
): { line1: string; line2: string; line3: string } => {
  const addressLine3 = formatCityStateZipAddressSingleField(city, state, zip);
  const hasStreetAddress2 = streetAddress2 && streetAddress2 !== "";
  return {
    line1: streetAddress1,
    line2: hasStreetAddress2 === true ? streetAddress2 : addressLine3,
    line3: hasStreetAddress2 === true ? addressLine3 : "",
  };
};
