import LegalStep2 from "@/app/form/(formSteps)/legal/2/LegalStep2";
import {
  crimeChargeExplanationField,
  firstRadioOptionTestFields,
  licenseSuspendedExplanationField,
  noHadLicenseSuspended,
  noHasCrimeCharge,
  path1TestFields,
  path2TestFields,
} from "@/app/form/(formSteps)/legal/2/testFields";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  testConditionalRender,
  testFillFromDataStore,
  testRequiredField,
  testSaveFieldsToDataStore,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";

describe("<LegalStep2 />", () => {
  const oldProcessEnv = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...oldProcessEnv, NEXT_PUBLIC_FLAG_LEGAL: "1" };
  });
  afterAll(() => {
    process.env = oldProcessEnv;
  });

  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<LegalStep2 />, "/form/legal/2", dataStore);

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
      [crimeChargeExplanationField, licenseSuspendedExplanationField].filter(
        (field) => field.required === true,
      ),
    )(
      "when $prerequisiteField.dataStoreKey is $prerequisiteField.testValue and $dataStoreKey is not filled in",
      async (field) => {
        await testRequiredField(field, path2TestFields, renderFunction, screen);
      },
    );
  });

  it.each([...path1TestFields, crimeChargeExplanationField, licenseSuspendedExplanationField])(
    "fills $dataStoreKey from the data store when page is loaded",
    async (field) => {
      await testFillFromDataStore(field, renderFunction, screen);
    },
  );

  it("conditionally renders an explanation based on hasCrimeCharge", async () => {
    await testConditionalRender(
      crimeChargeExplanationField,
      noHasCrimeCharge,
      renderFunction,
      screen,
    );
  });

  it("conditionally renders an explanation based on hadLicenseSuspended", async () => {
    await testConditionalRender(
      licenseSuspendedExplanationField,
      noHadLicenseSuspended,
      renderFunction,
      screen,
    );
  });
});
