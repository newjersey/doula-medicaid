import ScreeningStep1 from "@/app/form/(formSteps)/screening/1/ScreeningStep1";
import {
  noIsSoleProprietor,
  testFields,
  yesIsSoleProprietor,
} from "@/app/form/(formSteps)/screening/1/testFields";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  testInvalidField,
  testSaveFieldsToDataStore,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";

describe("<ScreeningStep1 />", () => {
  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<ScreeningStep1 />, "/form/screening/1", dataStore);

  it("saves fields to the data store on submit", async () => {
    await testSaveFieldsToDataStore(testFields, testFields, renderFunction, screen);
  });

  it("displays an error message if isSoleProprietor is no", async () => {
    await testInvalidField(
      noIsSoleProprietor,
      "Currently this site is only for Sole Proprietors. Please use the standard FFS application",
      testFields,
      renderFunction,
      screen,
      yesIsSoleProprietor,
    );
  });
});
