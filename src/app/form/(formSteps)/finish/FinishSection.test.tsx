import { setRequiredFieldsInSessionStorage } from "@/app/form/_utils/fillPdf/testUtils/formData";
import FinishSection from "@form/(formSteps)/finish/page";
import { RouterPathnameProvider } from "@form/_utils/testUtils/RouterPathnameProvider";
import { jest } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

jest.mock("@form/_utils/fillPdf/form", () => ({
  ...(jest.requireActual("@form/_utils/fillPdf/form") as object),
  fillForm: jest.fn((_fieldsToFill, _pdfPath, filename: string) => {
    return { filename, bytes: new Uint8Array(0) };
  }),
}));

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

describe("<FinishSection />", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("builds form, renders download link, and previous buttons", async () => {
    setRequiredFieldsInSessionStorage();
    mockCreateObjectURL.mockReturnValue("mock-blob-url");
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

  it("shows a message if not all required fields have been filled", async () => {
    setRequiredFieldsInSessionStorage();
    window.sessionStorage.removeItem("dateOfBirthDay");
    renderWithRouter();
    expect(
      screen.getByText(
        "Not all required fields have been filled out. Please fill all required fields.",
      ),
    ).toBeInTheDocument();
  });
});
