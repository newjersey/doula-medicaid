import ReviewSection from "@/app/form/(formSteps)/review/ReviewSection";
import { type DataStore } from "@/app/form/_utils/dataStore";
import { generateDataStoreWithRequiredFields } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { renderWithProviders } from "@/app/form/_utils/testUtils/renderWithProviders";
import { screen, waitFor } from "@testing-library/react";
import type { Mock } from "vitest";

vi.mock("@form/_utils/fillPdf/form", () => ({
  ...(jest.requireActual("@form/_utils/fillPdf/form") as object),
  fillForm: vi.fn((_pdfFields, _fieldOptions, _pdfPath, filename: string) => {
    return { filename, bytes: new Uint8Array(0) };
  }),
}));

const renderFunction = (dataStore: DataStore) =>
  renderWithProviders(<ReviewSection />, "/form/review/1", dataStore);

describe("<ReviewSection />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("builds form, renders download link, and previous buttons", async () => {
    const mockCreateObjectURL = vi.fn().mockReturnValue("mock-blob-url");
    (global.URL.createObjectURL as Mock) = mockCreateObjectURL;
    const mockSendGAEvent = vi.spyOn(googleAnalytics, "sendGAEvent");

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
    expect(mockSendGAEvent).toHaveBeenCalledWith("event", "downloadApplication");
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
