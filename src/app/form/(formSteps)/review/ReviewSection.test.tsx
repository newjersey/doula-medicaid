import ReviewSection from "@/app/form/(formSteps)/review/ReviewSection";
import { type DataStore } from "@/app/form/_utils/dataStore";
import { generateDataStoreWithRequiredFields } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import { screen, waitFor } from "@testing-library/react";
import type { Mock } from "vitest";

vi.mock(import("@form/_utils/fillPdf/form"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    fillForm: vi.fn(async (_pdfFields, _fieldOptions, _pdfPath, filename: string) => {
      return { filename, bytes: new Uint8Array(0) };
    }),
  };
});

const renderFunction = (dataStore: DataStore) =>
  renderWithProviders(<ReviewSection />, "/form/review/1", dataStore);

describe("<ReviewSection />", () => {
  it("builds form, renders download link, and previous buttons", async () => {
    const mockCreateObjectURL = vi.fn().mockReturnValue("mock-blob-url");
    (window.URL.createObjectURL as Mock) = mockCreateObjectURL;

    const dataStore = generateDataStoreWithRequiredFields();
    renderFunction(dataStore);

    expect(screen.getByRole("link", { name: "Previous" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Next" })).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Download your application" })).toBeInTheDocument();
    });

    const downloadLink = screen.getByRole("link", { name: "Download your application" });
    expect(downloadLink).toHaveAttribute("href", "mock-blob-url");
    expect(downloadLink).toHaveAttribute("download", "Fee For Service Application.pdf");

    await downloadLink.click();
    expect(window.gtag).toHaveBeenCalledWith("event", "downloadApplication");
  });

  it("shows a message if not all required fields have been filled", async () => {
    const dataStore = generateDataStoreWithRequiredFields({}, ["dateOfBirthDay"]);
    renderFunction(dataStore);
    expect(
      screen.getByRole("heading", { level: 1, name: "Some form fields are missing" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please go through previous steps and fill all required fields."),
    ).toBeInTheDocument();
  });
});
