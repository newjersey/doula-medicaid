import { type FormData, fillForm } from "@form/_utils/fillPdf/form";
import { formatDateOfBirth } from "@form/_utils/fillPdf/formatters";

export const FIDELIS_PDF_NAME = "fidelis_filled.pdf";
export const FIDELIS_PDF_PATH = "/pdf/fidelis.pdf";

export const FIDELIS_FIELD_MAP: Partial<Record<keyof FormData, string>> = {
  dateOfBirth: "Text3", // on page 7
  firstName: "Text2",
  lastName: "Text1",
};

export const mapFidelisFields = (formData: FormData): { [key: string]: string } => {
  return {
    Text3: formatDateOfBirth(formData),
    Text2: formData.firstName || "",
    Text1: formData.lastName || "",
  };
};

export const fillFidelisForm = (formData: FormData) => {
  return fillForm(mapFidelisFields(formData), FIDELIS_PDF_PATH, FIDELIS_PDF_NAME);
};
