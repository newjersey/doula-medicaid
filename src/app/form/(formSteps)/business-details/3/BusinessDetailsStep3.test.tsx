import BusinessDetailsStep3 from "@/app/form/(formSteps)/business-details/3/BusinessDetailsStep3";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  testFillFromDataStore,
  testRequiredField,
  testSaveFieldsToDataStore,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";

const noHasUncollectedDebt: TestField = {
  name: "No",
  dataStoreKey: "hasUncollectedDebt",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "false",
  expectedValue: "false",
  withinGroupName:
    "Do you have any uncollected debt to Medicare, Medicaid/NJ FamilyCare, or CHIP (Children's Health Insurance Program)? Select one *",
};

const yesHasUncollectedDebt: TestField = {
  name: "Yes",
  dataStoreKey: "hasUncollectedDebt",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "true",
  expectedValue: "true",
  withinGroupName:
    "Do you have any uncollected debt to Medicare, Medicaid/NJ FamilyCare, or CHIP (Children's Health Insurance Program)? Select one *",
};

const noIsSubjectToPaymentSuspension: TestField = {
  name: "No",
  dataStoreKey: "isSubjectToPaymentSuspension",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "false",
  expectedValue: "false",
  withinGroupName:
    "Have you ever been subject to a payment suspension under a federal health care program? Select one *",
};

const yesIsSubjectToPaymentSuspension: TestField = {
  name: "Yes",
  dataStoreKey: "isSubjectToPaymentSuspension",
  required: true,
  requiredErrorMessage: "This question is required",
  role: "radio",
  testValue: "true",
  expectedValue: "true",
  withinGroupName:
    "Have you ever been subject to a payment suspension under a federal health care program? Select one *",
};

const minimalTestFields: Array<TestField> = [
  yesHasUncollectedDebt,
  yesIsSubjectToPaymentSuspension,
];
const allTestFields: Array<TestField> = [
  noHasUncollectedDebt,
  noIsSubjectToPaymentSuspension,
  yesHasUncollectedDebt,
  yesIsSubjectToPaymentSuspension,
];

describe("<BusinessDetailsStep3 />", () => {
  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<BusinessDetailsStep3 />, "/form/business-details/3", dataStore);

  it("saves fields to the data store on submit", async () => {
    await testSaveFieldsToDataStore(minimalTestFields, minimalTestFields, renderFunction, screen);
  });

  it.each(minimalTestFields.filter((field) => field.required === true))(
    "marks $dataStoreKey as required and displays an error message if it is not filed in",
    async (field) => {
      await testRequiredField(field, minimalTestFields, renderFunction, screen);
    },
  );

  it.each(allTestFields)(
    "fills $dataStoreKey from the data store when page is loaded",
    async (field) => {
      await testFillFromDataStore(field, renderFunction, screen);
    },
  );
});
