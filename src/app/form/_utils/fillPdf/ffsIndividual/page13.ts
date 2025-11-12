import { formatFullAddressThreeFields, formatName } from "@/app/form/_utils/fillPdf/formatters";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 13 - request for paper updates
export interface PdfFfsIndividualPage13 {
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

export const getPage13Fields = (formData: FormData): Partial<PdfFfsIndividualPage13> => {
  const address = formatFullAddressThreeFields(
    formData.streetAddress1,
    formData.streetAddress2,
    formData.city,
    formData.state,
    formData.zip,
  );
  return {
    "fd455aREQPAPER_Provider Name": formatName(formData),
    "fd455aREQPAPER_Provider Number": formData.npiNumber ?? "",
    "fd455aREQPAPER_Telephone Number": formData.phoneNumber ?? "",
    "fd455aREQPAPER_Mail To Address 1": address.line1,
    "fd455aREQPAPER_Mail To Address 2": address.line2,
    "fd455aREQPAPER_Mail To Address 3": address.line3,
  };
};
