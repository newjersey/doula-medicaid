import {
  getAddressState,
  getBoolean,
  getBusinessAddressSameAsOtherAddress,
  getValue,
  type DataStore,
} from "@/app/form/_utils/dataStore";
import { type AddressState } from "@/app/form/_utils/inputFields/enums";

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
  hasEin: "true" | "false" | "";
  ein: string;
}

export interface BusinessDetails3Data {
  hasUncollectedDebt: "true" | "false" | "";
  isSubjectToPaymentSuspension: "true" | "false" | "";
}

export interface BusinessDetails4Data {
  hasBeenExcludedFromMedicaid: "true" | "false" | "";
  hasBeenSuspendedFromMedicaid: "true" | "false" | "";
}

export interface BusinessDetailsFormData {
  businessStreetAddress1: string;
  businessStreetAddress2: string | null;
  businessCity: string;
  businessState: AddressState;
  businessZip: string;
  hasEin: boolean;
  ein: string | null;

  hasDisclosableEvent: boolean;
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

const getBusinessDetails2Data = (dataStore: DataStore) => {
  return {
    hasEin: getBoolean(dataStore, "hasEin", true),
    ein: getValue(dataStore, "ein", false),
  };
};

export const getBusinessDetailsFormData = (dataStore: DataStore): BusinessDetailsFormData => {
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
  return {
    ...getBusinessDetails1Data(dataStore),
    ...getBusinessDetails2Data(dataStore),
    hasDisclosableEvent: hasDisclosableEvent,
  };
};
