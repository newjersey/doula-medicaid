import type { AddressState } from "@/app/form/_utils/inputFields/enums";
import { getAddressState, getBoolean, getValue } from "@/app/form/_utils/sessionStorage";

export interface TrainingData {
  isDoulaTrainingInPerson: string | null;
  trainingStreetAddress1: string | null;
  trainingStreetAddress2: string | null;
  trainingCity: string | null;
  trainingState: string | null;
  trainingZip: string | null;
}

export interface TrainingFormData {
  isDoulaTrainingInPerson: boolean | null;
  trainingStreetAddress1: string | null;
  trainingStreetAddress2: string | null;
  trainingCity: string | null;
  trainingState: AddressState | null;
  trainingZip: string | null;
}

export const getTrainingFormData = () => {
  const isDoulaTrainingInPerson = getBoolean("isDoulaTrainingInPerson", true);
  return {
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
  };
};
