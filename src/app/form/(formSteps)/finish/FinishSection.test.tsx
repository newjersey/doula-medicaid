import FinishSection from "@/app/form/(formSteps)/finish/FinishSection";
import { setRequiredFieldsInSessionStorage } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { renderWithRouter } from "@/app/form/_utils/testUtils/renderWithRouter";
import { jest } from "@jest/globals";
import { screen, waitFor } from "@testing-library/react";

jest.mock("@form/_utils/fillPdf/form", () => ({
  ...(jest.requireActual("@form/_utils/fillPdf/form") as object),
  fillForm: jest.fn((_pdfFields, _pdfPath, filename: string) => {
    return { filename, bytes: new Uint8Array(0) };
  }),
}));

const mockCreateObjectURL = jest.fn();
(global.URL.createObjectURL as jest.Mock) = mockCreateObjectURL;

const renderFunction = () => renderWithRouter(<FinishSection />, "/form/finish/1");

describe("<FinishSection />", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("builds form, renders download link, and previous buttons", async () => {
    setRequiredFieldsInSessionStorage();
    mockCreateObjectURL.mockReturnValue("mock-blob-url");
    renderFunction();

    expect(screen.getByRole("link", { name: "Previous" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Next" })).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Download your forms")).toBeInTheDocument();
    });

    const downloadLink = screen.getByRole("link", { name: "Download your forms" });
    expect(downloadLink).toHaveAttribute("href", "mock-blob-url");
    expect(downloadLink).toHaveAttribute("download", "filled_forms.zip");
  });

  it("shows a message if not all required fields have been filled", async () => {
    setRequiredFieldsInSessionStorage();
    window.sessionStorage.removeItem("dateOfBirthDay");
    renderFunction();
    expect(
      screen.getByText(
        "Not all required fields have been filled out. Please fill all required fields.",
      ),
    ).toBeInTheDocument();
  });
});
