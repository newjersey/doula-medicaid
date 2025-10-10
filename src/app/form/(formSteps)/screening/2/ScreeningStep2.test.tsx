import ScreeningStep2 from "@/app/form/(formSteps)/screening/2/ScreeningStep2";
import {
  testFields,
  yesEverHadEmployees,
  yesEverHadOtherBusinessOwner,
} from "@/app/form/(formSteps)/screening/2/testFields";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  testInvalidField,
  testSaveFieldsToDataStore,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";

describe("<ScreeningStep2 />", () => {
  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<ScreeningStep2 />, "/form/screening/2", dataStore);

  it("saves fields to the data store on submit", async () => {
    await testSaveFieldsToDataStore(testFields, testFields, renderFunction, screen);
  });

  it.each([[yesEverHadEmployees], [yesEverHadOtherBusinessOwner]])(
    "displays an error message if $invalidField.dataStoreKey is $invalidField.name",
    async (invalidField) => {
      await testInvalidField(
        invalidField,
        "Currently this site cannot support your situation. Please use the standard FFS application",
        testFields,
        renderFunction,
        screen,
        invalidField,
      );
    },
  );
});
