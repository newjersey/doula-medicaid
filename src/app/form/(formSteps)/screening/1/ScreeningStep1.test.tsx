import ScreeningStep1 from "@/app/form/(formSteps)/screening/1/ScreeningStep1";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  createTestField,
  testInvalidField,
  testSaveFieldsToDataStore,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";

const yesIsSoleProprietor: TestField = createTestField({
  name: "Yes",
  dataStoreKey: "isSoleProprietor",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "radio",
  testValue: "true",
  withinGroupName:
    "Do you manage your business as an individual doula operating as a Sole Proprietor? Most NJ FamilyCare doulas operate as Sole Proprietor. Select one *",
});

const noIsSoleProprietor: TestField = createTestField({
  name: "No",
  dataStoreKey: "isSoleProprietor",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "radio",
  testValue: "false",
  withinGroupName:
    "Do you manage your business as an individual doula operating as a Sole Proprietor? Most NJ FamilyCare doulas operate as Sole Proprietor. Select one *",
});

const allTestFields: Array<TestField> = [yesIsSoleProprietor];

describe("<ScreeningStep1 />", () => {
  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<ScreeningStep1 />, "/form/screening/1", dataStore);

  it("saves fields to the data store on submit", async () => {
    await testSaveFieldsToDataStore(allTestFields, allTestFields, renderFunction, screen);
  });

  it("displays an error message if isSoleProprietor is no", async () => {
    await testInvalidField(
      noIsSoleProprietor,
      "Currently this site is only for Sole Proprietors. Please use the standard FFS application",
      allTestFields,
      renderFunction,
      screen,
      yesIsSoleProprietor,
    );
  });
});
