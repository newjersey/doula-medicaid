import InsuranceStep2 from "@/app/form/(formSteps)/insurance/2/InsuranceStep2";
import { fillAllInputsExcept } from "@/app/form/_utils/testUtils/fillInputs";
import { renderWithRouter } from "@/app/form/_utils/testUtils/renderWithRouter";
import {
  createTestFields,
  testFillFromDataStore,
  testRequiredField,
  testSaveFieldsToDataStore,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const insuranceAddressGroupName =
  "Insurance address This is the office location of your insurance carrier.";

const insuranceDetailsFields: TestField[] = createTestFields([
  {
    name: "Name of your insurance carrier *",
    required: true,
    dataStoreKey: "insuranceCarrierName",
    testValue: "Test insurance carrier",
  },
  {
    name: "Policy number *",
    required: true,
    dataStoreKey: "insurancePolicyNumber",
    testValue: "ABC-12345",
  },
]);

const insuranceAddressFields: TestField[] = createTestFields([
  {
    name: "Street address *",
    required: true,
    dataStoreKey: "insuranceStreetAddress1",
    testValue: "Test insurance address 1",
    withinGroupName: insuranceAddressGroupName,
  },
  {
    name: "Street address line 2",
    required: false,
    dataStoreKey: "insuranceStreetAddress2",
    testValue: "Test insurance address 2",
    withinGroupName: insuranceAddressGroupName,
  },
  {
    name: "City *",
    required: true,
    dataStoreKey: "insuranceCity",
    testValue: "Test insurance city",
    withinGroupName: insuranceAddressGroupName,
  },
  {
    name: "State *",
    required: false,
    role: "combobox",
    testValue: "NJ",
    dataStoreKey: "insuranceState",
    withinGroupName: insuranceAddressGroupName,
  },
  {
    name: "ZIP code *",
    required: true,
    dataStoreKey: "insuranceZip",
    testValue: "12345",
    withinGroupName: insuranceAddressGroupName,
  },
]);

const allTestFields = [...insuranceDetailsFields, ...insuranceAddressFields];

const renderFunction = () => renderWithRouter(<InsuranceStep2 />, "/form/insurance/2");

describe("<InsuranceStep2 />", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  describe("insurance details fields", () => {
    it("saves fields to the data store on submit", async () => {
      await testSaveFieldsToDataStore(
        insuranceDetailsFields,
        allTestFields,
        renderFunction,
        screen,
      );
    });

    it.each(insuranceDetailsFields)(
      "marks $dataStoreKey as required and displays an error message if it is not filed in",
      async (field) => {
        await testRequiredField(field, allTestFields, renderFunction, screen);
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
      await testSaveFieldsToDataStore(
        insuranceAddressFields,
        allTestFields,
        renderFunction,
        screen,
      );
    });

    it.each(insuranceAddressFields.filter((field) => field.required === true))(
      "marks $dataStoreKey as required and displays an error message if it is not filed in",
      async (field) => {
        await testRequiredField(field, allTestFields, renderFunction, screen);
      },
    );

    it.each(insuranceAddressFields)(
      "fills $dataStoreKey from the data store when page is loaded",
      async (field) => {
        await testFillFromDataStore(field, renderFunction, screen);
      },
    );

    it("defaults address state to NJ", async () => {
      const user = userEvent.setup();
      renderFunction();
      const combobox = screen.getByRole("combobox", {
        name: "State *",
      });
      expect(combobox).toHaveValue("NJ");

      await fillAllInputsExcept(screen, user, allTestFields, new Set("insuranceState"));
      await user.click(screen.getByRole("button", { name: "Next" }));

      expect(window.sessionStorage.getItem("insuranceState")).toEqual("NJ");
    });
  });
});
