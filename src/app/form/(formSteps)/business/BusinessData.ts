import {
  getAddressState,
  getBoolean,
  getBusinessAddressSameAsOtherAddress,
  getValue,
  type DataStore,
} from "@/app/form/_utils/dataStore";
import { type AddressState } from "@/app/form/_utils/inputFields/addressState";

export type BusinessAddressSameAsOtherAddressOptions = "mailing" | "billing" | "different" | "";

export interface Business1Data {
  businessAddressSameAsOtherAddress: BusinessAddressSameAsOtherAddressOptions;
  businessStreetAddress1: string;
  businessStreetAddress2: string;
  businessCity: string;
  businessState: string;
  businessZip: string;
}

export interface Business2Data {
  hasUncollectedDebt: "true" | "false" | "";
  isSubjectToPaymentSuspension: "true" | "false" | "";
}

export interface Business3Data {
  hasBeenExcludedFromMedicaid: "true" | "false" | "";
  hasBeenSuspendedFromMedicaid: "true" | "false" | "";
}

export interface Business4Data {
  hasFiledBankruptcy: "true" | "false" | "";
  pastBankruptcyMonth: string;
  pastBankruptcyDay: string;
  pastBankruptcyYear: string;

  mightFileBankruptcy: "true" | "false" | "";
  futureBankruptcyMonth: string;
  futureBankruptcyDay: string;
  futureBankruptcyYear: string;
}

export interface BusinessFormData {
  businessStreetAddress1: string;
  businessStreetAddress2: string | null;
  businessCity: string;
  businessState: AddressState;
  businessZip: string;
  hasDisclosableEvent: boolean;
  hasFiledBankruptcy: boolean;
  pastBankruptcyDate: Date | null;
  mightFileBankruptcy: boolean;
  futureBankruptcyDate: Date | null;
}

const getBusiness1Data = (dataStore: DataStore) => {
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
const getBusiness2And3Data = (dataStore: DataStore) => {
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

const getBusiness4Data = (dataStore: DataStore) => {
  const hasFiledBankruptcy = getBoolean(dataStore, "hasFiledBankruptcy", true);
  const pastBankruptcyDate = hasFiledBankruptcy
    ? new Date(
        `${getValue(dataStore, "pastBankruptcyMonth", true)}/${getValue(dataStore, "pastBankruptcyDay", true)}/${getValue(dataStore, "pastBankruptcyYear", true)}`,
      )
    : null;

  const mightFileBankruptcy = getBoolean(dataStore, "mightFileBankruptcy", true);

  const futureBankruptcyDate = mightFileBankruptcy
    ? new Date(
        `${getValue(dataStore, "futureBankruptcyMonth", true)}/${getValue(dataStore, "futureBankruptcyDay", true)}/${getValue(dataStore, "futureBankruptcyYear", true)}`,
      )
    : null;

  return {
    hasFiledBankruptcy,
    pastBankruptcyDate,
    mightFileBankruptcy,
    futureBankruptcyDate,
  };
};

export const getBusinessFormData = (dataStore: DataStore): BusinessFormData => {
  return {
    ...getBusiness1Data(dataStore),
    ...getBusiness2And3Data(dataStore),
    ...getBusiness4Data(dataStore),
  };
};
