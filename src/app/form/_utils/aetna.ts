import { formatDateOfBirth } from "./ formatters";
import { FormData, fillForm } from "./form";

export const AETNA_PDF_NAME = "aetna_filled.pdf";
export const AETNA_PDF_PATH = "/pdf/aetna.pdf";

export const mapAetnaFields = (formData: FormData): { [key: string]: string } => {
  return {
    Text2: formatDateOfBirth(formData.dateOfBirth),
    Text3: formData.firstName || "",
    Text1: formData.lastName || "",
  };
};

export const fillAetnaForm = (formData: FormData) => {
  return fillForm(mapAetnaFields(formData), AETNA_PDF_PATH, AETNA_PDF_NAME);
};
