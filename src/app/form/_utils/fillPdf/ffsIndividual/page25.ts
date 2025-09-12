import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 25 - W-9 Request for Taxpayer Identification Number and Certification
export interface PdfFfsIndividualPage25 {
  "W9_Name See Specific Instructions on page 2": string;
  "W9_Business name if different from above See Specific Instructions on page 2": string;
  "W9_IndividualSole proprietor": boolean;
  W9_Corporation: boolean;
  W9_Partnership: boolean;
  W9_Other: boolean;
  W9_OtherText: string;
  "W9_Address number street and apt or suite no": string;
  "W9_City state and ZIP code": string;
  "W9_Requesters name and address optional": string;
  "W9_Social security number9": string;
  "W9_List account numbers here optional": string;
  "W9_Social security number1": string;
  "W9_Social security number2": string;
  "W9_Social security number3": string;
  "W9_Social security number4": string;
  "W9_Social security number5": string;
  "W9_Social security number6": string;
  "W9_Social security number7": string;
  "W9_Social security number8": string;
  W9_EIN1: string;
  W9_EIN2: string;
  W9_EIN3: string;
  W9_EIN4: string;
  W9_EIN5: string;
  W9_EIN6: string;
  W9_EIN7: string;
  W9_EIN8: string;
  W9_EIN9: string;
  W9_exemptwithholding: string;
  W9_signtuareofusperson: string;
  W9_PartIIIDate3_af_date: string;
}

export const getPage25Fields = (formData: FormData): Partial<PdfFfsIndividualPage25> => {
  if (formData.isSupportedSoleProprietor === true) {
    return {
      "W9_IndividualSole proprietor": true,
    };
  }
  throw new UnexpectedFormDataError(
    `Expected isSupportedSoleProprietor to be true, is instead ${formData.isSupportedSoleProprietor}.`,
  );
};
