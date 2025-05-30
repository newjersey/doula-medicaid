import { FormData, fillForm, parseForm } from "./form";

export const AETNA_PDF_NAME = "aetna_filled.pdf";
export const AETNA_PDF_PATH = "/pdf/aetna.pdf";

export const AETNA_FIELD_MAP: Partial<Record<keyof FormData, string>> = {
  dob: "Text2",
  firstName: "Text3",
  lastName: "Text1",
};

export const fillAetnaForm = (formData: FormData) => {
  return fillForm(formData, AETNA_PDF_PATH, AETNA_FIELD_MAP, AETNA_PDF_NAME);
};

export const parseAetnaForm = (file: File) => {
  return parseForm(file, AETNA_FIELD_MAP);
};
