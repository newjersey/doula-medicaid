import type { DataStore } from "@/app/form/_utils/dataStore";
import { getAddressState, getBoolean, getValue } from "@/app/form/_utils/dataStore";
import type { AddressState } from "@/app/form/_utils/inputFields/addressState";

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
  billingStreetAddress1: string;
  billingStreetAddress2: string | null;
  billingCity: string;
  billingState: AddressState;
  billingZip: string;

  // 3
  npiNumber: string;
  medicareProviderId: string | null;
  upinNumber: string | null;
}

export const getPersonalDetailsFormData = (dataStore: DataStore): PersonalDetailsFormData => {
  return {
    ...getPersonalDetails1FormData(dataStore),
    ...getPersonalDetails2FormData(dataStore),
    ...getPersonalDetails3FormData(dataStore),
  };
};

const getPersonalDetails1FormData = (dataStore: DataStore) => {
  const dateOfBirth = new Date(
    `${getValue(dataStore, "dateOfBirthMonth", true)}/${getValue(dataStore, "dateOfBirthDay", true)}/${getValue(dataStore, "dateOfBirthYear", true)}`,
  );
  return {
    firstName: getValue(dataStore, "firstName", true),
    middleName: getValue(dataStore, "middleName", false),
    lastName: getValue(dataStore, "lastName", true),
    dateOfBirth: dateOfBirth,
    socialSecurityNumber: getValue(dataStore, "socialSecurityNumber", true),
    email: getValue(dataStore, "email", true),
    phoneNumber: getValue(dataStore, "phoneNumber", true),
  };
};

const getPersonalDetails2FormData = (dataStore: DataStore) => {
  const hasSameBillingMailingAddress = getBoolean(dataStore, "hasSameBillingMailingAddress", true);
  return {
    streetAddress1: getValue(dataStore, "streetAddress1", true),
    streetAddress2: getValue(dataStore, "streetAddress2", false),
    city: getValue(dataStore, "city", true),
    state: getAddressState(dataStore, "state", true),
    zip: getValue(dataStore, "zip", true),
    billingStreetAddress1: hasSameBillingMailingAddress
      ? getValue(dataStore, "streetAddress1", true)
      : getValue(dataStore, "billingStreetAddress1", true),
    billingStreetAddress2: hasSameBillingMailingAddress
      ? getValue(dataStore, "streetAddress2", false)
      : getValue(dataStore, "billingStreetAddress2", false),
    billingCity: hasSameBillingMailingAddress
      ? getValue(dataStore, "city", true)
      : getValue(dataStore, "billingCity", true),
    billingState: hasSameBillingMailingAddress
      ? getAddressState(dataStore, "state", true)
      : getAddressState(dataStore, "billingState", true),
    billingZip: hasSameBillingMailingAddress
      ? getValue(dataStore, "zip", true)
      : getValue(dataStore, "billingZip", true),
  };
};

const getPersonalDetails3FormData = (dataStore: DataStore) => {
  return {
    npiNumber: getValue(dataStore, "npiNumber", true),
    medicareProviderId: getValue(dataStore, "medicareProviderId", false),
    upinNumber: getValue(dataStore, "upinNumber", false),
  };
};
