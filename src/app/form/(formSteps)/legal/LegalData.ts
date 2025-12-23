import { getBoolean, getValue, type DataStore } from "@/app/form/_utils/dataStore";

export interface Legal1Data {
  isEmployedByNj: "true" | "false" | "";
  hasProvidedMedicaidServices: "true" | "false" | "";
  employedByNjExplanation: string;
  medicaidServicesExplanation: string;
}

export interface Legal2Data {
  hasCrimeCharge: "true" | "false" | "";
  crimeChargeExplanation: string;
  hadLicenseSuspended: "true" | "false" | "";
  licenseSuspendedExplanation: string;
}
export interface Legal3Data {
  hasDisqualification: "true" | "false" | "";
  disqualificationExplanation: string;
  hasCompanyInvolvement: "true" | "false" | "";
  companyInvolvementExplanation: string;
}

export interface LegalFormData {
  // Legal 1
  isEmployedByNj: boolean;
  hasProvidedMedicaidServices: boolean;
  employedByNjExplanation: string | null;
  medicaidServicesExplanation: string | null;
  // Legal 2
  hasCrimeCharge: boolean;
  crimeChargeExplanation: string | null;
  hadLicenseSuspended: boolean;
  licenseSuspendedExplanation: string | null;
  // Legal 3
  hasDisqualification: boolean;
  disqualificationExplanation: string | null;
  hasCompanyInvolvement: boolean;
  companyInvolvementExplanation: string | null;
}

const getLegal1Data = (dataStore: DataStore) => {
  return {
    isEmployedByNj: getBoolean(dataStore, "isEmployedByNj", true),
    employedByNjExplanation: getValue(dataStore, "employedByNjExplanation", false),
    hasProvidedMedicaidServices: getBoolean(dataStore, "hasProvidedMedicaidServices", true),
    medicaidServicesExplanation: getValue(dataStore, "medicaidServicesExplanation", false),
  };
};

const getLegal2Data = (dataStore: DataStore) => {
  return {
    hasCrimeCharge: getBoolean(dataStore, "hasCrimeCharge", true),
    crimeChargeExplanation: getValue(dataStore, "crimeChargeExplanation", false),
    hadLicenseSuspended: getBoolean(dataStore, "hadLicenseSuspended", true),
    licenseSuspendedExplanation: getValue(dataStore, "licenseSuspendedExplanation", false),
  };
};

const getLegal3Data = (dataStore: DataStore) => {
  return {
    hasDisqualification: getBoolean(dataStore, "hasDisqualification", true),
    disqualificationExplanation: getValue(dataStore, "disqualificationExplanation", false),
    hasCompanyInvolvement: getBoolean(dataStore, "hasCompanyInvolvement", true),
    companyInvolvementExplanation: getValue(dataStore, "companyInvolvementExplanation", false),
  };
};

export const getLegalFormData = (dataStore: DataStore): LegalFormData => {
  return {
    ...getLegal1Data(dataStore),
    ...getLegal2Data(dataStore),
    ...getLegal3Data(dataStore),
  };
};
