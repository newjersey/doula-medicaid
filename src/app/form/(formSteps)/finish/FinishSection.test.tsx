import * as fillPdfForm from "@form/_utils/fillPdf/form";
import * as zipForms from "@form/_utils/fillPdf/zip";
import { AddressState, DisclosingEntity } from "@form/_utils/inputFields/enums";
import * as sessionStorage from "@form/_utils/sessionStorage";
import { jest } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import FinishSection from "./page";

// Mock the dependencies
jest.mock("@form/_utils/sessionStorage");
jest.mock("@form/_utils/fillPdf/form");
jest.mock("@form/_utils/fillPdf/zip");
jest.mock("@form/(formSteps)/components/FormProgressButtons", () => {
  return function MockFormProgressButtons() {
    return <div data-testid="form-progress-buttons">Form Progress Buttons</div>;
  };
});

const mockGetValue = sessionStorage.getValue as jest.MockedFunction<typeof sessionStorage.getValue>;
const mockFillAllForms = fillPdfForm.fillAllForms as jest.MockedFunction<
  typeof fillPdfForm.fillAllForms
>;
const mockZipForms = zipForms.zipForms as jest.MockedFunction<typeof zipForms.zipForms>;

// Mock URL.createObjectURL
const mockCreateObjectURL = jest.fn();
(global.URL.createObjectURL as jest.Mock) = mockCreateObjectURL;

describe("<FinishSection/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateObjectURL.mockReturnValue("mock-blob-url");
    mockFillAllForms.mockResolvedValue([
      { filename: "form1.pdf", bytes: new Uint8Array() },
      { filename: "form2.pdf", bytes: new Uint8Array() },
      { filename: "form3.pdf", bytes: new Uint8Array() },
    ]);
    mockZipForms.mockResolvedValue(new Blob());
  });

  const setupMockSessionStorage = (values: Record<string, string | null>) => {
    mockGetValue.mockImplementation((key: string) => values[key] || null);
  };

  it("builds form, renders download link, and form progress buttons", async () => {
    setupMockSessionStorage({});
    render(<FinishSection />);

    await waitFor(() => {
      expect(mockFillAllForms).toHaveBeenCalledTimes(1);
      expect(mockZipForms).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByTestId("form-progress-buttons")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Download your forms")).toBeInTheDocument();
    });

    const downloadLink = screen.getByRole("link", { name: "Download your forms" });
    expect(downloadLink).toHaveAttribute("href", "mock-blob-url");
    expect(downloadLink).toHaveAttribute("download", "filled_forms.zip");
  });

  describe("when hasSameBillingMailingAddress is true", () => {
    it("overwrites all billing address values with mailing address values", async () => {
      setupMockSessionStorage({
        streetAddress1: "123 Main St",
        streetAddress2: "Apt 4B",
        city: "New York",
        state: "NY",
        zip: "10001",
        hasSameBillingMailingAddress: "true",
        // These billing values should be ignored
        billingStreetAddress1: "456 Oak Ave",
        billingStreetAddress2: "Suite 200",
        billingCity: "Los Angeles",
        billingState: "CA",
        billingZip: "90210",
      });

      render(<FinishSection />);

      await waitFor(() => {
        expect(mockFillAllForms).toHaveBeenCalledWith(
          expect.objectContaining({
            streetAddress1: "123 Main St",
            streetAddress2: "Apt 4B",
            city: "New York",
            state: AddressState.NY,
            zip: "10001",
            hasSameBillingMailingAddress: true,
            // Billing address should match mailing address
            billingStreetAddress1: "123 Main St",
            billingStreetAddress2: "Apt 4B",
            billingCity: "New York",
            billingState: AddressState.NY,
            billingZip: "10001",
          }),
        );
      });
    });

    describe("when hasSameBillingMailingAddress is false", () => {
      it("uses separate billing address values", async () => {
        setupMockSessionStorage({
          streetAddress1: "123 Main St",
          streetAddress2: "Apt 4B",
          city: "New York",
          state: "NY",
          zip: "10001",
          hasSameBillingMailingAddress: "false",
          billingStreetAddress1: "456 Oak Ave",
          billingStreetAddress2: "Suite 200",
          billingCity: "Los Angeles",
          billingState: "CA",
          billingZip: "90210",
        });

        render(<FinishSection />);

        await waitFor(() => {
          expect(mockFillAllForms).toHaveBeenCalledWith(
            expect.objectContaining({
              streetAddress1: "123 Main St",
              streetAddress2: "Apt 4B",
              city: "New York",
              state: AddressState.NY,
              zip: "10001",
              hasSameBillingMailingAddress: false,
              billingStreetAddress1: "456 Oak Ave",
              billingStreetAddress2: "Suite 200",
              billingCity: "Los Angeles",
              billingState: AddressState.CA,
              billingZip: "90210",
            }),
          );
        });
      });
    });

    describe("date of birth handling", () => {
      it("creates date when all date components are present", async () => {
        setupMockSessionStorage({
          dateOfBirthMonth: "12",
          dateOfBirthDay: "25",
          dateOfBirthYear: "1990",
        });

        render(<FinishSection />);

        await waitFor(() => {
          expect(mockFillAllForms).toHaveBeenCalledWith(
            expect.objectContaining({
              dateOfBirth: new Date("12/25/1990"),
            }),
          );
        });
      });

      it("sets dateOfBirth to null when any date component is missing", async () => {
        setupMockSessionStorage({
          dateOfBirthMonth: "12",
          dateOfBirthDay: null,
          dateOfBirthYear: "1990",
        });

        render(<FinishSection />);

        await waitFor(() => {
          expect(mockFillAllForms).toHaveBeenCalledWith(
            expect.objectContaining({
              dateOfBirth: null,
            }),
          );
        });
      });
    });

    describe("disclosing entity handling", () => {
      it("sets natureOfDisclosingEntity to SoleProprietorship when isSoleProprietorship is true", async () => {
        setupMockSessionStorage({
          isSoleProprietorship: "true",
        });

        render(<FinishSection />);

        await waitFor(() => {
          expect(mockFillAllForms).toHaveBeenCalledWith(
            expect.objectContaining({
              natureOfDisclosingEntity: DisclosingEntity.SoleProprietorship,
            }),
          );
        });
      });

      it("sets natureOfDisclosingEntity to null when isSoleProprietorship is false", async () => {
        setupMockSessionStorage({
          isSoleProprietorship: "false",
        });

        render(<FinishSection />);

        await waitFor(() => {
          expect(mockFillAllForms).toHaveBeenCalledWith(
            expect.objectContaining({
              natureOfDisclosingEntity: null,
            }),
          );
        });
      });
    });
  });
});
