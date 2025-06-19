import { FormData, fillForm } from "./form";
import { formatDateOfBirth } from "./formatters";
import { DisclosingEntity } from "../inputFields/types";

export const FFS_INDIVIDUAL_PDF_NAME = "ffs_individual_filled.pdf";
export const FFS_INDIVIDUAL_PDF_PATH = "/pdf/ffs_individual.pdf";

export interface PDFData {
  [key: string]: string | boolean;
}

export const mapFfsIndividualFields = (formData: FormData): PDFData => {
  const legalName = fillName(formData);
  const dateOfBirth = formatDateOfBirth(formData.dateOfBirth);
  const fieldsToFill = {
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
    "fd455aREQPAPER_Mail To Address 3": constructAddressLine3(formData),
  };

  fillDisclosureOfOwnershipFields(formData, fieldsToFill);
  return fieldsToFill;
};

export const fillFfsIndividualForm = (formData: FormData) => {
  return fillForm(
    mapFfsIndividualFields(formData),
    FFS_INDIVIDUAL_PDF_PATH,
    FFS_INDIVIDUAL_PDF_NAME,
  );
};

function fillDisclosureOfOwnershipFields(formData: FormData, fieldsToFill: PDFData): void {
  if (formData.natureOfDisclosingEntity == DisclosingEntity.SP) {
    //Page 16
    fieldsToFill["fd452disclosingentitySole Proprietorship"] = true;
    fieldsToFill.fd452tradenameanddba = "N/A";
    fieldsToFill.fd452nameofdisclosingentity = fillName(formData);
    fieldsToFill.fd452businessstreetline1 = formData.streetAddress1 || "";
    fieldsToFill.fd452businessstreetline2 = formData.streetAddress2 || "";
    fieldsToFill.fd452businessstreetline3 = constructAddressLine3(formData);
    fieldsToFill.fd452telephonenumber = formData.phoneNumber || "";
    fieldsToFill.fd452providernumbandornpi = formData.npiNumber || "";
    fieldsToFill.fd452einorothertaxidnumber = formData.ssn || "";
  }
}

function constructAddressLine3(formData: FormData): string {
  return `${formData.city}, ${formData.state} ${formData.zip}`;
}

function fillName(formData: FormData): string {
  if (!formData.firstName || !formData.lastName) {
    throw new Error("First name and last name are required to fill the name field.");
  }

  if (formData.middleName) {
    return `${formData.firstName} ${formData.middleName} ${formData.lastName}`;
  }

  return `${formData.firstName} ${formData.lastName}`;
}
