import InsuranceStep2 from "@/app/form/(formSteps)/insurance/2/InsuranceStep2";
import {
  insuranceAddressFields,
  insuranceDetailsFields,
  insuranceStateField,
  testFields,
} from "@/app/form/(formSteps)/insurance/2/testFields";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { fillAllInputsExcept, getInputField } from "@/app/form/_utils/testUtils/fillInputs";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  testFillFromDataStore,
  testRequiredField,
  testSaveFieldsToDataStore,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const renderFunction = (dataStore: DataStore = {}) =>
  renderWithProviders(<InsuranceStep2 />, "/form/insurance/2", dataStore);

describe("<InsuranceStep2 />", () => {
  describe("insurance details fields", () => {
    it("saves fields to the data store on submit", async () => {
      await testSaveFieldsToDataStore(insuranceDetailsFields, testFields, renderFunction, screen);
    });

    it.each(insuranceDetailsFields)(
      "marks $dataStoreKey as required and displays an error message if it is not filed in",
      async (field) => {
        await testRequiredField(field, testFields, renderFunction, screen);
      },
    );

    it.each(insuranceDetailsFields)(
      "fills $dataStoreKey from the data store when page is loaded",
      async (field) => {
        await testFillFromDataStore(field, renderFunction, screen);
      },
    );
  });

  describe("insurance address fields", () => {
    it("saves fields to the data store on submit", async () => {
      await testSaveFieldsToDataStore(insuranceAddressFields, testFields, renderFunction, screen);
    });

    it.each(insuranceAddressFields.filter((field) => field.required === true))(
      "marks $dataStoreKey as required and displays an error message if it is not filed in",
      async (field) => {
        await testRequiredField(field, testFields, renderFunction, screen);
      },
    );

    it.each(insuranceAddressFields)(
      "fills $dataStoreKey from the data store when page is loaded",
      async (field) => {
        await testFillFromDataStore(field, renderFunction, screen);
      },
    );

    it("defaults address state to New Jersey", async () => {
      const user = userEvent.setup();
      const { mockUpdateDataStore } = renderFunction();
      const insuranceStateInput = await getInputField(screen, insuranceStateField);
      expect(insuranceStateInput).toHaveDisplayValue("New Jersey");
      expect(insuranceStateInput).toHaveValue("NJ");

      await fillAllInputsExcept(screen, user, testFields, new Set(["insuranceState"]));
      await user.click(screen.getByRole("button", { name: "Next" }));

      expect(mockUpdateDataStore).toHaveBeenCalledWith(
        expect.objectContaining({ insuranceState: "NJ" }),
      );
    });
  });
});
