import { getAddressState, getValue } from "@/app/form/_utils/sessionStorage";

export interface Insurance2Data {
  insuranceCarrierName: string;
  insurancePolicyNumber: string;
  insuranceStreetAddress1: string;
  insuranceStreetAddress2: string;
  insuranceCity: string;
  insuranceState: string;
  insuranceZip: string;
}

export interface InsuranceFormData {
  // 2
  insuranceCarrierName: string;
  insurancePolicyNumber: string;
  insuranceStreetAddress1: string;
  insuranceStreetAddress2: string | null;
  insuranceCity: string;
  insuranceState: string;
  insuranceZip: string;
}

export const getInsuranceFormData = (): InsuranceFormData => {
  return {
    ...getInsurance2FormData(),
  };
};

const getInsurance2FormData = () => {
  return {
    insuranceCarrierName: getValue("insuranceCarrierName", true),
    insurancePolicyNumber: getValue("insurancePolicyNumber", true),
    insuranceStreetAddress1: getValue("insuranceStreetAddress1", true),
    insuranceStreetAddress2: getValue("insuranceStreetAddress2", false),
    insuranceCity: getValue("insuranceCity", true),
    insuranceState: getAddressState("insuranceState", true),
    insuranceZip: getValue("insuranceZip", true),
  };
};
