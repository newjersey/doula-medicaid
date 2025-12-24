import LegalStep1 from "@/app/form/(formSteps)/legal/1/LegalStep1";
import {
  employedByNjExplanation,
  firstRadioOptionTestFields,
  medicaidProviderExplanation,
  noHasProvidedMedicaidServices,
  noIsEmployedByNj,
  path1TestFields,
  path2TestFields,
  yesIsEmployedByNj,
} from "@/app/form/(formSteps)/legal/1/testFields";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  testConditionalRender,
  testFillFromDataStore,
  testFocusesFirstErrorEvenIfConditional,
  testRequiredField,
  testSaveFieldsToDataStore,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";
describe("<LegalStep1 />", () => {
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
      [medicaidProviderExplanation, employedByNjExplanation].filter(
        (field) => field.required === true,
      ),
    )(
      "when $prerequisiteField.dataStoreKey is $prerequisiteField.testValue and $dataStoreKey is not filled in",
      async (field) => {
        await testRequiredField(field, path2TestFields, renderFunction, screen);
      },
    );
  });

  it.each([...path1TestFields, employedByNjExplanation, medicaidProviderExplanation])(
    "fills $dataStoreKey from the data store when page is loaded",
    async (field) => {
      await testFillFromDataStore(field, renderFunction, screen);
    },
  );

  it("conditionally renders an explanation based on isEmployedByNj", async () => {
    await testConditionalRender(employedByNjExplanation, noIsEmployedByNj, renderFunction, screen);
  });

  it("conditionally renders an explanation based on medicalDetails", async () => {
    await testConditionalRender(
      medicaidProviderExplanation,
      noHasProvidedMedicaidServices,
      renderFunction,
      screen,
    );
  });

  it("focuses on the first error, even if the first error is conditionally rendered", async () => {
    await testFocusesFirstErrorEvenIfConditional(
      employedByNjExplanation,
      noHasProvidedMedicaidServices,
      [yesIsEmployedByNj, employedByNjExplanation, noHasProvidedMedicaidServices],
      renderFunction,
      screen,
    );
  });
});
