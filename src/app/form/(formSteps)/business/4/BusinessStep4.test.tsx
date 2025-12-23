import BusinessStep4 from "@/app/form/(formSteps)/business/4/BusinessStep4";
import {
  firstRadioOptionTestFields,
  futureBankruptcyDateFields,
  noHasFiledBankruptcy,
  noMightFileBankruptcy,
  pastBankruptcyDateFields,
  path1TestFields,
  path2TestFields,
} from "@/app/form/(formSteps)/business/4/testFields";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  testConditionalRender,
  testFillFromDataStore,
  testRequiredField,
  testSaveFieldsToDataStore,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";

describe("<BusinessStep4 />", () => {
  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<BusinessStep4 />, "/form/business/4", dataStore);

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
      [...pastBankruptcyDateFields, ...futureBankruptcyDateFields].filter(
        (field) => field.required === true,
      ),
    )(
      "when $prerequisiteField.dataStoreKey is $prerequisiteField.testValue and $dataStoreKey is not filled in",
      async (field) => {
        await testRequiredField(field, path2TestFields, renderFunction, screen);
      },
    );
  });

  it.each([...path1TestFields, ...pastBankruptcyDateFields, ...futureBankruptcyDateFields])(
    "fills $dataStoreKey from the data store when page is loaded",
    async (field) => {
      await testFillFromDataStore(field, renderFunction, screen);
    },
  );

  it.each(pastBankruptcyDateFields)(
    "conditionally renders $dataStoreKey based on hasFiledBankruptcy",
    async (field) => {
      await testConditionalRender(field, noHasFiledBankruptcy, renderFunction, screen);
    },
  );

  it.each(futureBankruptcyDateFields)(
    "conditionally renders $dataStoreKey based on mightFileBankruptcy",
    async (field) => {
      await testConditionalRender(field, noMightFileBankruptcy, renderFunction, screen);
    },
  );
});
