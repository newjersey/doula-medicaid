import BusinessDetailsStep1 from "@/app/form/(formSteps)/business-details/1/BusinessDetailsStep1";
import { setInDataStore } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { renderWithRouter } from "@/app/form/_utils/testUtils/renderWithRouter";
import {
  createTestField,
  createTestFields,
  testConditionalRender,
  testFillFromDataStore,
  testRequiredField,
  testSaveFieldsToDataStore,
  type TestField,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const businessAddressQuestion = "What is your business address?";

const mailingBusinessAddressSameAsOtherAddress: TestField = createTestField({
  name: /Mailing address/i,
  dataStoreKey: "businessAddressSameAsOtherAddress",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "radio",
  testValue: "mailing",
});
const billingBusinessAddressSameAsOtherAddress: TestField = createTestField({
  name: /Billing address/i,
  dataStoreKey: "businessAddressSameAsOtherAddress",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "radio",
  testValue: "billing",
});
const differentBusinessAddressSameAsOtherAddress: TestField = createTestField({
  name: "I wish to enter a new address",
  dataStoreKey: "businessAddressSameAsOtherAddress",
  required: true,
  alternateRequiredFieldError: "This question is required",
  role: "radio",
  testValue: "different",
});

const businessAddressFields = createTestFields([
  {
    name: "Street address *",
    dataStoreKey: "businessStreetAddress1",
    required: true,
    testValue: "Test address 1",
    withinGroupName: businessAddressQuestion,
    prerequisiteField: differentBusinessAddressSameAsOtherAddress,
  },
  {
    name: "Street address line 2",
    dataStoreKey: "businessStreetAddress2",
    required: false,
    testValue: "Test address 2",
    withinGroupName: businessAddressQuestion,
    prerequisiteField: differentBusinessAddressSameAsOtherAddress,
  },
  {
    name: "City *",
    dataStoreKey: "businessCity",
    required: true,
    testValue: "Test city",
    withinGroupName: businessAddressQuestion,
    prerequisiteField: differentBusinessAddressSameAsOtherAddress,
  },
  {
    name: "State *",
    dataStoreKey: "businessState",
    required: false,
    role: "combobox",
    testValue: "PA",
    withinGroupName: businessAddressQuestion,
    prerequisiteField: differentBusinessAddressSameAsOtherAddress,
  },
  {
    name: "ZIP code *",
    dataStoreKey: "businessZip",
    required: true,
    testValue: "12345",
    withinGroupName: businessAddressQuestion,
    prerequisiteField: differentBusinessAddressSameAsOtherAddress,
  },
]);

const minimalTestFields = [mailingBusinessAddressSameAsOtherAddress];
const allTestFields = [differentBusinessAddressSameAsOtherAddress, ...businessAddressFields];

const setMailingAddressInDataStore = () => {
  setInDataStore({
    streetAddress1: "123 Main St",
    streetAddress2: "Apt 4B",
    city: "Trenton",
    state: "NJ",
    zip: "10001",
  });
};
const setBillingAddressInDataStore = () => {
  setInDataStore({
    hasSameBillingMailingAddress: "false",
    billingStreetAddress1: "400 Billing St",
    billingStreetAddress2: "Unit 4",
    billingCity: "New York",
    billingState: "NY",
    billingZip: "22222",
  });
};

describe("<BusinessDetailsStep1 />", () => {
  const renderFunction = () =>
    renderWithRouter(<BusinessDetailsStep1 />, "/form/business-details/1");

  describe("Sole proprietor explainer", () => {
    it("orders the sole proprietor explainer immediately after the sole proprietor content", async () => {
      const user = userEvent.setup();
      setMailingAddressInDataStore();
      renderFunction();

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
      setMailingAddressInDataStore();
      renderFunction();
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
    describe("saves fields to the data store on submit", () => {
      it("when the business address is the same as mailing address", async () => {
        setMailingAddressInDataStore();
        await testSaveFieldsToDataStore(
          [mailingBusinessAddressSameAsOtherAddress],
          minimalTestFields,
          renderFunction,
          screen,
        );
      });

      it("when the business address is the same as billing address", async () => {
        setMailingAddressInDataStore();
        setBillingAddressInDataStore();
        await testSaveFieldsToDataStore(
          [billingBusinessAddressSameAsOtherAddress],
          [billingBusinessAddressSameAsOtherAddress],
          renderFunction,
          screen,
        );
      });

      it("when the business address is different", async () => {
        setMailingAddressInDataStore();
        await testSaveFieldsToDataStore(
          [differentBusinessAddressSameAsOtherAddress, ...businessAddressFields],
          allTestFields,
          renderFunction,
          screen,
        );
      });
    });

    describe("marks fields as required and displays an error message", () => {
      it("when businessAddressSameAsOtherAddress it is not filled in", async () => {
        setMailingAddressInDataStore();
        await testRequiredField(
          mailingBusinessAddressSameAsOtherAddress,
          minimalTestFields,
          renderFunction,
          screen,
        );
      });

      it.each(businessAddressFields.filter((field) => field.required === true))(
        "when business address is different and $dataStoreKey is not filled in",
        async (field) => {
          setMailingAddressInDataStore();
          await testRequiredField(field, allTestFields, renderFunction, screen);
        },
      );
    });

    it.each([mailingBusinessAddressSameAsOtherAddress, ...businessAddressFields])(
      "fills $dataStoreKey from the data store when page is loaded",
      async (field) => {
        setMailingAddressInDataStore();
        await testFillFromDataStore(field, renderFunction, screen);
      },
    );

    describe("address options", () => {
      it("shows mailing and different address options when hasSameBillingMailingAddress is true", () => {
        setInDataStore({
          streetAddress1: "123 Main St",
          streetAddress2: "Apt 4B",
          city: "Trenton",
          state: "NJ",
          zip: "10001",
          hasSameBillingMailingAddress: "true",
        });
        renderFunction();
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
        setMailingAddressInDataStore();
        setBillingAddressInDataStore();
        renderFunction();
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
      "conditionally renders $dataStoreKey based on businessAddressSameAsOtherAddress",
      async (field) => {
        setMailingAddressInDataStore();
        await testConditionalRender(
          field,
          mailingBusinessAddressSameAsOtherAddress,
          renderFunction,
          screen,
        );
      },
    );
  });
});
