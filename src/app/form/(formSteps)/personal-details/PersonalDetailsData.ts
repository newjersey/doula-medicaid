import type { AddressState } from "@/app/form/_utils/inputFields/enums";
import { getAddressState, getBoolean, getValue } from "@/app/form/_utils/sessionStorage";

export interface PersonalDetails1Data {
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  dateOfBirthMonth: string | null;
  dateOfBirthDay: string | null;
  dateOfBirthYear: string | null;
  socialSecurityNumber: string | null;
  email: string | null;
  phoneNumber: string | null;
}

export interface PersonalDetails2Data {
  streetAddress1: string | null;
  streetAddress2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  hasSameBillingMailingAddress: string | null;
  billingStreetAddress1: string | null;
  billingStreetAddress2: string | null;
  billingCity: string | null;
  billingState: string | null;
  billingZip: string | null;
}

export interface PersonalDetails3Data {
  npiNumber: string | null;
  medicareProviderId: string | null;
  upinNumber: string | null;
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
  };
};
