import { formatDateOfBirth, formatName } from "@/app/form/_utils/fillPdf/formatters";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 7 - individual doula provider application section I provider identification
export interface PdfFfsIndividualPage7 {
  fd425legalname: string;
  fd452dobfdate_af_date: string;
  fd425socialsecuritynumber: string;
  fd452medicareprovnumber: string;
  fd425upinno: string;
  fd425npinumber: string;
  fd425telephoneno: string;
  fd425faxno: string;
  fd425emailaddress: string;
  fd425paytoaddressstreet: string;
  fd425paytoaddresscity: string;
  fd425paytoaddressstate: string;
  fd425paytoaddresszip: string;
  fd425mailtoaddressstreet: string;
  fd425mailtoaddressstate: string;
  fd425mailtoaddresscity: string;
  fd425mailtoaddresszip: string;
  fd425transfercbno: boolean;
  fd425transfercbyes: boolean;
  fd425previousownermedicaidproviderid: string;
  fd425previousownernpi: string;
  fd425previousownertaxid: string;
}

export const getPage7Fields = (formData: FormData): Partial<PdfFfsIndividualPage7> => {
  return {
    fd425legalname: formatName(formData),
    fd452dobfdate_af_date: formatDateOfBirth(formData),
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
