import {
  childrensFuturesTrainingOrganization,
  maximalTestFields,
  minimalTestFields,
  nameOfTrainingOrganization,
  noDoulaTrainingInPerson,
  noneTrainingOrganization,
  trainingAddressFields,
  trainingInstructorFields,
  yesDoulaTrainingInPerson,
} from "@/app/form/(formSteps)/training/1/testFields";
import TrainingStep1 from "@/app/form/(formSteps)/training/1/TrainingStep1";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  testConditionalRender,
  testFillFromDataStore,
  testRequiredField,
  testSaveFieldsToDataStore,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";
import { fillField } from "@form/_utils/testUtils/fillInputs";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const renderFunction = (dataStore: DataStore = {}) =>
  renderWithProviders(<TrainingStep1 />, "/form/training/1", dataStore);

describe("<TrainingStep1 />", () => {
  describe("doula training organization fields", () => {
    describe("saves fields to the data store on submit", () => {
      it("when a state-approved training organization is selected", async () => {
        await testSaveFieldsToDataStore(
          [childrensFuturesTrainingOrganization],
          minimalTestFields,
          renderFunction,
          screen,
        );
      });

      it("when 'None of these' is selected and the training organization name is provided", async () => {
        await testSaveFieldsToDataStore(
          [noneTrainingOrganization, nameOfTrainingOrganization],
          maximalTestFields,
          renderFunction,
          screen,
        );
      });
    });

    describe("marks fields as required and displays an error message", () => {
      it("when a stateApprovedTraining is not filled in", async () => {
        await testRequiredField(
          childrensFuturesTrainingOrganization,
          minimalTestFields,
          renderFunction,
          screen,
        );
      });
      it("when None of the these is selected and nameOfTrainingOrganization is not filled in", async () => {
        await testRequiredField(
          nameOfTrainingOrganization,
          maximalTestFields,
          renderFunction,
          screen,
        );
      });
    });

    it.each([
      childrensFuturesTrainingOrganization,
      noneTrainingOrganization,
      nameOfTrainingOrganization,
    ])("fills $dataStoreKey from the data store when page is loaded", async (field: TestField) => {
      await testFillFromDataStore(field, renderFunction, screen);
    });

    it("conditionally renders custom training organization based on stateApprovedTraining", async () => {
      await testConditionalRender(
        nameOfTrainingOrganization,
        childrensFuturesTrainingOrganization,
        renderFunction,
        screen,
      );
    });

    it("shows alert text if None of these is selected", async () => {
      const user = userEvent.setup();
      renderFunction();
      await fillField(screen, user, noneTrainingOrganization);
      const input = screen.getByRole("textbox", {
        name: "What is the name of your training organization? *",
      });
      expect(input).toHaveAccessibleDescription(
        "If your training organization isn't listed, you may not be eligible to apply right now. Contact the Doula Guides at mahs.doulaguide@dhs.nj.gov to learn more.",
      );
    });
  });

  describe("doula training address fields", () => {
    describe("saves fields to the data store on submit", () => {
      it("when training was virtual", async () => {
        await testSaveFieldsToDataStore(
          [noDoulaTrainingInPerson],
          minimalTestFields,
          renderFunction,
          screen,
        );
      });

      it("when training was in person or hybrid", async () => {
        await testSaveFieldsToDataStore(
          [yesDoulaTrainingInPerson, ...trainingAddressFields],
          maximalTestFields,
          renderFunction,
          screen,
        );
      });
    });

    describe("marks fields as required and displays an error message", () => {
      it("when a isDoulaTrainingInPerson is not filled in", async () => {
        await testRequiredField(
          yesDoulaTrainingInPerson,
          minimalTestFields,
          renderFunction,
          screen,
        );
      });
      it.each(trainingAddressFields.filter((field) => field.required))(
        "when training was in person or hybrid and $dataStoreKey is not filled in",
        async (field: TestField) => {
          await testRequiredField(field, maximalTestFields, renderFunction, screen);
        },
      );
    });

    it.each(trainingAddressFields.filter((field) => field.required))(
      "marks $dataStoreKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, maximalTestFields, renderFunction, screen);
      },
    );

    it.each([noDoulaTrainingInPerson, yesDoulaTrainingInPerson, ...trainingAddressFields])(
      "fills $dataStoreKey from the data store when page is loaded",
      async (field: TestField) => {
        await testFillFromDataStore(field, renderFunction, screen);
      },
    );

    it.each(trainingAddressFields.filter((field) => field.required))(
      "conditionally renders $dataStoreKey based on isDoulaTrainingInPerson",
      async (field: TestField) => {
        await testConditionalRender(field, noDoulaTrainingInPerson, renderFunction, screen);
      },
    );
  });

  describe("doula training instructor fields", () => {
    it("saves fields to the data store on submit", async () => {
      await testSaveFieldsToDataStore(
        trainingInstructorFields,
        minimalTestFields,
        renderFunction,
        screen,
      );
    });

    it.each(trainingInstructorFields.filter((field) => field.required))(
      "marks $dataStoreKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, minimalTestFields, renderFunction, screen);
      },
    );

    it.each(trainingInstructorFields)(
      "fills $dataStoreKey from the data store when page is loaded",
      async (field: TestField) => {
        await testFillFromDataStore(field, renderFunction, screen);
      },
    );
  });
});
