import { formatAddressLine3, formatName } from "@/app/form/_utils/fillPdf/formatters";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 12 - request for paper updates
export interface PdfFfsIndividualPage12 {
  "fd455aREQPAPER_Provider Name": string;
  "fd455aREQPAPER_Provider Number": string;
  "fd455aREQPAPER_Contact Name": string;
  "fd455aREQPAPER_Telephone Number": string;
  "fd455aFAX Number": string;
  "fd455aREQPAPER_Mail To Address 1": string;
  "fd455aREQPAPER_Mail To Address 2": string;
  "fd455aREQPAPER_Mail To Address 3": string;
  fd455aREQPAPER_Signature: string;
  fd455aREQPAPER_Date1_af_date: string;
}

export const getPage12Fields = (formData: FormData): Partial<PdfFfsIndividualPage12> => {
  return {
    "fd455aREQPAPER_Provider Name": formatName(formData),
    "fd455aREQPAPER_Provider Number": formData.npiNumber ?? "",
    "fd455aREQPAPER_Telephone Number": formData.phoneNumber ?? "",
    "fd455aREQPAPER_Mail To Address 1": formData.streetAddress1 ?? "",
    "fd455aREQPAPER_Mail To Address 2": formData.streetAddress2 ?? "",
    "fd455aREQPAPER_Mail To Address 3": formatAddressLine3(formData),
  };
};
