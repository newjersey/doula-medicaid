// import { getBoolean, type DataStore } from "@/app/form/_utils/dataStore";

export interface Legal1Data {
  // bool for Q1
  employedByState: string;
  // text area for q1
  usersRoleWithState: string;
  // bool for Q2
  approvedForMedicaidProgram: string;
  // text area for q2
  usersServicesProvided: string;
}

export interface Legal1FromData {
  // bool for Q1
  employedByState: boolean;
  // text area for q1
  usersRoleWithState: string;
  // bool for Q2
  approvedForMedicaidProgram: boolean;
  // text area for q2
  usersServicesProvided: string;
}

// export interface Legal2Data {}
// export interface Legal2FromData {}
// export interface Legal3Data {}
// export interface Legal3FromData {}

// const getLegal1Data = (dataStore: DataStore) => {
//   const employedByState = getBoolean(dataStore, "employedByState", true);
//   const approvedForMedicaidProgram = getBoolean(dataStore, "approvedForMedicaidProgram", true);
// };

// export const getLegalFormData = (dataStore: DataStore): BusinessFormData => {
//     return {
//         ...getLegal1Data(dataStore)
//     };
// };
