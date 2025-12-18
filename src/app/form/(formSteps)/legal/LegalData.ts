import { getBoolean, getValue, type DataStore } from "@/app/form/_utils/dataStore";

export interface Legal1Data {
  employedByState: "true" | "false" | "";
  approvedForMedicaidProgram: "true" | "false" | "";
  employedByStateDetails: string;
  approvedForMedicaidDetails: string;
}

export interface Legal2Data {
  hasCrimeCharge: "true" | "false" | "";
  crimeChargeExplanation: string;
  hadLicenseSuspended: "true" | "false" | "";
  licenseSuspendedExplanation: string;
}

export interface LegalFormData {
  // legal 1 
  employedByState: boolean;
  approvedForMedicaidProgram: boolean;
  employedByStateDetails: string | null;
  approvedForMedicaidDetails: string | null;
  // legal 2 
  hasCrimeCharge: boolean;
  crimeChargeExplanation: string | null;
  hadLicenseSuspended: boolean;
  licenseSuspendedExplanation: string | null;
}

const getLegal1Data = (dataStore: DataStore) => {
  return {
    employedByState: getBoolean(dataStore, "employedByState", true),
    employedByStateDetails: getValue(dataStore, "employedByStateDetails", false),
    approvedForMedicaidProgram: getBoolean(dataStore, "approvedForMedicaidProgram", true),
    approvedForMedicaidDetails: getValue(dataStore, "approvedForMedicaidDetails", false),
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

export const getLegalFormData = (dataStore: DataStore): LegalFormData => {
  return {
    ...getLegal1Data(dataStore),
    ...getLegal2Data(dataStore),
  };
};
