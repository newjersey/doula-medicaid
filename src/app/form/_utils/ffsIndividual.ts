import { FormData, fillForm } from "./form";

export const FFS_INDIVIDUAL_PDF_NAME = "ffs_individual_filled.pdf";
export const FFS_INDIVIDUAL_PDF_PATH = "/pdf/ffs_individual.pdf";

export const mapFfsIndividualFields = (formData: FormData): { [key: string]: string } => {
  return {
    fd427dateofbirthDate1_af_date: formData.dob,
    fd427LegalName: `${formData.firstName} ${formData.lastName}`,
  };
};

export const fillFfsIndividualForm = (formData: FormData) => {
  return fillForm(
    mapFfsIndividualFields(formData),
    FFS_INDIVIDUAL_PDF_PATH,
    FFS_INDIVIDUAL_PDF_NAME,
  );
};
