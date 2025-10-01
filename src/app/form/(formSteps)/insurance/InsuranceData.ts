import { getAddressState, getValue, type DataStore } from "@/app/form/_utils/dataStore";

export interface Insurance1Data {
  insuranceStartDateDay: string;
  insuranceStartDateMonth: string;
  insuranceStartDateYear: string;
  insuranceEndDateDay: string;
  insuranceEndDateMonth: string;
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

export const getInsuranceFormData = (dataStore: DataStore): InsuranceFormData => {
  return {
    ...getInsurance1FormData(dataStore),
    ...getInsurance2FormData(dataStore),
  };
};

const getInsurance2FormData = (dataStore: DataStore) => {
  return {
    insuranceCarrierName: getValue(dataStore, "insuranceCarrierName", true),
    insurancePolicyNumber: getValue(dataStore, "insurancePolicyNumber", true),
    insuranceStreetAddress1: getValue(dataStore, "insuranceStreetAddress1", true),
    insuranceStreetAddress2: getValue(dataStore, "insuranceStreetAddress2", false),
    insuranceCity: getValue(dataStore, "insuranceCity", true),
    insuranceState: getAddressState(dataStore, "insuranceState", true),
    insuranceZip: getValue(dataStore, "insuranceZip", true),
  };
};

const getInsurance1FormData = (dataStore: DataStore) => {
  const insuranceStartDate = new Date(
    `${getValue(dataStore, "insuranceStartDateMonth", true)}/${getValue(dataStore, "insuranceStartDateDay", true)}/${getValue(dataStore, "insuranceStartDateYear", true)}`,
  );
  const insuranceEndDate = new Date(
    `${getValue(dataStore, "insuranceEndDateMonth", true)}/${getValue(dataStore, "insuranceEndDateDay", true)}/${getValue(dataStore, "insuranceEndDateYear", true)}`,
  );
  return {
    insuranceStartDate: insuranceStartDate,
    insuranceEndDate: insuranceEndDate,
    insuranceOccurenceAmount: getValue(dataStore, "insuranceOccurenceAmount", true),
    insuranceAggregateAmount: getValue(dataStore, "insuranceAggregateAmount", true),
  };
};
