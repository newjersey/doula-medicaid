import type { FormData } from "@/app/form/_utils/fillPdf/form";
import { AddressState, DisclosingEntity } from "@/app/form/_utils/inputFields/enums";
import { getValue } from "@/app/form/_utils/sessionStorage";

const convertToBoolean = (value: string | null): boolean | null => {
  if (value === null) return null;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Invalid boolean value: ${value}`);
};

export const getFormData = (): FormData => {
  let dateOfBirth: Date;
  if (
    getValue("dateOfBirthMonth") === null ||
    getValue("dateOfBirthDay") === null ||
    getValue("dateOfBirthYear") === null
  ) {
    throw new Error("PDF generation failed: Incomplete date of birth provided");
  } else {
    dateOfBirth = new Date(
      `${getValue("dateOfBirthMonth")}/${getValue("dateOfBirthDay")}/${getValue("dateOfBirthYear")}`,
    );
  }

  const stateString = (getValue("state") as keyof typeof AddressState) || null;
  const state = stateString ? AddressState[stateString] : null;
  const disclosingEntity =
    convertToBoolean(getValue("isSoleProprietorship")) === true
      ? DisclosingEntity.SoleProprietorship
      : null;
  if (convertToBoolean(getValue("hasSameBillingMailingAddress")) == null) {
    throw new Error("PDF generation failed: hasSameBillingMailingAddress is not set");
  }
  const hasSameBillingMailingAddress = convertToBoolean(getValue("hasSameBillingMailingAddress"))!;
  const isDoulaTrainingInPerson = convertToBoolean(getValue("isDoulaTrainingInPerson"))!;

  return {
    isDoulaTrainingInPerson: isDoulaTrainingInPerson,
    trainingStreetAddress1: isDoulaTrainingInPerson ? getValue("trainingStreetAddress1") : "",
    trainingStreetAddress2: isDoulaTrainingInPerson ? getValue("trainingStreetAddress2") : "",
    trainingCity: isDoulaTrainingInPerson ? getValue("trainingCity") : "",
    trainingState: isDoulaTrainingInPerson
      ? (getValue("trainingState") as AddressState | null)
      : null,
    trainingZip: isDoulaTrainingInPerson ? getValue("trainingZip") : "",
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
    hasSameBillingMailingAddress: hasSameBillingMailingAddress,
    billingStreetAddress1: hasSameBillingMailingAddress
      ? getValue("streetAddress1")
      : getValue("billingStreetAddress1"),
    billingStreetAddress2: hasSameBillingMailingAddress
      ? getValue("streetAddress2")
      : getValue("billingStreetAddress2"),
    billingCity: hasSameBillingMailingAddress ? getValue("city") : getValue("billingCity"),
    billingState: hasSameBillingMailingAddress
      ? state
      : (getValue("billingState") as AddressState | null),
    billingZip: hasSameBillingMailingAddress ? getValue("zip") : getValue("billingZip"),
    natureOfDisclosingEntity: disclosingEntity,
    hasSameBusinessAddress: convertToBoolean(getValue("hasSameBusinessAddress")),
    businessStreetAddress1: getValue("businessStreetAddress1"),
    businessStreetAddress2: getValue("businessStreetAddress2"),
    businessCity: getValue("businessCity"),
    businessState: getValue("businessState") as AddressState | null,
    businessZip: getValue("businessZip"),
  };
};
