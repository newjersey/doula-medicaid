import { type FormData } from "@form/_utils/fillPdf/form";

export const formatNaIfBlank = (value: string | null) => {
  return value === null || value.trim() === "" ? "N/A" : value;
};

export const formatName = (formData: FormData): string => {
  if (formData.middleName) {
    return `${formData.firstName} ${formData.middleName} ${formData.lastName}`;
  }
  return `${formData.firstName} ${formData.lastName}`;
};

export const formatDateOfBirth = (formData: FormData): string => {
  return formData.dateOfBirth.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
