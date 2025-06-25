import { type FormData, fillForm } from "./form";
import { formatDateOfBirth } from "./formatters";

export const FFS_INDIVIDUAL_PDF_NAME = "ffs_individual_filled.pdf";
export const FFS_INDIVIDUAL_PDF_PATH = "/pdf/ffs_individual.pdf";

export const mapFfsIndividualFields = (formData: FormData): { [key: string]: string } => {
  const legalName = `${formData.firstName}${formData.middleName ? " " + formData.middleName : ""} ${formData.lastName}`;
  const dateOfBirth = formatDateOfBirth(formData.dateOfBirth);

  return {
    // Page 3 - doula qualifications form
    fd427LegalName: legalName,
    fd427dateofbirthDate1_af_date: dateOfBirth,

    // Page 5 - authorization agreement for automated deposits of state payments
    fd443telephoneno: formData.phoneNumber || "",
    fd443npino: formData.npiNumber || "",

    // Page 7 - individual doula provider application section I provider identification
    fd425legalname: legalName,
    fd452dobfdate_af_date: dateOfBirth,
    fd425npinumber: formData.npiNumber || "",
    fd425telephoneno: formData.phoneNumber || "",
    fd425emailaddress: formData.email || "",

    fd425mailtoaddressstreet: `${formData.streetAddress1}${formData.streetAddress2 ? " " + formData.streetAddress2 : ""}`,
    fd425mailtoaddresscity: formData.city || "",
    fd425mailtoaddressstate: formData.state || "", // input validation not yet implemented
    fd425mailtoaddresszip: formData.zip || "",

    // Page 12 - request for paper updates
    "fd455aREQPAPER_Provider Name": legalName,
    "fd455aREQPAPER_Provider Number": formData.npiNumber || "",
    "fd455aREQPAPER_Telephone Number": formData.phoneNumber || "",
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
