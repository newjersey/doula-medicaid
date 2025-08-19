import type { AddressState } from "@/app/form/_utils/inputFields/enums";
import { getAddressState, getBoolean, getValue } from "@/app/form/_utils/sessionStorage";

export interface TrainingData {
  stateApprovedTraining: string | null;
  nameOfTrainingOrganization: string | null;
  isDoulaTrainingInPerson: string | null;
  trainingStreetAddress1: string | null;
  trainingStreetAddress2: string | null;
  trainingCity: string | null;
  trainingState: string | null;
  trainingZip: string | null;
  instructorFirstName: string | null;
  instructorLastName: string | null;
  instructorEmail: string | null;
  instructorPhoneNumber: string | null;
}

export interface TrainingFormData {
  stateApprovedTraining: string | null;
  nameOfTrainingOrganization: string | null;
  isDoulaTrainingInPerson: boolean | null;
  trainingStreetAddress1: string | null;
  trainingStreetAddress2: string | null;
  trainingCity: string | null;
  trainingState: AddressState | null;
  trainingZip: string | null;
  instructorFirstName: string | null;
  instructorLastName: string | null;
  instructorEmail: string | null;
  instructorPhoneNumber: string | null;
}

export const getTrainingFormData = () => {
  const isDoulaTrainingInPerson = getBoolean("isDoulaTrainingInPerson", true);
  return {
    stateApprovedTraining: getValue("stateApprovedTraining", true),
    nameOfTrainingOrganization: getValue("nameOfTrainingOrganization", false),
    isDoulaTrainingInPerson: isDoulaTrainingInPerson,
    trainingStreetAddress1: isDoulaTrainingInPerson
      ? getValue("trainingStreetAddress1", false)
      : "",
    trainingStreetAddress2: isDoulaTrainingInPerson
      ? getValue("trainingStreetAddress2", false)
      : "",
    trainingCity: isDoulaTrainingInPerson ? getValue("trainingCity", false) : "",
    trainingState: isDoulaTrainingInPerson ? getAddressState("trainingState", false) : null,
    trainingZip: isDoulaTrainingInPerson ? getValue("trainingZip", false) : "",
    instructorFirstName: getValue("instructorFirstName", true),
    instructorLastName: getValue("instructorLastName", true),
    instructorEmail: getValue("instructorEmail", true),
    instructorPhoneNumber: getValue("instructorPhoneNumber", true),
  };
};
