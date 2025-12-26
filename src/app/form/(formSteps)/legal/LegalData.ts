import { getBoolean, getValue, type DataStore } from "@/app/form/_utils/dataStore";

export interface Legal1Data {
  isEmployedByNj: "true" | "false" | "";
  hasProvidedMedicaidServices: "true" | "false" | "";
  employedByNjExplanation: string;
  medicaidProviderExplanation: string;
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
  medicaidProviderExplanation: string | null;
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
  const isEmployedByNj = getBoolean(dataStore, "isEmployedByNj", true);
  const hasProvidedMedicaidServices = getBoolean(dataStore, "hasProvidedMedicaidServices", true);
  return {
    isEmployedByNj,
    employedByNjExplanation: isEmployedByNj
      ? getValue(dataStore, "employedByNjExplanation", true)
      : null,
    hasProvidedMedicaidServices,
    medicaidProviderExplanation: hasProvidedMedicaidServices
      ? getValue(dataStore, "medicaidProviderExplanation", true)
      : null,
  };
};

const getLegal2Data = (dataStore: DataStore) => {
  const hasCrimeCharge = getBoolean(dataStore, "hasCrimeCharge", true);
  const hadLicenseSuspended = getBoolean(dataStore, "hadLicenseSuspended", true);
  return {
    hasCrimeCharge,
    crimeChargeExplanation: hasCrimeCharge
      ? getValue(dataStore, "crimeChargeExplanation", true)
      : null,
    hadLicenseSuspended,
    licenseSuspendedExplanation: hadLicenseSuspended
      ? getValue(dataStore, "licenseSuspendedExplanation", true)
      : null,
  };
};

const getLegal3Data = (dataStore: DataStore) => {
  const hasDisqualification = getBoolean(dataStore, "hasDisqualification", true);
  const hasCompanyInvolvement = getBoolean(dataStore, "hasCompanyInvolvement", true);
  return {
    hasDisqualification,
    disqualificationExplanation: hasDisqualification
      ? getValue(dataStore, "disqualificationExplanation", true)
      : null,
    hasCompanyInvolvement,
    companyInvolvementExplanation: hasCompanyInvolvement
      ? getValue(dataStore, "companyInvolvementExplanation", true)
      : null,
  };
};

export const getLegalFormData = (dataStore: DataStore): LegalFormData => {
  return {
    ...getLegal1Data(dataStore),
    ...getLegal2Data(dataStore),
    ...getLegal3Data(dataStore),
  };
};
