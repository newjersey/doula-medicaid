import ScreeningStep3 from "@/app/form/(formSteps)/screening/3/ScreeningStep3";
import {
  testFields,
  yesHadDhmasBusiness,
  yesHaveOtherBusinessOwnerNextYear,
} from "@/app/form/(formSteps)/screening/3/testFields";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  testInvalidField,
  testSaveFieldsToDataStore,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";

describe("<ScreeningStep3 />", () => {
  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<ScreeningStep3 />, "/form/screening/3", dataStore);

  it("saves fields to the data store on submit", async () => {
    await testSaveFieldsToDataStore(testFields, testFields, renderFunction, screen);
  });

  it.each([[yesHaveOtherBusinessOwnerNextYear], [yesHadDhmasBusiness]])(
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
