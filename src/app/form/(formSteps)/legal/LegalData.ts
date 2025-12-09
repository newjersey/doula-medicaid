import { getBoolean, getValue, type DataStore } from "@/app/form/_utils/dataStore";

export interface Legal2Data {
  hasCrimeCharge: "true" | "false" | "";
  crimeChargeExplanation: string;
  hadLicenseSuspended: "true" | "false" | "";
  licenseSuspendedExplanation: string;
}

export interface LegalFormData {
  hasCrimeCharge: boolean;
  crimeChargeExplanation: string | null;
  hadLicenseSuspended: boolean;
  licenseSuspendedExplanation: string | null;
}

const getLegal2Data = (dataStore: DataStore) => {
  return {
    hasCrimeCharge: getBoolean(dataStore, "hasCrimeCharge", true),
    crimeChargeExplanation: getValue(dataStore, "crimeChargeExplanation", false),
    hadLicenseSuspended: getBoolean(dataStore, "hadLicenseSuspended", true),
    licenseSuspendedExplanation: getValue(dataStore, "licenseSuspendedExplanation", false),
  };
};

export const getLegalFormData = (dataStore: DataStore): LegalFormData => {
  return {
    ...getLegal2Data(dataStore),
  };
};
