import LegalStep1 from "@/app/form/(formSteps)/legal/1/LegalStep1";
import {
  employedByNjExplanation,
  firstRadioOptionTestFields,
  medicaidServicesExplanation,
  noHasProvidedMedicaidServices,
  noIsEmployedByNj,
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

  describe("saves fields to the data store on submit", () => {
    it("when 'No' is selected for both questions", async () => {
      await testSaveFieldsToDataStore(path1TestFields, path1TestFields, renderFunction, screen);
    });

    it("when 'Yes' is selected for both questions and explanations are provided", async () => {
      await testSaveFieldsToDataStore(path2TestFields, path2TestFields, renderFunction, screen);
    });
  });

  describe("marks fields as required and displays an error message", () => {
    it.each(firstRadioOptionTestFields.filter((field) => field.required === true))(
      "when $dataStoreKey is not filled in",
      async (field) => {
        await testRequiredField(field, path1TestFields, renderFunction, screen);
      },
    );
    it.each(
      [medicaidServicesExplanation, employedByNjExplanation].filter(
        (field) => field.required === true,
      ),
    )(
      "when $prerequisiteField.dataStoreKey is $prerequisiteField.testValue and $dataStoreKey is not filled in",
      async (field) => {
        await testRequiredField(field, path2TestFields, renderFunction, screen);
      },
    );
  });

  it("conditionally renders an explanation based on isEmployedByNj", async () => {
    await testConditionalRender(employedByNjExplanation, noIsEmployedByNj, renderFunction, screen);
  });

  it("conditionally renders an explanation based on medicalDetails", async () => {
    await testConditionalRender(
      medicaidServicesExplanation,
      noHasProvidedMedicaidServices,
      renderFunction,
      screen,
    );
  });
});
