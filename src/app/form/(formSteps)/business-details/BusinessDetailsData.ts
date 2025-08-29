import { type AddressState } from "@/app/form/_utils/inputFields/enums";
import { getAddressState, getBoolean, getValue } from "@/app/form/_utils/sessionStorage";

export interface BusinessDetails1Data {
  hasSameBusinessAddress: "true" | "false" | "";
  businessStreetAddress1: string;
  businessStreetAddress2: string;
  businessCity: string;
  businessState: string;
  businessZip: string;
}

export interface BusinessDetailsFormData {
  hasSameBusinessAddress: boolean;
  businessStreetAddress1: string | null;
  businessStreetAddress2: string | null;
  businessCity: string | null;
  businessState: AddressState | null;
  businessZip: string | null;
}

const getBusinessDetails1Data = () => {
  return {
    hasSameBusinessAddress: getBoolean("hasSameBusinessAddress", true),
    businessStreetAddress1: getValue("businessStreetAddress1", false),
    businessStreetAddress2: getValue("businessStreetAddress2", false),
    businessCity: getValue("businessCity", false),
    businessState: getAddressState("businessState", false),
    businessZip: getValue("businessZip", false),
  };
};

export const getBusinessDetailsData = (): BusinessDetailsFormData => {
  return { ...getBusinessDetails1Data() };
};
