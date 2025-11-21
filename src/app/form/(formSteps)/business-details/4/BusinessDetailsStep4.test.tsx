import BusinessDetailsStep4 from "@/app/form/(formSteps)/business-details/4/BusinessDetailsStep4";
import {
  firstRadioOptionTestFields,
  nextYearBankruptcyDateFields,
  noHasFiledForBankruptcyPast7Years,
  noMightFileForBankruptcyNextYear,
  past7YearsBankruptcyDateFields,
  path1TestFields,
  path2TestFields,
} from "@/app/form/(formSteps)/business-details/4/testFields";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  testConditionalRender,
  testFillFromDataStore,
  testRequiredField,
  testSaveFieldsToDataStore,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";

describe("<BusinessDetailsStep4 />", () => {
  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<BusinessDetailsStep4 />, "/form/business-details/4", dataStore);

  it("saves fields to the data store on submit", async () => {
    await testSaveFieldsToDataStore(path1TestFields, path1TestFields, renderFunction, screen);
  });

  describe("marks fields as required and displays an error message", () => {
    it.each(firstRadioOptionTestFields.filter((field) => field.required === true))(
      "when $dataStoreKey is not filed in",
      async (field) => {
        await testRequiredField(field, path1TestFields, renderFunction, screen);
      },
    );

    it.each(
      [...past7YearsBankruptcyDateFields, ...nextYearBankruptcyDateFields].filter(
        (field) => field.required === true,
      ),
    )(
      "when $prerequisiteField.dataStoreKey is $prerequisiteField.testValue and $dataStoreKey is not filled in",
      async (field) => {
        await testRequiredField(field, path2TestFields, renderFunction, screen);
      },
    );
  });

  it.each([...path1TestFields, ...past7YearsBankruptcyDateFields, ...nextYearBankruptcyDateFields])(
    "fills $dataStoreKey from the data store when page is loaded",
    async (field) => {
      await testFillFromDataStore(field, renderFunction, screen);
    },
  );

  it.each(past7YearsBankruptcyDateFields)(
    "conditionally renders $dataStoreKey based on hasFiledForBankruptcyPast7Years",
    async (field) => {
      await testConditionalRender(field, noHasFiledForBankruptcyPast7Years, renderFunction, screen);
    },
  );

  it.each(nextYearBankruptcyDateFields)(
    "conditionally renders $dataStoreKey based on mightFileForBankruptcyNextYear",
    async (field) => {
      await testConditionalRender(field, noMightFileForBankruptcyNextYear, renderFunction, screen);
    },
  );
});
