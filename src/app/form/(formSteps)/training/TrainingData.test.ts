import { getTrainingFormData } from "@/app/form/(formSteps)/training/TrainingData";
import { generateDataStoreWithRequiredFields } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { AddressState } from "@/app/form/_utils/inputFields/addressState";

describe("getTrainingFormData", () => {
  describe("isDoulaTrainingInPerson", () => {
    it("saves all training address values when isDoulaTrainingInPerson is true", () => {
      const dataStore = generateDataStoreWithRequiredFields({
        isDoulaTrainingInPerson: "true",
        trainingStreetAddress1: "123 Main St",
        trainingStreetAddress2: "Apt 4B",
        trainingCity: "Trenton",
        trainingState: "NJ",
        trainingZip: "10001",
      });
      expect(getTrainingFormData(dataStore)).toMatchObject({
        isDoulaTrainingInPerson: true,
        trainingStreetAddress1: "123 Main St",
        trainingStreetAddress2: "Apt 4B",
        trainingCity: "Trenton",
        trainingState: AddressState.NJ,
        trainingZip: "10001",
      });
    });

    it("overwrites all training address values with empty string/null when isDoulaTrainingInPerson is false", () => {
      const dataStore = generateDataStoreWithRequiredFields({
        isDoulaTrainingInPerson: "false",
        trainingStreetAddress1: "123 Main St",
        trainingStreetAddress2: "Apt 4B",
        trainingCity: "Trenton",
        trainingState: "NJ",
        trainingZip: "10001",
      });
      expect(getTrainingFormData(dataStore)).toMatchObject({
        isDoulaTrainingInPerson: false,
        trainingStreetAddress1: null,
        trainingStreetAddress2: null,
        trainingCity: null,
        trainingState: null,
        trainingZip: null,
      });
    });
  });

  describe("nameOfTrainingOrganization", () => {
    it("gets nameOfTrainingOrganization when stateApprovedTraining is 'None of these'", () => {
      const dataStore = generateDataStoreWithRequiredFields({
        stateApprovedTraining: "None of these",
        nameOfTrainingOrganization: "Custom training organization",
      });
      expect(getTrainingFormData(dataStore)).toMatchObject({
        stateApprovedTraining: "None of these",
        nameOfTrainingOrganization: "Custom training organization",
      });
    });
    it("overwrites nameOfTrainingOrganization with null when stateApprovedTraining is not 'None of these'", () => {
      const dataStore = generateDataStoreWithRequiredFields({
        stateApprovedTraining: "Approved state training",
        nameOfTrainingOrganization: "Custom training organization",
      });
      expect(getTrainingFormData(dataStore)).toMatchObject({
        stateApprovedTraining: "Approved state training",
        nameOfTrainingOrganization: null,
      });
    });
  });
});
