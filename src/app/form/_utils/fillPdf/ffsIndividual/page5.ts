import { formatBillingAddressLine3 } from "@/app/form/_utils/fillPdf/formatters";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 5 - authorization agreement for automated deposits of state payments
export interface PdfFfsIndividualPage5 {
  fd443bankname: string;
  fd443branch: string;
  fd443CITY: string;
  fd443STATE: string;
  fd443zipcode: string;
  fd443banktransitno: string;
  fd443bankacctno: string;
  fd443bankaccount: string;
  fd443providername: string;
  fd443providerno: string;
  fd443telephoneno: string;
  fd443npino: string;
  fd443paytoaddressline1: string;
  fd443paytoaddressline2: string;
  fd443paytoaddressline3: string;
  fd443printedname: string;
  fd443signature: string;
  fd443datefdate_af_date: string;
  fd443jointprintedname: string;
  fd443jointsignature: string;
  fd443jointdatefdate_af_date: string;
}

export const getPage5Fields = (formData: FormData): Partial<PdfFfsIndividualPage5> => {
  return {
    fd443telephoneno: formData.phoneNumber ?? "",
    fd443npino: formData.npiNumber ?? "",
    fd443paytoaddressline1: formData.billingStreetAddress1 ?? "",
    fd443paytoaddressline2: formData.billingStreetAddress2 ?? "",
    fd443paytoaddressline3: formatBillingAddressLine3(formData),
  };
};
