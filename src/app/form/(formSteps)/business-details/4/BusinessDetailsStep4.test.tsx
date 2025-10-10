import BusinessDetailsStep4 from "@/app/form/(formSteps)/business-details/4/BusinessDetailsStep4";
import {
  maximalTestFields,
  minimalTestFields,
} from "@/app/form/(formSteps)/business-details/4/testFields";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  testFillFromDataStore,
  testRequiredField,
  testSaveFieldsToDataStore,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";

describe("<BusinessDetailsStep4 />", () => {
  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<BusinessDetailsStep4 />, "/form/business-details/4", dataStore);

  it("saves fields to the data store on submit", async () => {
    await testSaveFieldsToDataStore(minimalTestFields, minimalTestFields, renderFunction, screen);
  });

  it.each(minimalTestFields.filter((field) => field.required === true))(
    "marks $dataStoreKey as required and displays an error message if it is not filed in",
    async (field) => {
      await testRequiredField(field, minimalTestFields, renderFunction, screen);
    },
  );

  it.each(maximalTestFields)(
    "fills $dataStoreKey from the data store when page is loaded",
    async (field) => {
      await testFillFromDataStore(field, renderFunction, screen);
    },
  );
});
