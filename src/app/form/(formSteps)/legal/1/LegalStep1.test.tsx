import LegalStep1 from "@/app/form/(formSteps)/legal/1/LegalStep1";
import {
  approvedForMedicaidDetails,
  employedByStateDetails,
  firstRadioOptionTestFields,
  noApprovedForMedicaidProgram,
  noEmployedByState,
  path1TestFields,
  path2TestFields,
} from "@/app/form/(formSteps)/legal/1/testFields";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  testConditionalRender,
  testRequiredField,
  testSaveFieldsToDataStore,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";
describe("<LegalStep1 />", () => {
  const oldProcessEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...oldProcessEnv, NEXT_PUBLIC_FLAG_LEGAL: "1" };
  });

  afterAll(() => {
    process.env = oldProcessEnv;
  });

  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<LegalStep1 />, "/form/legal/1", dataStore);

  it("saves fields to the data store on submit", async () => {
    await testSaveFieldsToDataStore(path1TestFields, path1TestFields, renderFunction, screen);
  });

  describe("marks fields as required and displays an error message", () => {
    it.each(firstRadioOptionTestFields.filter((field) => field.required === true))(
      "when $dataStoreKey is not filled in",
      async (field) => {
        await testRequiredField(field, path1TestFields, renderFunction, screen);
      },
    );
    it.each(
      [approvedForMedicaidDetails, employedByStateDetails].filter(
        (field) => field.required === true,
      ),
    )(
      "when $prerequisiteField.dataStoreKey is $prerequisiteField.testValue and $dataStoreKey is not filled in",
      async (field) => {
        await testRequiredField(field, path2TestFields, renderFunction, screen);
      },
    );
  });

  it("conditionally renders an explanation based on employedByState", async () => {
    await testConditionalRender(employedByStateDetails, noEmployedByState, renderFunction, screen);
  });

  it("conditionally renders an explanation based on medicalDetails", async () => {
    await testConditionalRender(
      approvedForMedicaidDetails,
      noApprovedForMedicaidProgram,
      renderFunction,
      screen,
    );
  });
});
