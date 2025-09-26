import BusinessDetails1 from "@/app/form/(formSteps)/business-details/1/BusinessDetails1";
import { setInSessionStorage } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { RouterPathnameProvider } from "@/app/form/_utils/testUtils/renderWithRouter";
import {
  createTestField,
  createTestFields,
  testConditionalRender,
  testFillFromSessionStorage,
  testRequiredField,
  testSaveFieldsToSessionStorage,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const businessAddressQuestion = "What is your business address?";

const mailingBusinessAddressSameAsOtherAddress: TestField = createTestField({
  name: /Mailing address/i,
  sessionStorageKey: "businessAddressSameAsOtherAddress",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "radio",
  testValue: "mailing",
});
const billingBusinessAddressSameAsOtherAddress: TestField = createTestField({
  name: /Billing address/i,
  sessionStorageKey: "businessAddressSameAsOtherAddress",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "radio",
  testValue: "billing",
});
const differentBusinessAddressSameAsOtherAddress: TestField = createTestField({
  name: "I wish to enter a new address",
  sessionStorageKey: "businessAddressSameAsOtherAddress",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "radio",
  testValue: "different",
});

const businessAddressFields = createTestFields([
  {
    name: "Street address *",
    sessionStorageKey: "businessStreetAddress1",
    required: true,
    testValue: "Test address 1",
    withinGroupName: businessAddressQuestion,
    prerequisiteField: differentBusinessAddressSameAsOtherAddress,
  },
  {
    name: "Street address line 2",
    sessionStorageKey: "businessStreetAddress2",
    required: false,
    testValue: "Test address 2",
    withinGroupName: businessAddressQuestion,
    prerequisiteField: differentBusinessAddressSameAsOtherAddress,
  },
  {
    name: "City *",
    sessionStorageKey: "businessCity",
    required: true,
    testValue: "Test city",
    withinGroupName: businessAddressQuestion,
    prerequisiteField: differentBusinessAddressSameAsOtherAddress,
  },
  {
    name: "State *",
    sessionStorageKey: "businessState",
    required: false,
    role: "combobox",
    testValue: "PA",
    withinGroupName: businessAddressQuestion,
    prerequisiteField: differentBusinessAddressSameAsOtherAddress,
  },
  {
    name: "ZIP code *",
    sessionStorageKey: "businessZip",
    required: true,
    testValue: "12345",
    withinGroupName: businessAddressQuestion,
    prerequisiteField: differentBusinessAddressSameAsOtherAddress,
  },
]);

const minimalTestFields = [mailingBusinessAddressSameAsOtherAddress];
const allTestFields = [differentBusinessAddressSameAsOtherAddress, ...businessAddressFields];

const setMailingAddressInSessionStorage = () => {
  setInSessionStorage({
    streetAddress1: "123 Main St",
    streetAddress2: "Apt 4B",
    city: "Trenton",
    state: "NJ",
    zip: "10001",
  });
};
const setBillingAddressInSessionStorage = () => {
  setInSessionStorage({
    hasSameBillingMailingAddress: "false",
    billingStreetAddress1: "400 Billing St",
    billingStreetAddress2: "Unit 4",
    billingCity: "New York",
    billingState: "NY",
    billingZip: "22222",
  });
};

describe("<BusinessDetailsStep1 />", () => {
  const renderWithRouter = () => {
    const mockRouter: Partial<AppRouterInstance> = {
      push: jest.fn(),
      refresh: jest.fn(),
    };
    render(
      <RouterPathnameProvider
        pathname="/form/business-details/1"
        router={mockRouter as AppRouterInstance}
      >
        <BusinessDetails1 />
      </RouterPathnameProvider>,
    );
    return mockRouter;
  };

  describe("Sole proprietor explainer", () => {
    it("orders the sole proprietor explainer immediately after the sole proprietor content", async () => {
      const user = userEvent.setup();
      setMailingAddressInSessionStorage();
      renderWithRouter();

      const soleProprietorHeading = screen.getByRole("heading", {
        name: "You verified that you manage your business as an individual doula operating as a Sole Proprietor.",
        level: 2,
      });
      await user.click(soleProprietorHeading);
      await user.tab();
      expect(
        screen.getByRole("link", { name: "Medicaid Fee-for-Service application" }),
      ).toHaveFocus();

      await user.tab();
      const soleProprietorExplainer = screen.getByRole("button", {
        name: "What is a Sole Proprietorship business type?",
      });
      expect(soleProprietorExplainer).toHaveFocus();
    });

    it("has a heading level one greater than the section heading level", () => {
      setMailingAddressInSessionStorage();
      renderWithRouter();
      const sectionHeadingLevel = 2;
      const soleProprietorHeading = screen.getByRole("heading", {
        name: "You verified that you manage your business as an individual doula operating as a Sole Proprietor.",
        level: sectionHeadingLevel,
      });
      expect(soleProprietorHeading).toBeInTheDocument();
      const soleProprietorExplainer = screen.getByRole("heading", {
        name: "What is a Sole Proprietorship business type?",
        level: sectionHeadingLevel + 1,
      });
      expect(soleProprietorExplainer).toBeInTheDocument();
    });
  });

  describe("business address fields", () => {
    describe("saves fields to session storage on submit", () => {
      it("when the business address is the same as mailing address", async () => {
        setMailingAddressInSessionStorage();
        await testSaveFieldsToSessionStorage(
          [mailingBusinessAddressSameAsOtherAddress],
          minimalTestFields,
          renderWithRouter,
          screen,
          "/form/business-details/2",
        );
      });

      it("when the business address is the same as billing address", async () => {
        setMailingAddressInSessionStorage();
        setBillingAddressInSessionStorage();
        await testSaveFieldsToSessionStorage(
          [billingBusinessAddressSameAsOtherAddress],
          [billingBusinessAddressSameAsOtherAddress],
          renderWithRouter,
          screen,
          "/form/business-details/2",
        );
      });

      it("when the business address is different", async () => {
        setMailingAddressInSessionStorage();
        await testSaveFieldsToSessionStorage(
          [differentBusinessAddressSameAsOtherAddress, ...businessAddressFields],
          allTestFields,
          renderWithRouter,
          screen,
          "/form/business-details/2",
        );
      });
    });

    describe("marks fields as required and displays an error message", () => {
      it("when businessAddressSameAsOtherAddress it is not filled in", async () => {
        setMailingAddressInSessionStorage();
        await testRequiredField(
          mailingBusinessAddressSameAsOtherAddress,
          minimalTestFields,
          renderWithRouter,
          screen,
        );
      });

      it.each(businessAddressFields.filter((field) => field.required === true))(
        "when business address is different and $sessionStorageKey is not filled in",
        async (field) => {
          setMailingAddressInSessionStorage();
          await testRequiredField(field, allTestFields, renderWithRouter, screen);
        },
      );
    });

    it.each([mailingBusinessAddressSameAsOtherAddress, ...businessAddressFields])(
      "fills $sessionStorageKey from session storage when page is loaded",
      async (field) => {
        setMailingAddressInSessionStorage();
        await testFillFromSessionStorage(field, renderWithRouter, screen);
      },
    );

    describe("address options", () => {
      it("shows mailing and different address options when hasSameBillingMailingAddress is true", () => {
        setInSessionStorage({
          streetAddress1: "123 Main St",
          streetAddress2: "Apt 4B",
          city: "Trenton",
          state: "NJ",
          zip: "10001",
          hasSameBillingMailingAddress: "true",
        });
        renderWithRouter();
        const questionGroup = screen.getByRole("group", {
          name: "Is your business address the same as a previous address? Select one *",
        });
        expect(within(questionGroup).getAllByRole("radio").length).toEqual(2);
        expect(
          within(questionGroup).getByRole("radio", {
            name: "Mailing address: 123 Main St Apt 4B Trenton, NJ 10001",
          }),
        ).toBeInTheDocument();
        expect(
          within(questionGroup).queryByRole("radio", {
            name: /Billing address/i,
          }),
        ).not.toBeInTheDocument();
        expect(
          within(questionGroup).getByRole("radio", {
            name: "I wish to enter a new address",
          }),
        ).toBeInTheDocument();
      });

      it("shows billing address option when hasSameBillingMailingAddress is false", () => {
        setMailingAddressInSessionStorage();
        setBillingAddressInSessionStorage();
        renderWithRouter();
        const questionGroup = screen.getByRole("group", {
          name: "Is your business address the same as a previous address? Select one *",
        });
        expect(within(questionGroup).getAllByRole("radio").length).toEqual(3);
        expect(
          within(questionGroup).getByRole("radio", {
            name: /Mailing address/i,
          }),
        ).toBeInTheDocument();
        expect(
          within(questionGroup).getByRole("radio", {
            name: "Billing address: 400 Billing St Unit 4 New York, NY 22222",
          }),
        ).toBeInTheDocument();
        expect(
          within(questionGroup).getByRole("radio", {
            name: "I wish to enter a new address",
          }),
        ).toBeInTheDocument();
      });
    });

    it.each(businessAddressFields.filter((field) => field.required))(
      "conditionally renders $sessionStorageKey based on businessAddressSameAsOtherAddress",
      async (field) => {
        setMailingAddressInSessionStorage();
        await testConditionalRender(
          field,
          mailingBusinessAddressSameAsOtherAddress,
          renderWithRouter,
          screen,
        );
      },
    );
  });
});
