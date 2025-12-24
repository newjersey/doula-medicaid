import LegalStep3 from "@/app/form/(formSteps)/legal/3/LegalStep3";
import {
  companyInvolvementExplanationField,
  disqualificationExplanationField,
  firstRadioOptionTestFields,
  noHasCompanyInvolvement,
  noHasDisqualification,
  path1TestFields,
  path2TestFields,
  yesHasDisqualification,
} from "@/app/form/(formSteps)/legal/3/testFields";
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

describe("<LegalStep3 />", () => {
  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<LegalStep3 />, "/form/legal/3", dataStore);

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
      [disqualificationExplanationField, companyInvolvementExplanationField].filter(
        (field) => field.required === true,
      ),
    )(
      "when $prerequisiteField.dataStoreKey is $prerequisiteField.testValue and $dataStoreKey is not filled in",
      async (field) => {
        await testRequiredField(field, path2TestFields, renderFunction, screen);
      },
    );
  });

  it.each([
    ...path1TestFields,
    disqualificationExplanationField,
    companyInvolvementExplanationField,
  ])("fills $dataStoreKey from the data store when page is loaded", async (field) => {
    await testFillFromDataStore(field, renderFunction, screen);
  });

  it("conditionally renders an explanation based on hasCrimeCharge", async () => {
    await testConditionalRender(
      disqualificationExplanationField,
      noHasDisqualification,
      renderFunction,
      screen,
    );
  });

  it("conditionally renders an explanation based on hadLicenseSuspended", async () => {
    await testConditionalRender(
      companyInvolvementExplanationField,
      noHasCompanyInvolvement,
      renderFunction,
      screen,
    );
  });

  it("focuses on the first error, even if the first error is conditionally rendered", async () => {
    await testFocusesFirstErrorEvenIfConditional(
      disqualificationExplanationField,
      noHasCompanyInvolvement,
      [yesHasDisqualification, disqualificationExplanationField, noHasCompanyInvolvement],
      renderFunction,
      screen,
    );
  });
});
