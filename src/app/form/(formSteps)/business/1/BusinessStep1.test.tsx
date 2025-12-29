import BusinessStep1 from "@/app/form/(formSteps)/business/1/BusinessStep1";
import {
  billingBusinessAddressSameAsOtherAddress,
  businessAddressFields,
  differentBusinessAddressSameAsOtherAddress,
  mailingBusinessAddressSameAsOtherAddress,
  path1TestFields,
  path2TestFields,
} from "@/app/form/(formSteps)/business/1/testFields";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import {
  testConditionalRender,
  testFillFromDataStore,
  testRequiredField,
  testSaveFieldsToDataStore,
} from "@/app/form/_utils/testUtils/sharedTests";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mailingAddress = {
  streetAddress1: "123 Main St",
  streetAddress2: "Apt 4B",
  city: "Trenton",
  state: "NJ",
  zip: "10001",
};
const billingAddress = {
  hasSameBillingMailingAddress: "false",
  billingStreetAddress1: "400 Billing St",
  billingStreetAddress2: "Unit 4",
  billingCity: "New York",
  billingState: "NY",
  billingZip: "22222",
};

describe("<BusinessStep1 />", () => {
  const getRenderWithExistingData = (existingData: DataStore) => {
    return (dataStore: DataStore = {}) =>
      renderWithProviders(<BusinessStep1 />, "/form/business/1", {
        ...dataStore,
        ...existingData,
      });
  };

  describe("Sole proprietor explainer", () => {
    it("orders the sole proprietor explainer immediately after the last sole proprietor content", async () => {
      const user = userEvent.setup();
      const renderFunction = getRenderWithExistingData(mailingAddress);
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
      const renderFunction = getRenderWithExistingData(mailingAddress);
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
        const renderFunction = getRenderWithExistingData(mailingAddress);
        await testSaveFieldsToDataStore(
          [mailingBusinessAddressSameAsOtherAddress],
          path1TestFields,
          renderFunction,
          screen,
        );
      });

      it("when the business address is the same as billing address", async () => {
        const renderFunction = getRenderWithExistingData({ ...mailingAddress, ...billingAddress });
        await testSaveFieldsToDataStore(
          [billingBusinessAddressSameAsOtherAddress],
          [billingBusinessAddressSameAsOtherAddress],
          renderFunction,
          screen,
        );
      });

      it("when the business address is different", async () => {
        const renderFunction = getRenderWithExistingData(mailingAddress);
        await testSaveFieldsToDataStore(
          [differentBusinessAddressSameAsOtherAddress, ...businessAddressFields],
          path2TestFields,
          renderFunction,
          screen,
        );
      });
    });

    describe("marks fields as required and displays an error message", () => {
      it("when businessAddressSameAsOtherAddress it is not filled in", async () => {
        const renderFunction = getRenderWithExistingData(mailingAddress);
        await testRequiredField(
          mailingBusinessAddressSameAsOtherAddress,
          path1TestFields,
          renderFunction,
          screen,
        );
      });

      it.each(businessAddressFields.filter((field) => field.required === true))(
        "when business address is different and $dataStoreKey is not filled in",
        async (field) => {
          const renderFunction = getRenderWithExistingData(mailingAddress);
          await testRequiredField(field, path2TestFields, renderFunction, screen);
        },
      );
    });

    it.each([mailingBusinessAddressSameAsOtherAddress, ...businessAddressFields])(
      "fills $dataStoreKey from the data store when page is loaded",
      async (field) => {
        const renderFunction = getRenderWithExistingData(mailingAddress);
        await testFillFromDataStore(field, renderFunction, screen);
      },
    );

    describe("address options", () => {
      it("shows mailing and different address options when hasSameBillingMailingAddress is true", () => {
        const renderFunction = getRenderWithExistingData({
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
        const renderFunction = getRenderWithExistingData({ ...mailingAddress, ...billingAddress });
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

    it.each(businessAddressFields)(
      "conditionally renders $dataStoreKey based on businessAddressSameAsOtherAddress",
      async (field) => {
        const renderFunction = getRenderWithExistingData(mailingAddress);
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
