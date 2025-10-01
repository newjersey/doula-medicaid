import { getAddressState, getBoolean, getValue, type DataStore } from "@/app/form/_utils/dataStore";
import type { AddressState } from "@/app/form/_utils/inputFields/enums";

export interface TrainingData {
  stateApprovedTraining: string;
  nameOfTrainingOrganization: string;
  isDoulaTrainingInPerson: string;
  trainingStreetAddress1: string;
  trainingStreetAddress2: string;
  trainingCity: string;
  trainingState: string;
  trainingZip: string;
  instructorFirstName: string;
  instructorLastName: string;
  instructorEmail: string;
  instructorPhoneNumber: string;
}

export interface TrainingFormData {
  stateApprovedTraining: string;
  nameOfTrainingOrganization: string | null;
  isDoulaTrainingInPerson: boolean;
  trainingStreetAddress1: string | null;
  trainingStreetAddress2: string | null;
  trainingCity: string | null;
  trainingState: AddressState | null;
  trainingZip: string | null;
  instructorFirstName: string;
  instructorLastName: string;
  instructorEmail: string;
  instructorPhoneNumber: string | null;
}

export const getTrainingFormData = (dataStore: DataStore): TrainingFormData => {
  const isDoulaTrainingInPerson = getBoolean(dataStore, "isDoulaTrainingInPerson", true);
  return {
    stateApprovedTraining: getValue(dataStore, "stateApprovedTraining", true),
    nameOfTrainingOrganization: getValue(dataStore, "nameOfTrainingOrganization", false),
    isDoulaTrainingInPerson: isDoulaTrainingInPerson,
    trainingStreetAddress1: isDoulaTrainingInPerson
      ? getValue(dataStore, "trainingStreetAddress1", false)
      : null,
    trainingStreetAddress2: isDoulaTrainingInPerson
      ? getValue(dataStore, "trainingStreetAddress2", false)
      : null,
    trainingCity: isDoulaTrainingInPerson ? getValue(dataStore, "trainingCity", false) : null,
    trainingState: isDoulaTrainingInPerson
      ? getAddressState(dataStore, "trainingState", false)
      : null,
    trainingZip: isDoulaTrainingInPerson ? getValue(dataStore, "trainingZip", false) : null,
    instructorFirstName: getValue(dataStore, "instructorFirstName", true),
    instructorLastName: getValue(dataStore, "instructorLastName", true),
    instructorEmail: getValue(dataStore, "instructorEmail", true),
    instructorPhoneNumber: getValue(dataStore, "instructorPhoneNumber", false),
  };
};
