import { type AddressState } from "@/app/form/_utils/inputFields/enums";
import {
  getAddressState,
  getBoolean,
  getBusinessAddressSameAsOtherAddress,
  getValue,
} from "@/app/form/_utils/sessionStorage";

export type BusinessAddressSameAsOtherAddressOptions = "mailing" | "billing" | "different" | "";

export interface BusinessDetails1Data {
  businessAddressSameAsOtherAddress: BusinessAddressSameAsOtherAddressOptions;
  businessStreetAddress1: string;
  businessStreetAddress2: string;
  businessCity: string;
  businessState: string;
  businessZip: string;
}

export interface BusinessDetails3Data {
  hasUncollectedDebt: "true" | "false" | "";
  isSubjectToPaymentSuspension: "true" | "false" | "";
}

export interface BusinessDetailsFormData {
  businessStreetAddress1: string;
  businessStreetAddress2: string | null;
  businessCity: string;
  businessState: AddressState;
  businessZip: string;

  hasUncollectedDebt: boolean;
  isSubjectToPaymentSuspension: boolean;
}

const getBusinessDetails1Data = () => {
  const businessAddressSameAsOtherAddress = getBusinessAddressSameAsOtherAddress(true);
  switch (businessAddressSameAsOtherAddress) {
    case "mailing":
      return {
        businessStreetAddress1: getValue("streetAddress1", true),
        businessStreetAddress2: getValue("streetAddress2", false),
        businessCity: getValue("city", true),
        businessState: getAddressState("state", true),
        businessZip: getValue("zip", true),
      };
    case "billing":
      return {
        businessStreetAddress1: getValue("billingStreetAddress1", true),
        businessStreetAddress2: getValue("billingStreetAddress2", false),
        businessCity: getValue("billingCity", true),
        businessState: getAddressState("billingState", true),
        businessZip: getValue("billingZip", true),
      };
    case "different":
      return {
        businessStreetAddress1: getValue("businessStreetAddress1", true),
        businessStreetAddress2: getValue("businessStreetAddress2", false),
        businessCity: getValue("businessCity", true),
        businessState: getAddressState("businessState", true),
        businessZip: getValue("businessZip", true),
      };
    default:
      throw new Error(
        `Unexpected logic path, businessAddressSameAsOtherAddress: ${businessAddressSameAsOtherAddress}`,
      );
  }
};

const getBusinessDetails3Data = () => {
  return {
    hasUncollectedDebt: getBoolean("hasUncollectedDebt", true),
    isSubjectToPaymentSuspension: getBoolean("isSubjectToPaymentSuspension", true),
  };
};

export const getBusinessDetailsFormData = (): BusinessDetailsFormData => {
  return { ...getBusinessDetails1Data(), ...getBusinessDetails3Data() };
};
