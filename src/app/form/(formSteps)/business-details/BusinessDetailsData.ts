import {
  getAddressState,
  getBoolean,
  getBusinessAddressSameAsOtherAddress,
  getValue,
  type DataStore,
} from "@/app/form/_utils/dataStore";
import { type AddressState } from "@/app/form/_utils/inputFields/addressState";

export type BusinessAddressSameAsOtherAddressOptions = "mailing" | "billing" | "different" | "";

export interface BusinessDetails1Data {
  businessAddressSameAsOtherAddress: BusinessAddressSameAsOtherAddressOptions;
  businessStreetAddress1: string;
  businessStreetAddress2: string;
  businessCity: string;
  businessState: string;
  businessZip: string;
}

export interface BusinessDetails2Data {
  hasUncollectedDebt: "true" | "false" | "";
  isSubjectToPaymentSuspension: "true" | "false" | "";
}

export interface BusinessDetails3Data {
  hasBeenExcludedFromMedicaid: "true" | "false" | "";
  hasBeenSuspendedFromMedicaid: "true" | "false" | "";
}

export interface BusinessDetails4Data {
  hasFiledForBankruptcyPast7Years: "true" | "false" | "";
  past7YearsBankruptcyMonth: string;
  past7YearsBankruptcyDay: string;
  past7YearsBankruptcyYear: string;

  mightFileForBankruptcyNextYear: "true" | "false" | "";
  nextYearBankruptcyMonth: string;
  nextYearBankruptcyDay: string;
  nextYearBankruptcyYear: string;
}

export interface BusinessDetailsFormData {
  businessStreetAddress1: string;
  businessStreetAddress2: string | null;
  businessCity: string;
  businessState: AddressState;
  businessZip: string;
  hasDisclosableEvent: boolean;
  hasFiledForBankruptcyPast7Years: boolean;
  past7YearsBankruptcyDate: Date | null;
  mightFileForBankruptcyNextYear: boolean;
  nextYearBankruptcyDate: Date | null;
}

const getBusinessDetails1Data = (dataStore: DataStore) => {
  const businessAddressSameAsOtherAddress = getBusinessAddressSameAsOtherAddress(dataStore, true);
  switch (businessAddressSameAsOtherAddress) {
    case "mailing":
      return {
        businessStreetAddress1: getValue(dataStore, "streetAddress1", true),
        businessStreetAddress2: getValue(dataStore, "streetAddress2", false),
        businessCity: getValue(dataStore, "city", true),
        businessState: getAddressState(dataStore, "state", true),
        businessZip: getValue(dataStore, "zip", true),
      };
    case "billing":
      return {
        businessStreetAddress1: getValue(dataStore, "billingStreetAddress1", true),
        businessStreetAddress2: getValue(dataStore, "billingStreetAddress2", false),
        businessCity: getValue(dataStore, "billingCity", true),
        businessState: getAddressState(dataStore, "billingState", true),
        businessZip: getValue(dataStore, "billingZip", true),
      };
    case "different":
      return {
        businessStreetAddress1: getValue(dataStore, "businessStreetAddress1", true),
        businessStreetAddress2: getValue(dataStore, "businessStreetAddress2", false),
        businessCity: getValue(dataStore, "businessCity", true),
        businessState: getAddressState(dataStore, "businessState", true),
        businessZip: getValue(dataStore, "businessZip", true),
      };
    default:
      throw new Error(
        `Unexpected logic path, businessAddressSameAsOtherAddress: ${businessAddressSameAsOtherAddress}`,
      );
  }
};
const getBusinessDetails2And3Data = (dataStore: DataStore) => {
  const hasUncollectedDebt = getBoolean(dataStore, "hasUncollectedDebt", true);
  const isSubjectToPaymentSuspension = getBoolean(dataStore, "isSubjectToPaymentSuspension", true);
  const hasBeenExcludedFromMedicaid = getBoolean(dataStore, "hasBeenExcludedFromMedicaid", true);
  const hasBeenSuspendedFromMedicaid = getBoolean(dataStore, "hasBeenSuspendedFromMedicaid", true);

  let hasDisclosableEvent = false;
  if (
    hasUncollectedDebt === true ||
    isSubjectToPaymentSuspension === true ||
    hasBeenExcludedFromMedicaid === true ||
    hasBeenSuspendedFromMedicaid === true
  ) {
    hasDisclosableEvent = true;
  }
  return { hasDisclosableEvent };
};

const getBusinessDetails4Data = (dataStore: DataStore) => {
  const hasFiledForBankruptcyPast7Years = getBoolean(
    dataStore,
    "hasFiledForBankruptcyPast7Years",
    true,
  );
  const past7YearsBankruptcyDate = hasFiledForBankruptcyPast7Years
    ? new Date(
        `${getValue(dataStore, "past7YearsBankruptcyMonth", true)}/${getValue(dataStore, "past7YearsBankruptcyDay", true)}/${getValue(dataStore, "past7YearsBankruptcyYear", true)}`,
      )
    : null;

  const mightFileForBankruptcyNextYear = getBoolean(
    dataStore,
    "mightFileForBankruptcyNextYear",
    true,
  );

  const nextYearBankruptcyDate = mightFileForBankruptcyNextYear
    ? new Date(
        `${getValue(dataStore, "nextYearBankruptcyMonth", true)}/${getValue(dataStore, "nextYearBankruptcyDay", true)}/${getValue(dataStore, "nextYearBankruptcyYear", true)}`,
      )
    : null;

  return {
    hasFiledForBankruptcyPast7Years,
    past7YearsBankruptcyDate,
    mightFileForBankruptcyNextYear,
    nextYearBankruptcyDate,
  };
};

export const getBusinessDetailsFormData = (dataStore: DataStore): BusinessDetailsFormData => {
  return {
    ...getBusinessDetails1Data(dataStore),
    ...getBusinessDetails2And3Data(dataStore),
    ...getBusinessDetails4Data(dataStore),
  };
};
