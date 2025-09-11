import { getTrainingFormData } from "@/app/form/(formSteps)/training/TrainingData";
import {
  setInSessionStorage,
  setRequiredFieldsInSessionStorage,
} from "@/app/form/_utils/fillPdf/testUtils/formData";
import { AddressState } from "@/app/form/_utils/inputFields/enums";

describe("getTrainingFormData", () => {
  describe("isDoulaTrainingInPerson", () => {
    it("saves all training address values when isDoulaTrainingInPerson is true", () => {
      setRequiredFieldsInSessionStorage();
      setInSessionStorage({
        stateApprovedTraining: "Doula training org",
        isDoulaTrainingInPerson: "true",
        trainingStreetAddress1: "123 Main St",
        trainingStreetAddress2: "Apt 4B",
        trainingCity: "Trenton",
        trainingState: "NJ",
        trainingZip: "10001",
        instructorFirstName: "John",
        instructorLastName: "Doe",
        instructorEmail: "john@test.com",
        instructorPhoneNumber: "111-111-1111",
      });
      expect(getTrainingFormData()).toMatchObject({
        stateApprovedTraining: "Doula training org",
        isDoulaTrainingInPerson: true,
        trainingStreetAddress1: "123 Main St",
        trainingStreetAddress2: "Apt 4B",
        trainingCity: "Trenton",
        trainingState: AddressState.NJ,
        trainingZip: "10001",
        instructorFirstName: "John",
        instructorLastName: "Doe",
        instructorEmail: "john@test.com",
        instructorPhoneNumber: "111-111-1111",
      });
    });

    it("overwrites all training address values with empty string/null when isDoulaTrainingInPerson is false", () => {
      setRequiredFieldsInSessionStorage();
      setInSessionStorage({
        stateApprovedTraining: "Doula training org",
        isDoulaTrainingInPerson: "false",
        trainingStreetAddress1: "123 Main St",
        trainingStreetAddress2: "Apt 4B",
        trainingCity: "Trenton",
        trainingState: "NJ",
        trainingZip: "10001",
        instructorFirstName: "John",
        instructorLastName: "Doe",
        instructorEmail: "john@test.com",
        instructorPhoneNumber: "111-111-1111",
      });
      expect(getTrainingFormData()).toMatchObject({
        stateApprovedTraining: "Doula training org",
        isDoulaTrainingInPerson: false,
        trainingStreetAddress1: null,
        trainingStreetAddress2: null,
        trainingCity: null,
        trainingState: null,
        trainingZip: null,
        instructorFirstName: "John",
        instructorLastName: "Doe",
        instructorEmail: "john@test.com",
        instructorPhoneNumber: "111-111-1111",
      });
    });
  });
});
