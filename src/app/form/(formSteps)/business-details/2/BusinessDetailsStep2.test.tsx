import BusinessDetailsStep3 from "@/app/form/(formSteps)/business-details/2/BusinessDetailsStep2";
import {
  firstRadioOptionTestFields,
  testFields,
} from "@/app/form/(formSteps)/business-details/2/testFields";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  testFillFromDataStore,
  testRequiredField,
  testSaveFieldsToDataStore,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";

describe("<BusinessDetailsStep3 />", () => {
  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<BusinessDetailsStep3 />, "/form/business-details/3", dataStore);

  it("saves fields to the data store on submit", async () => {
    await testSaveFieldsToDataStore(testFields, testFields, renderFunction, screen);
  });

  it.each(firstRadioOptionTestFields.filter((field) => field.required === true))(
    "marks $dataStoreKey as required and displays an error message if it is not filed in",
    async (field) => {
      await testRequiredField(field, testFields, renderFunction, screen);
    },
  );

  it.each(testFields)(
    "fills $dataStoreKey from the data store when page is loaded",
    async (field) => {
      await testFillFromDataStore(field, renderFunction, screen);
    },
  );
});
