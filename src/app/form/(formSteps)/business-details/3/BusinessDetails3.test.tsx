import BusinessDetails3 from "@/app/form/(formSteps)/business-details/3/BusinessDetails3";
import { renderWithRouter } from "@/app/form/_utils/testUtils/renderWithRouter";
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

describe("<BusinessDetails3 />", () => {
  const renderFunction = () => renderWithRouter(<BusinessDetails3 />, "/form/business-details/3");

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
