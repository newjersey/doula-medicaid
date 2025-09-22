import { getAddressState, getValue } from "@/app/form/_utils/sessionStorage";

export interface Insurance1Data {
  insuranceStartDateMonth: string;
  insuranceStartDateDay: string;
  insuranceStartDateYear: string;
  insuranceEndDateMonth: string;
  insuranceEndDateDay: string;
  insuranceEndDateYear: string;
  insuranceOccurenceAmount: string;
  insuranceAggregateAmount: string;
}

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
  // 1
  insuranceStartDate: Date;
  insuranceEndDate: Date;
  insuranceOccurenceAmount: string;
  insuranceAggregateAmount: string;

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
    ...getInsurance1FormData(),
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

const getInsurance1FormData = () => {
  const insuranceStartDate = new Date(
    `${getValue("insuranceStartDateMonth", true)}/${getValue("insuranceStartDateDay", true)}/${getValue("insuranceStartDateYear", true)}`,
  );
  const insuranceEndDate = new Date(
    `${getValue("insuranceEndDateMonth", true)}/${getValue("insuranceEndDateDay", true)}/${getValue("insuranceEndDateYear", true)}`,
  );
  return {
    insuranceStartDate: insuranceStartDate,
    insuranceEndDate: insuranceEndDate,
    insuranceOccurenceAmount: getValue("insuranceOccurenceAmount", true),
    insuranceAggregateAmount: getValue("insuranceAggregateAmount", true),
  };
};
