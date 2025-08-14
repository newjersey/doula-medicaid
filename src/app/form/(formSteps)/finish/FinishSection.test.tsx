import FinishSection from "@form/(formSteps)/finish/page";
import { AddressState, DisclosingEntity } from "@form/_utils/inputFields/enums";
import { RouterPathnameProvider } from "@form/_utils/testUtils";
import { jest } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getFormData } from "./getFormData";

jest.mock("@form/_utils/fillPdf/form");
jest.mock("@form/_utils/fillPdf/zip");

const mockCreateObjectURL = jest.fn();
(global.URL.createObjectURL as jest.Mock) = mockCreateObjectURL;

const renderWithRouter = () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();
  const mockRouter: Partial<AppRouterInstance> = {
    push: mockPush,
    refresh: mockRefresh,
  };
  render(
    <RouterPathnameProvider pathname="/form/finish/1" router={mockRouter as AppRouterInstance}>
      <FinishSection />
    </RouterPathnameProvider>,
  );
  return mockRouter;
};

const setRequiredFieldsInStorage = () => {
  window.sessionStorage.setItem("dateOfBirthDay", "25");
  window.sessionStorage.setItem("dateOfBirthMonth", "12");
  window.sessionStorage.setItem("dateOfBirthYear", "1990");
  window.sessionStorage.setItem("hasSameBillingMailingAddress", "true");
  mockCreateObjectURL.mockReturnValue("mock-blob-url");
};

describe("<FinishSection />", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("builds form, renders download link, and previous buttons", async () => {
    setRequiredFieldsInStorage();
    renderWithRouter();

    expect(screen.getByRole("link", { name: "Previous" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Next" })).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Download your forms")).toBeInTheDocument();
    });

    const downloadLink = screen.getByRole("link", { name: "Download your forms" });
    expect(downloadLink).toHaveAttribute("href", "mock-blob-url");
    expect(downloadLink).toHaveAttribute("download", "filled_forms.zip");
  });
  describe("getFormData", () => {
    describe("hasSameBillingMailingAddress handling", () => {
      describe("when hasSameBillingMailingAddress is true", () => {
        it("overwrites all billing address values with mailing address values", () => {
          setRequiredFieldsInStorage();
          window.sessionStorage.setItem("streetAddress1", "123 Main St");
          window.sessionStorage.setItem("streetAddress2", "Apt 4B");
          window.sessionStorage.setItem("city", "Trenton");
          window.sessionStorage.setItem("state", "NJ");
          window.sessionStorage.setItem("zip", "10001");
          window.sessionStorage.setItem("hasSameBillingMailingAddress", "true");
          window.sessionStorage.setItem("billingStreetAddress1", "400 Ignore St");
          window.sessionStorage.setItem("billingStreetAddress2", "Unit 4");
          window.sessionStorage.setItem("billingCity", "New York");
          window.sessionStorage.setItem("billingState", "NY");
          window.sessionStorage.setItem("billingZip", "22222");
          expect(getFormData()).toMatchObject({
            streetAddress1: "123 Main St",
            streetAddress2: "Apt 4B",
            city: "Trenton",
            state: AddressState.NJ,
            zip: "10001",
            hasSameBillingMailingAddress: true,
            billingStreetAddress1: "123 Main St",
            billingStreetAddress2: "Apt 4B",
            billingCity: "Trenton",
            billingState: AddressState.NJ,
            billingZip: "10001",
          });
        });
      });

      describe("when hasSameBillingMailingAddress is false", () => {
        it("uses separate billing address values", () => {
          setRequiredFieldsInStorage();
          window.sessionStorage.setItem("streetAddress1", "123 Main St");
          window.sessionStorage.setItem("streetAddress2", "Apt 4B");
          window.sessionStorage.setItem("city", "Trenton");
          window.sessionStorage.setItem("state", "NJ");
          window.sessionStorage.setItem("zip", "10001");
          window.sessionStorage.setItem("hasSameBillingMailingAddress", "false");
          window.sessionStorage.setItem("billingStreetAddress1", "400 Ignore St");
          window.sessionStorage.setItem("billingStreetAddress2", "Unit 4");
          window.sessionStorage.setItem("billingCity", "New York");
          window.sessionStorage.setItem("billingState", "NY");
          window.sessionStorage.setItem("billingZip", "22222");
          expect(getFormData()).toMatchObject({
            streetAddress1: "123 Main St",
            streetAddress2: "Apt 4B",
            city: "Trenton",
            state: AddressState.NJ,
            zip: "10001",
            hasSameBillingMailingAddress: false,
            billingStreetAddress1: "400 Ignore St",
            billingStreetAddress2: "Unit 4",
            billingCity: "New York",
            billingState: AddressState.NY,
            billingZip: "22222",
          });
        });
      });

      it("throws an error if hasSameBillingMailingAddress is not set", () => {
        setRequiredFieldsInStorage();
        window.sessionStorage.removeItem("hasSameBillingMailingAddress");
        expect(() => getFormData()).toThrow(
          "PDF generation failed: hasSameBillingMailingAddress is not set",
        );
      });
    });

    describe("date of birth handling", () => {
      it("creates date when all date components are present", async () => {
        window.sessionStorage.setItem("hasSameBillingMailingAddress", "true");
        mockCreateObjectURL.mockReturnValue("mock-blob-url");
        window.sessionStorage.setItem("dateOfBirthDay", "25");
        window.sessionStorage.setItem("dateOfBirthMonth", "12");
        window.sessionStorage.setItem("dateOfBirthYear", "1990");
        expect(getFormData()).toMatchObject({
          dateOfBirth: new Date("1990/12/25"),
        });
      });

      describe("sets dateOfBirth to null when any date component is missing", () => {
        it("when day is missing", async () => {
          window.sessionStorage.setItem("hasSameBillingMailingAddress", "true");
          mockCreateObjectURL.mockReturnValue("mock-blob-url");
          window.sessionStorage.setItem("dateOfBirthMonth", "12");
          window.sessionStorage.setItem("dateOfBirthYear", "1990");
          expect(() => getFormData()).toThrow(
            "PDF generation failed: Incomplete date of birth provided",
          );
        });

        it("when month is missing", async () => {
          window.sessionStorage.setItem("hasSameBillingMailingAddress", "true");
          mockCreateObjectURL.mockReturnValue("mock-blob-url");
          window.sessionStorage.setItem("dateOfBirthDay", "25");
          window.sessionStorage.setItem("dateOfBirthYear", "1990");
          expect(() => getFormData()).toThrow(
            "PDF generation failed: Incomplete date of birth provided",
          );
        });

        it("when year is missing", async () => {
          window.sessionStorage.setItem("hasSameBillingMailingAddress", "true");
          mockCreateObjectURL.mockReturnValue("mock-blob-url");
          window.sessionStorage.setItem("dateOfBirthDay", "25");
          window.sessionStorage.setItem("dateOfBirthMonth", "12");
          expect(() => getFormData()).toThrow(
            "PDF generation failed: Incomplete date of birth provided",
          );
        });
      });
    });

    describe("disclosing entity handling", () => {
      it("sets natureOfDisclosingEntity to SoleProprietorship when isSoleProprietorship is true", async () => {
        setRequiredFieldsInStorage();
        window.sessionStorage.setItem("isSoleProprietorship", "true");
        expect(getFormData()).toMatchObject({
          natureOfDisclosingEntity: DisclosingEntity.SoleProprietorship,
        });
      });

      it("sets natureOfDisclosingEntity to null when isSoleProprietorship is false", async () => {
        setRequiredFieldsInStorage();
        window.sessionStorage.setItem("isSoleProprietorship", "false");
        expect(getFormData()).toMatchObject({
          natureOfDisclosingEntity: null,
        });
      });
    });
  });
});
