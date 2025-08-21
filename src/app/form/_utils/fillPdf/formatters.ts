import { type FormData } from "@form/_utils/fillPdf/form";

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

export const formatAddressLine3 = (formData: FormData): string => {
  return `${formData.city}, ${formData.state} ${formData.zip}`;
};

export const formatBusinessAddressLine3 = (formData: FormData): string => {
  return `${formData.businessCity}, ${formData.businessState} ${formData.businessZip}`;
};

export const formatBillingAddressLine3 = (formData: FormData): string => {
  return `${formData.billingCity}, ${formData.billingState} ${formData.billingZip}`;
};
