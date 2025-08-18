import { type FormData, fillForm } from "@form/_utils/fillPdf/form";
import { formatDateOfBirth } from "@form/_utils/fillPdf/formatters";
import { DisclosingEntity } from "@form/_utils/inputFields/enums";

export const FFS_INDIVIDUAL_PDF_NAME = "ffs_individual_filled.pdf";
export const FFS_INDIVIDUAL_PDF_PATH = "/pdf/ffs_individual.pdf";

export interface PDFData {
  [key: string]: string | boolean;
}

export const mapFfsIndividualFields = (formData: FormData): PDFData => {
  const fieldsToFill: PDFData = {
    ...getPage3Fields(formData),
    ...getPage5Fields(formData),
    ...getPage7Fields(formData),
    ...getPage12Fields(formData),
    ...getPage16Fields(formData),
  };

  return fieldsToFill;
};

export const fillFfsIndividualForm = (formData: FormData) => {
  return fillForm(
    mapFfsIndividualFields(formData),
    FFS_INDIVIDUAL_PDF_PATH,
    FFS_INDIVIDUAL_PDF_NAME,
  );
};

const getPage3Fields = (formData: FormData): PDFData => {
  // Page 3 - doula qualifications form
  return {
    fd427dateofbirthDate1_af_date: formatDateOfBirth(formData.dateOfBirth),
    fd427LegalName: formatName(formData),
    fd427SocialSecurityNumber: formData.socialSecurityNumber || "",
    fd427trainingsiteStreetaddress: `${formData.trainingStreetAddress1}${formData.trainingStreetAddress2 ? ` ${formData.trainingStreetAddress2}` : ""}`,
    fd427trainingsiteCity: formData.trainingCity || "",
    fd427trainingsiteState: formData.trainingState || "",
    fd427trainingsiteZip: formData.trainingZip || "",
  };
};

const getPage5Fields = (formData: FormData): PDFData => {
  // Page 5 - authorization agreement for automated deposits of state payments
  return {
    fd443telephoneno: formData.phoneNumber ?? "",
    fd443npino: formData.npiNumber ?? "",
    fd443paytoaddressline1: formData.billingStreetAddress1 ?? "",
    fd443paytoaddressline2: formData.billingStreetAddress2 ?? "",
    fd443paytoaddressline3: formatBillingAddressLine3(formData),
  };
};

const getPage7Fields = (formData: FormData): PDFData => {
  // Page 7 - individual doula provider application section I provider identification
  return {
    fd425legalname: formatName(formData),
    fd452dobfdate_af_date: formatDateOfBirth(formData.dateOfBirth),
    fd425npinumber: formData.npiNumber ?? "",
    fd425telephoneno: formData.phoneNumber ?? "",
    fd425emailaddress: formData.email ?? "",
    fd425socialsecuritynumber: formData.socialSecurityNumber ?? "",

    fd425mailtoaddressstreet: `${formData.streetAddress1}${formData.streetAddress2 ? ` ${formData.streetAddress2}` : ""}`,
    fd425mailtoaddressstate: formData.state ?? "",
    fd425mailtoaddresscity: formData.city ?? "",
    fd425mailtoaddresszip: formData.zip ?? "",

    fd425paytoaddressstreet: `${formData.billingStreetAddress1}${formData.billingStreetAddress2 ? ` ${formData.billingStreetAddress2}` : ""}`,
    fd425paytoaddresscity: formData.billingCity ?? "",
    fd425paytoaddressstate: formData.billingState ?? "",
    fd425paytoaddresszip: formData.billingZip ?? "",
  };
};

const getPage12Fields = (formData: FormData): PDFData => {
  // Page 12 - request for paper updates
  return {
    "fd455aREQPAPER_Provider Name": formatName(formData),
    "fd455aREQPAPER_Provider Number": formData.npiNumber ?? "",
    "fd455aREQPAPER_Telephone Number": formData.phoneNumber ?? "",
    "fd455aREQPAPER_Mail To Address 1": formData.streetAddress1 ?? "",
    "fd455aREQPAPER_Mail To Address 2": formData.streetAddress2 ?? "",
    "fd455aREQPAPER_Mail To Address 3": formatAddressLine3(formData),
  };
};

const getPage16Fields = (formData: FormData): PDFData => {
  // Page 16 - disclosing entity sole proprietorship
  if (formData.natureOfDisclosingEntity == DisclosingEntity.SoleProprietorship) {
    const soleProprietorshipFields = {
      "fd452disclosingentitySole Proprietorship": true,
      fd452nameofdisclosingentity: formatName(formData),
      fd452telephonenumber: formData.phoneNumber ?? "",
      fd452providernumbandornpi: formData.npiNumber ?? "",
      fd452einorothertaxidnumber: formData.socialSecurityNumber ?? "",
    };

    if (formData.hasSameBusinessAddress === true) {
      return {
        ...soleProprietorshipFields,
        fd452businessstreetline1: formData.streetAddress1 || "",
        fd452businessstreetline2: formData.streetAddress2 || "",
        fd452businessstreetline3: formatAddressLine3(formData),
      };
    } else if (formData.hasSameBusinessAddress === false) {
      return {
        ...soleProprietorshipFields,
        fd452businessstreetline1: formData.businessStreetAddress1 || "",
        fd452businessstreetline2: formData.businessStreetAddress2 || "",
        fd452businessstreetline3: formatBusinessAddressLine3(formData),
      };
    }
  }

  return {};
};

const formatAddressLine3 = (formData: FormData): string => {
  return `${formData.city}, ${formData.state} ${formData.zip}`;
};

const formatBusinessAddressLine3 = (formData: FormData): string => {
  return `${formData.businessCity}, ${formData.businessState} ${formData.businessZip}`;
};

const formatBillingAddressLine3 = (formData: FormData): string => {
  return `${formData.billingCity}, ${formData.billingState} ${formData.billingZip}`;
};

const formatName = (formData: FormData): string => {
  if (!formData.firstName || !formData.lastName) {
    throw new Error("First name and last name are required to fill the name field.");
  }

  if (formData.middleName) {
    return `${formData.firstName} ${formData.middleName} ${formData.lastName}`;
  }

  return `${formData.firstName} ${formData.lastName}`;
};
