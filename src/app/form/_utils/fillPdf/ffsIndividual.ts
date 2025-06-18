import { FormData, fillForm } from "./form";
import { formatDateOfBirth } from "./formatters";

export const FFS_INDIVIDUAL_PDF_NAME = "ffs_individual_filled.pdf";
export const FFS_INDIVIDUAL_PDF_PATH = "/pdf/ffs_individual.pdf";

export const mapFfsIndividualFields = (formData: FormData): { [key: string]: string } => {
  const legalName = `${formData.firstName}${formData.middleName && " " + formData.middleName} ${formData.lastName}`;
  const dateOfBirth = formatDateOfBirth(formData.dateOfBirth);

  return {
    // Page 3
    fd427dateofbirthDate1_af_date: dateOfBirth,
    fd427LegalName: legalName,

    // Page 7
    fd425legalname: legalName,
    fd452dobfdate_af_date: dateOfBirth,

    fd425mailtoaddressstreet: `${formData.streetAddress1}${formData.streetAddress2 && " " + formData.streetAddress2}`,
    fd425mailtoaddressstate: formData.city || "", // input validation not yet implemented
    fd425mailtoaddresscity: formData.state || "",
    fd425mailtoaddresszip: formData.zip || "",

    // Page 12
    "fd455aREQPAPER_Provider Name": legalName,
    "fd455aREQPAPER_Mail To Address 1": formData.streetAddress1 || "",
    "fd455aREQPAPER_Mail To Address 2": formData.streetAddress2 || "",
    "fd455aREQPAPER_Mail To Address 3": `${formData.city}, ${formData.state} ${formData.zip}`,
  };
};

export const fillFfsIndividualForm = (formData: FormData) => {
  return fillForm(
    mapFfsIndividualFields(formData),
    FFS_INDIVIDUAL_PDF_PATH,
    FFS_INDIVIDUAL_PDF_NAME,
  );
};
