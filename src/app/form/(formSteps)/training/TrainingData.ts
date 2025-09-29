import { getAddressState, getBoolean, getValue } from "@/app/form/_utils/dataStore";
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

export const getTrainingFormData = (): TrainingFormData => {
  const isDoulaTrainingInPerson = getBoolean("isDoulaTrainingInPerson", true);
  return {
    stateApprovedTraining: getValue("stateApprovedTraining", true),
    nameOfTrainingOrganization: getValue("nameOfTrainingOrganization", false),
    isDoulaTrainingInPerson: isDoulaTrainingInPerson,
    trainingStreetAddress1: isDoulaTrainingInPerson
      ? getValue("trainingStreetAddress1", false)
      : null,
    trainingStreetAddress2: isDoulaTrainingInPerson
      ? getValue("trainingStreetAddress2", false)
      : null,
    trainingCity: isDoulaTrainingInPerson ? getValue("trainingCity", false) : null,
    trainingState: isDoulaTrainingInPerson ? getAddressState("trainingState", false) : null,
    trainingZip: isDoulaTrainingInPerson ? getValue("trainingZip", false) : null,
    instructorFirstName: getValue("instructorFirstName", true),
    instructorLastName: getValue("instructorLastName", true),
    instructorEmail: getValue("instructorEmail", true),
    instructorPhoneNumber: getValue("instructorPhoneNumber", false),
  };
};
