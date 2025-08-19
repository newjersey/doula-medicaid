import { getTrainingFormData } from "@/app/form/(formSteps)/training/TrainingData";
import {
  setInSessionStorage,
  setRequiredFieldsInSessionStorage,
} from "@/app/form/_utils/fillPdf/testUtils/formData";
import { AddressState } from "@/app/form/_utils/inputFields/enums";

describe("getTrainingFormData", () => {
  describe("isDoulaTrainingInPerson", () => {
    describe("when isDoulaTrainingInPerson is true", () => {
      it("saves all training address values", () => {
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
    });
    describe("when isDoulaTrainingInPerson is false", () => {
      it("overwrites all training address values with empty string/null", () => {
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
          trainingStreetAddress1: "",
          trainingStreetAddress2: "",
          trainingCity: "",
          trainingState: null,
          trainingZip: "",
          instructorFirstName: "John",
          instructorLastName: "Doe",
          instructorEmail: "john@test.com",
          instructorPhoneNumber: "111-111-1111",
        });
      });
    });
  });
});
