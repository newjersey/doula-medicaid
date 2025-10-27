import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import {
  formatName,
  formatNumericStringAsIndividualFields,
} from "@/app/form/_utils/fillPdf/formatters";
import { formatAddressLine3 } from "@/app/form/_utils/formatters";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 26 - W-9 Request for Taxpayer Identification Number and Certification
export interface PdfFfsIndividualPage26 {
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
  "W9_List account numbers here optional": string;
  "W9_Social security number1": string;
  "W9_Social security number2": string;
  "W9_Social security number3": string;
  "W9_Social security number4": string;
  "W9_Social security number5": string;
  "W9_Social security number6": string;
  "W9_Social security number7": string;
  "W9_Social security number8": string;
  "W9_Social security number9": string;
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

const fontSize10 = { fontSize: 10 };

export const pdfFfsIndividualPage26FieldOptions = {
  "W9_Social security number1": fontSize10,
  "W9_Social security number2": fontSize10,
  "W9_Social security number3": fontSize10,
  "W9_Social security number4": fontSize10,
  "W9_Social security number5": fontSize10,
  "W9_Social security number6": fontSize10,
  "W9_Social security number7": fontSize10,
  "W9_Social security number8": fontSize10,
  "W9_Social security number9": fontSize10,
  W9_EIN1: fontSize10,
  W9_EIN2: fontSize10,
  W9_EIN3: fontSize10,
  W9_EIN4: fontSize10,
  W9_EIN5: fontSize10,
  W9_EIN6: fontSize10,
  W9_EIN7: fontSize10,
  W9_EIN8: fontSize10,
  W9_EIN9: fontSize10,
};

const getTaxNumberFields = (formData: FormData) => {
  const ssnKeys = [
    "W9_Social security number1",
    "W9_Social security number2",
    "W9_Social security number3",
    "W9_Social security number4",
    "W9_Social security number5",
    "W9_Social security number6",
    "W9_Social security number7",
    "W9_Social security number8",
    "W9_Social security number9",
  ];
  return formatNumericStringAsIndividualFields(
    formData.socialSecurityNumber.replaceAll("-", ""),
    ssnKeys,
  );
};

export const getPage26Fields = (formData: FormData): Partial<PdfFfsIndividualPage26> => {
  if (formData.isSupportedSoleProprietor === true) {
    return {
      "W9_Name See Specific Instructions on page 2": formatName(formData),
      "W9_IndividualSole proprietor": true,
      "W9_Address number street and apt or suite no": `${formData.businessStreetAddress1}${formData.businessStreetAddress2 ? ` ${formData.businessStreetAddress2}` : ""}`,
      "W9_City state and ZIP code": formatAddressLine3(
        formData.businessCity,
        formData.businessState,
        formData.businessZip,
      ),
      ...getTaxNumberFields(formData),
    };
  }

  throw new UnexpectedFormDataError(
    `Expected isSupportedSoleProprietor to be true, is instead ${formData.isSupportedSoleProprietor}.`,
  );
};
