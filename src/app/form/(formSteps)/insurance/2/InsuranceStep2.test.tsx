import InsuranceStep2 from "@/app/form/(formSteps)/insurance/2/InsuranceStep2";
import { fillAllInputsExcept } from "@/app/form/_utils/testUtils/fillInputs";
import { RouterPathnameProvider } from "@/app/form/_utils/testUtils/RouterPathnameProvider";
import {
  createTestFields,
  testFillFromSessionStorage,
  testRequiredField,
  testSaveFieldsToSessionStorage,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const insuranceAddressGroupName =
  "Insurance address This is the office location of your insurance carrier.";

const insuranceDetailsFields: TestField[] = createTestFields([
  {
    name: "Name of your insurance carrier *",
    required: true,
    sessionStorageKey: "insuranceCarrierName",
    testValue: "Test insurance carrier",
  },
  {
    name: "Policy number *",
    required: true,
    sessionStorageKey: "insurancePolicyNumber",
    testValue: "ABC-12345",
  },
]);

const insuranceAddressFields: TestField[] = createTestFields([
  {
    name: "Street address *",
    required: true,
    sessionStorageKey: "insuranceStreetAddress1",
    testValue: "Test insurance address 1",
    withinGroupName: insuranceAddressGroupName,
  },
  {
    name: "Street address line 2",
    required: false,
    sessionStorageKey: "insuranceStreetAddress2",
    testValue: "Test insurance address 2",
    withinGroupName: insuranceAddressGroupName,
  },
  {
    name: "City *",
    required: true,
    sessionStorageKey: "insuranceCity",
    testValue: "Test insurance city",
    withinGroupName: insuranceAddressGroupName,
  },
  {
    name: "State *",
    required: false,
    role: "combobox",
    testValue: "NJ",
    sessionStorageKey: "insuranceState",
    withinGroupName: insuranceAddressGroupName,
  },
  {
    name: "ZIP code *",
    required: true,
    sessionStorageKey: "insuranceZip",
    testValue: "12345",
    withinGroupName: insuranceAddressGroupName,
  },
]);

const allTestFields = [...insuranceDetailsFields, ...insuranceAddressFields];

const renderWithRouter = () => {
  const mockRouter: Partial<AppRouterInstance> = {
    push: jest.fn(),
    refresh: jest.fn(),
  };
  render(
    <RouterPathnameProvider pathname="/form/insurance/2" router={mockRouter as AppRouterInstance}>
      <InsuranceStep2 />
    </RouterPathnameProvider>,
  );
  return mockRouter;
};

describe("<InsuranceStep2 />", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  describe("insurance details fields", () => {
    it("saves fields to session storage on submit", async () => {
      await testSaveFieldsToSessionStorage(
        insuranceDetailsFields,
        allTestFields,
        renderWithRouter,
        screen,
        "/form/training/1",
      );
    });

    it.each(insuranceDetailsFields)(
      "marks $sessionStorageKey as required and displays an error message if it is not filed in",
      async (field) => {
        await testRequiredField(field, allTestFields, renderWithRouter, screen);
      },
    );

    it.each(insuranceDetailsFields)(
      "fills $sessionStorageKey from session storage when page is loaded",
      async (field) => {
        await testFillFromSessionStorage(field, renderWithRouter, screen);
      },
    );
  });

  describe("insurance address fields", () => {
    it("saves fields to session storage on submit", async () => {
      await testSaveFieldsToSessionStorage(
        insuranceAddressFields,
        allTestFields,
        renderWithRouter,
        screen,
        "/form/training/1",
      );
    });

    it.each(insuranceAddressFields.filter((field) => field.required === true))(
      "marks $sessionStorageKey as required and displays an error message if it is not filed in",
      async (field) => {
        await testRequiredField(field, allTestFields, renderWithRouter, screen);
      },
    );

    it.each(insuranceAddressFields)(
      "fills $sessionStorageKey from session storage when page is loaded",
      async (field) => {
        await testFillFromSessionStorage(field, renderWithRouter, screen);
      },
    );

    it("defaults address state to NJ", async () => {
      const user = userEvent.setup();
      renderWithRouter();
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
