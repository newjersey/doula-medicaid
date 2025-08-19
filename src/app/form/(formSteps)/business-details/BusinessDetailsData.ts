import { DisclosingEntity, type AddressState } from "@/app/form/_utils/inputFields/enums";
import { getAddressState, getBoolean, getValue } from "@/app/form/_utils/sessionStorage";

export interface BusinessDetails1Data {
  isSoleProprietorship: "true" | "false" | "";
  hasSameBusinessAddress: "true" | "false" | "";
  businessStreetAddress1: string | null;
  businessStreetAddress2: string | null;
  businessCity: string | null;
  businessState: string | null;
  businessZip: string | null;
}

export interface BusinessDetailsFormData {
  natureOfDisclosingEntity: DisclosingEntity | null;
  hasSameBusinessAddress: boolean;
  businessStreetAddress1: string | null;
  businessStreetAddress2: string | null;
  businessCity: string | null;
  businessState: AddressState | null;
  businessZip: string | null;
}

const getBusinessDetails1Data = () => {
  const disclosingEntity = getBoolean("isSoleProprietorship", true)
    ? DisclosingEntity.SoleProprietorship
    : null;
  return {
    natureOfDisclosingEntity: disclosingEntity,
    hasSameBusinessAddress: getBoolean("hasSameBusinessAddress", true),
    businessStreetAddress1: getValue("businessStreetAddress1", false),
    businessStreetAddress2: getValue("businessStreetAddress2", false),
    businessCity: getValue("businessCity", false),
    businessState: getAddressState("businessState", false),
    businessZip: getValue("businessZip", false),
  };
};

export const getBusinessDetailsData = () => {
  return { ...getBusinessDetails1Data() };
};
