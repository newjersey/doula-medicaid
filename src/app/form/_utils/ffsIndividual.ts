import { FormData, fillForm, parseForm } from "../../proof-of-concept/forms/form";

export const FFS_INDIVIDUAL_PDF_NAME = "ffs_individual_filled.pdf";
export const FFS_INDIVIDUAL_PDF_PATH = "/pdf/ffs_individual.pdf";

export const FFS_INDIVIDUAL_FIELD_MAP: Partial<Record<keyof FormData, string>> = {
  dob: "fd427dateofbirthDate1_af_date",
  firstName: "fd427LegalName",
};

export const fillFfsIndividualForm = (formData: FormData) => {
  return fillForm(
    formData,
    FFS_INDIVIDUAL_PDF_PATH,
    FFS_INDIVIDUAL_FIELD_MAP,
    FFS_INDIVIDUAL_PDF_NAME,
  );
};

export const parseFfsIndividualForm = (file: File) => {
  return parseForm(file, FFS_INDIVIDUAL_FIELD_MAP);
};
