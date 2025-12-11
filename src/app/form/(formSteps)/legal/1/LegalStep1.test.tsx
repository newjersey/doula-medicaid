import LegalStep1 from "@/app/form/(formSteps)/legal/1/LegalStep1";
import {
  approvedForMedicaidDetails,
  employedByStateDetails,
  noApprovedForMedicaidProgram,
  noEmployedByState,
  path1TestFields,
  path2TestFields,
  yesApprovedForMedicaidProgram,
  yesEmployedByState,
} from "@/app/form/(formSteps)/legal/1/testFields";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  testRequiredField,
  testSaveFieldsToDataStore,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";
describe("<LegalStep1 />", () => {
  const oldProcessEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...oldProcessEnv, NEXT_PUBLIC_FLAG_LEGAL: "1" };
  });

  afterAll(() => {
    process.env = oldProcessEnv;
  });

  const renderFunction = (dataStore: DataStore = {}) =>
    renderWithProviders(<LegalStep1 />, "/form/legal/1", dataStore);

  it("renders", async () => {
    renderFunction();
  });

  // user clicks no for both and doesnt have to fill out textarea
  describe("Marks both radios as No", () => {
    it("Answers No for employed by the state.", async () => {
      await testRequiredField(noEmployedByState, path1TestFields, renderFunction, screen);
    });

    it("Answers No for approved by medicaid.", async () => {
      await testRequiredField(
        noApprovedForMedicaidProgram,
        path1TestFields,
        renderFunction,
        screen,
      );
    });

    it("Answers No for employed by the state.", async () => {
      await testSaveFieldsToDataStore([noEmployedByState], path1TestFields, renderFunction, screen);
    });

    it("Answers No for approved by medicaid.", async () => {
      await testSaveFieldsToDataStore(
        [noApprovedForMedicaidProgram],
        path1TestFields,
        renderFunction,
        screen,
      );
    });
  });

  it("Answers No for employed by the state.", async () => {
    await testSaveFieldsToDataStore(
      [yesEmployedByState, ...employedByStateDetails],
      path2TestFields,
      renderFunction,
      screen,
    );
  });

  it("Answers No for employed by the state.", async () => {
    await testSaveFieldsToDataStore(
      [yesApprovedForMedicaidProgram, ...approvedForMedicaidDetails],
      path2TestFields,
      renderFunction,
      screen,
    );
  });

  // when its no
  // describe("marks fields as required and displays an error message", () => {
  //   it.each(firstRadioOptionTestFields.filter((field) => field.required === true))(
  //     "when $dataStoreKey is not filed in",
  //     async (field) => {
  //       await testRequiredField(field, path1TestFields, renderFunction, screen);
  //     },
  //   );

  //   // when its yes and the conditional appears
  //   it.each(
  //     [...employedByStateDetails].filter(
  //       (field) => field.required === true,
  //     ),
  //   )(
  //     "when $prerequisiteField.dataStoreKey is $prerequisiteField.testValue and $dataStoreKey is not filled in",
  //     async (field) => {
  //       await testRequiredField(field, path2TestFields, renderFunction, screen);
  //     },
  //   );
  // });

  // user clicks yes for both questons and must fill text area

  // user clicks no for Q1 and yes for Q2

  // user clicks yes for Q1 and no for Q2
});
