import type { FormData } from "@/app/form/_utils/fillPdf/form";
import { DisclosingEntity } from "@/app/form/_utils/inputFields/enums";
import { getAddressState, getBoolean, getValue } from "@/app/form/_utils/sessionStorage";

export const getFormData = (): FormData => {
  const dateOfBirth = new Date(
    `${getValue("dateOfBirthMonth", true)}/${getValue("dateOfBirthDay", true)}/${getValue("dateOfBirthYear", true)}`,
  );

  const disclosingEntity = getBoolean("isSoleProprietorship", true)
    ? DisclosingEntity.SoleProprietorship
    : null;
  const hasSameBillingMailingAddress = getBoolean("hasSameBillingMailingAddress", true);
  const doulaTrainingInPerson = getBoolean("doulaTrainingInPerson", true);

  return {
    doulaTrainingInPerson: doulaTrainingInPerson,
    trainingStreetAddress1: doulaTrainingInPerson ? getValue("trainingStreetAddress1", false) : "",
    trainingStreetAddress2: doulaTrainingInPerson ? getValue("trainingStreetAddress2", false) : "",
    trainingCity: doulaTrainingInPerson ? getValue("trainingCity", false) : "",
    trainingState: doulaTrainingInPerson ? getAddressState("trainingState", false) : null,
    trainingZip: doulaTrainingInPerson ? getValue("trainingZip", false) : "",
    firstName: getValue("firstName", true),
    middleName: getValue("middleName", false),
    lastName: getValue("lastName", true),
    dateOfBirth: dateOfBirth,
    phoneNumber: getValue("phoneNumber", true),
    email: getValue("email", true),
    npiNumber: getValue("npiNumber", true),
    socialSecurityNumber: getValue("socialSecurityNumber", true),
    streetAddress1: getValue("streetAddress1", true),
    streetAddress2: getValue("streetAddress2", false),
    city: getValue("city", true),
    state: getAddressState("state", true),
    zip: getValue("zip", true),
    hasSameBillingMailingAddress: hasSameBillingMailingAddress,
    billingStreetAddress1: hasSameBillingMailingAddress
      ? getValue("streetAddress1", true)
      : getValue("billingStreetAddress1", false),
    billingStreetAddress2: hasSameBillingMailingAddress
      ? getValue("streetAddress2", false)
      : getValue("billingStreetAddress2", false),
    billingCity: hasSameBillingMailingAddress
      ? getValue("city", true)
      : getValue("billingCity", false),
    billingState: hasSameBillingMailingAddress
      ? getAddressState("state", true)
      : getAddressState("billingState", false),
    billingZip: hasSameBillingMailingAddress
      ? getValue("zip", true)
      : getValue("billingZip", false),
    natureOfDisclosingEntity: disclosingEntity,
    hasSameBusinessAddress: getBoolean("hasSameBusinessAddress", true),
    businessStreetAddress1: getValue("businessStreetAddress1", false),
    businessStreetAddress2: getValue("businessStreetAddress2", false),
    businessCity: getValue("businessCity", false),
    businessState: getAddressState("businessState", false),
    businessZip: getValue("businessZip", false),
  };
};
