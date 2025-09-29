import PersonalDetailsStep3 from "@/app/form/(formSteps)/personal-details/3/PersonalDetailsStep3";
import { renderWithRouter } from "@/app/form/_utils/testUtils/renderWithRouter";
import {
  createTestField,
  createTestFields,
  type TestField,
  testFillFromDataStore,
  testInvalidField,
  testRequiredField,
  testSaveFieldsToDataStore,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const npiNumberField = createTestField({
  name: "National Provider Identifier (NPI) *",
  required: true,
  alternateRequiredFieldError:
    "To be an NJ FamilyCare doula, you need a NPI. You can get yours via https://nppes.cms.hhs.gov/ . Enter your 10-digit NPI number.",
  dataStoreKey: "npiNumber",
  testValue: "1111111111",
});

const doulaProviderIdentificationFields = [npiNumberField];

const otherIdentificationFields = createTestFields([
  {
    name: "UPIN number (optional)",
    required: false,
    dataStoreKey: "upinNumber",
    testValue: "12345",
  },
  {
    name: "Medicare provider ID (optional)",
    required: false,
    dataStoreKey: "medicareProviderId",
    testValue: "ABC12345",
  },
]);

const allTestFields = [...doulaProviderIdentificationFields, ...otherIdentificationFields];

describe("<PersonalDetailsStep3 />", () => {
  const renderFunction = () =>
    renderWithRouter(<PersonalDetailsStep3 />, "/form/personal-details/3");

  describe("Doula provider identification fields", () => {
    it("saves fields to the data store on submit", async () => {
      await testSaveFieldsToDataStore(
        doulaProviderIdentificationFields,
        allTestFields,
        renderFunction,
        screen,
      );
    });

    it.each(doulaProviderIdentificationFields.filter((field) => field.required))(
      "marks $dataStoreKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, allTestFields, renderFunction, screen);
      },
    );

    it.each(doulaProviderIdentificationFields)(
      "fills $dataStoreKey from the data store when page is loaded",
      async (field: TestField) => {
        await testFillFromDataStore(field, renderFunction, screen);
      },
    );

    it("displays an error message if npiNumber is invalid", async () => {
      await testInvalidField(
        { ...npiNumberField, testValue: "1" },
        "National Provider Identifier (NPI) must have 10 digits",
        allTestFields,
        renderFunction,
        screen,
      );
    });

    it("prevents non-numeric inputs in NPI Number", async () => {
      const user = userEvent.setup();
      renderFunction();
      const input = screen.getByRole("textbox", {
        name: "National Provider Identifier (NPI) *",
      });

      await user.type(input, "aaa");
      expect(input).toHaveValue("");
      await user.type(input, "!!");
      expect(input).toHaveValue("");
    });
  });

  describe("Other identification fields", () => {
    it("saves fields to the data store on submit", async () => {
      await testSaveFieldsToDataStore(
        otherIdentificationFields,
        allTestFields,
        renderFunction,
        screen,
      );
    });

    // No fields in this section are required, skipping testRequiredField

    it.each(otherIdentificationFields)(
      "fills $dataStoreKey from the data store when page is loaded",
      async (field: TestField) => {
        await testFillFromDataStore(field, renderFunction, screen);
      },
    );
  });

  describe("NPI explainer", () => {
    it("orders the NPI explainer immediately after the NPI input", async () => {
      const user = userEvent.setup();
      renderFunction();

      const npiInput = screen.getByRole("textbox", {
        name: "National Provider Identifier (NPI) *",
      });
      const npiExplainer = screen.getByRole("button", { name: "What is an NPI?" });
      await user.type(npiInput, "1");
      expect(npiInput).toHaveFocus();

      await user.tab();
      expect(npiExplainer).toHaveFocus();
    });

    it("has a heading level one greater than the section heading level", () => {
      renderFunction();
      const sectionHeadingLevel = 2;
      const npiSectionHeading = screen.getByRole("heading", {
        name: "Doula provider identification",
        level: sectionHeadingLevel,
      });
      expect(npiSectionHeading).toBeInTheDocument();
      const npiExplainer = screen.getByRole("heading", {
        name: "What is an NPI?",
        level: sectionHeadingLevel + 1,
      });
      expect(npiExplainer).toBeInTheDocument();
    });
  });
});
