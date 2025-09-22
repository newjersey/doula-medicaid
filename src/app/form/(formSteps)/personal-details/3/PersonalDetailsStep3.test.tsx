import { RouterPathnameProvider } from "@/app/form/_utils/testUtils/RouterPathnameProvider";
import {
  createTestField,
  createTestFields,
  type TestField,
  testFillFromSessionStorage,
  testInvalidField,
  testRequiredField,
  testSaveFieldsToSessionStorage,
} from "@/app/form/_utils/testUtils/sharedTests";
import PersonalDetailsStep3 from "@form/(formSteps)/personal-details/3/page";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const npiNumberField = createTestField({
  name: "National Provider Identifier (NPI) *",
  required: true,
  alternateRequiredFieldError:
    "To be an NJ FamilyCare doula, your need a NPI. You can get yours via https://nppes.cms.hhs.gov/ . Enter your 10-digit NPI number.",
  sessionStorageKey: "npiNumber",
  testValue: "1111111111",
});

const doulaProviderIdentificationFields = [npiNumberField];

const otherIdentificationFields = createTestFields([
  {
    name: "UPIN number (optional)",
    required: false,
    sessionStorageKey: "upinNumber",
    testValue: "12345",
  },
  {
    name: "Medicare provider ID (optional)",
    required: false,
    sessionStorageKey: "medicareProviderId",
    testValue: "ABC12345",
  },
]);

const allTestFields = [...doulaProviderIdentificationFields, ...otherIdentificationFields];

describe("<PersonalDetailsStep3 />", () => {
  const renderWithRouter = () => {
    const mockPush = jest.fn();
    const mockRefresh = jest.fn();
    const mockRouter: Partial<AppRouterInstance> = {
      push: mockPush,
      refresh: mockRefresh,
    };
    render(
      <RouterPathnameProvider
        pathname="/form/personal-details/3"
        router={mockRouter as AppRouterInstance}
      >
        <PersonalDetailsStep3 />
      </RouterPathnameProvider>,
    );
    return mockRouter;
  };

  describe("Doula provider identification fields", () => {
    it("saves fields to session storage on submit", async () => {
      await testSaveFieldsToSessionStorage(
        doulaProviderIdentificationFields,
        allTestFields,
        renderWithRouter,
        screen,
        "/form/business-details/1",
      );
    });

    it.each(doulaProviderIdentificationFields.filter((field) => field.required))(
      "marks $sessionStorageKey as required and displays an error message if it is not filled in",
      async (field: TestField) => {
        await testRequiredField(field, allTestFields, renderWithRouter, screen);
      },
    );

    it.each(doulaProviderIdentificationFields)(
      "fills $sessionStorageKey from session storage when page is loaded",
      async (field: TestField) => {
        await testFillFromSessionStorage(field, renderWithRouter, screen);
      },
    );

    it("displays an error message if npiNumber is invalid", async () => {
      await testInvalidField(
        { ...npiNumberField, testValue: "1" },
        "National Provider Identifier (NPI) must have 10 digits",
        npiNumberField,
        allTestFields,
        renderWithRouter,
        screen,
      );
    });

    it("prevents non-numeric inputs in NPI Number", async () => {
      const user = userEvent.setup();
      renderWithRouter();
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
    it("saves fields to session storage on submit", async () => {
      await testSaveFieldsToSessionStorage(
        otherIdentificationFields,
        allTestFields,
        renderWithRouter,
        screen,
        "/form/business-details/1",
      );
    });

    // No fields in this section are required, skipping testRequiredField

    it.each(otherIdentificationFields)(
      "fills $sessionStorageKey from session storage when page is loaded",
      async (field: TestField) => {
        await testFillFromSessionStorage(field, renderWithRouter, screen);
      },
    );
  });

  describe("NPI explainer", () => {
    it("orders the NPI explainer immediately after the NPI input", async () => {
      const user = userEvent.setup();
      renderWithRouter();

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
      renderWithRouter();
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
