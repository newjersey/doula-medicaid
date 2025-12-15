// // import { getBoolean, type DataStore } from "@/app/form/_utils/dataStore";

// export interface Legal1Data {
//   // bool for Q1
//   employedByState: string;
//   // text area for q1
//   employedByStateDetails: string;
//   // bool for Q2
//   approvedForMedicaidProgram: string;
//   // text area for q2
//   usersServicesProvided: string;
// }

// export interface Legal1FromData {
//   // bool for Q1
//   employedByState: boolean;
//   // text area for q1
//   employedByStateDetails: string;
//   // bool for Q2
//   approvedForMedicaidProgram: boolean;
//   // text area for q2
//   usersServicesProvided: string;
// }

// // export interface Legal2Data {}
// // export interface Legal2FromData {}
// // export interface Legal3Data {}
// // export interface Legal3FromData {}

// // const getLegal1Data = (dataStore: DataStore) => {
// //   const employedByState = getBoolean(dataStore, "employedByState", true);
// //   const approvedForMedicaidProgram = getBoolean(dataStore, "approvedForMedicaidProgram", true);
// // };

// // export const getLegalFormData = (dataStore: DataStore): BusinessFormData => {
// //     return {
// //         ...getLegal1Data(dataStore)
// //     };
// // };
import { getBoolean, getValue, type DataStore } from "@/app/form/_utils/dataStore";

export interface Legal1Data {
  employedByState: "true" | "false" | "";
  approvedForMedicaidProgram: "true" | "false" | "";
  employedByStateDetails: string;
  approvedForMedicaidDetails: string;
}

export interface LegalFormData {
  employedByState: boolean;
  approvedForMedicaidProgram: boolean;
  employedByStateDetails: string | null;
  approvedForMedicaidDetails: string | null;
}

const getLegal1Data = (dataStore: DataStore) => {
  return {
    employedByState: getBoolean(dataStore, "employedByState", true),
    approvedForMedicaidProgram: getBoolean(dataStore, "approvedForMedicaidProgram", true),
    employedByStateDetails: getValue(dataStore, "employedByStateDetails", false),
    approvedForMedicaidDetails: getValue(dataStore, "approvedForMedicaidDetails", false),
  };
};

export const getLegalFormData = (dataStore: DataStore): LegalFormData => {
  return {
    ...getLegal1Data(dataStore),
  };
};
