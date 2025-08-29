import type { AddressState } from "@/app/form/_utils/inputFields/enums";
import { getAddressState, getBoolean, getValue } from "@/app/form/_utils/sessionStorage";

export interface PersonalDetails1Data {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirthMonth: string;
  dateOfBirthDay: string;
  dateOfBirthYear: string;
  socialSecurityNumber: string;
  email: string;
  phoneNumber: string;
}

export interface PersonalDetails2Data {
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  state: string;
  zip: string;
  hasSameBillingMailingAddress: string;
  billingStreetAddress1: string;
  billingStreetAddress2: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
}

export interface PersonalDetails3Data {
  npiNumber: string;
  medicareProviderId: string;
  upinNumber: string;
}

export interface PersonalDetailsFormData {
  // 1
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  email: string;
  socialSecurityNumber: string;
  streetAddress1: string;
  streetAddress2: string | null;
  city: string;
  state: AddressState;
  zip: string;

  // 2
  hasSameBillingMailingAddress: boolean;
  billingStreetAddress1: string | null;
  billingStreetAddress2: string | null;
  billingCity: string | null;
  billingState: AddressState | null;
  billingZip: string | null;

  // 3
  npiNumber: string;
  medicareProviderId: string | null;
  upinNumber: string | null;
}

export const getPersonalDetailsFormData = (): PersonalDetailsFormData => {
  return {
    ...getPersonalDetails1FormData(),
    ...getPersonalDetails2FormData(),
    ...getPersonalDetails3FormData(),
  };
};

const getPersonalDetails1FormData = () => {
  const dateOfBirth = new Date(
    `${getValue("dateOfBirthMonth", true)}/${getValue("dateOfBirthDay", true)}/${getValue("dateOfBirthYear", true)}`,
  );
  return {
    firstName: getValue("firstName", true),
    middleName: getValue("middleName", false),
    lastName: getValue("lastName", true),
    dateOfBirth: dateOfBirth,
    socialSecurityNumber: getValue("socialSecurityNumber", true),
    email: getValue("email", true),
    phoneNumber: getValue("phoneNumber", true),
  };
};

const getPersonalDetails2FormData = () => {
  const hasSameBillingMailingAddress = getBoolean("hasSameBillingMailingAddress", true);
  return {
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
  };
};

const getPersonalDetails3FormData = () => {
  return {
    npiNumber: getValue("npiNumber", true),
    medicareProviderId: getValue("medicareProviderId", false),
    upinNumber: getValue("upinNumber", false),
  };
};
