import { DOULA_TITLE } from "@/app/form/_utils/fillPdf/doulaTitle";
import { formatName } from "@/app/form/_utils/fillPdf/formatters";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 24 - CERTIFICATION
export interface PdfFfsIndividualPage24 {
  fd452nameofauthorizedrepresentative: string;
  fd452titleofnameofauthorizedrepresentative: string;
  fd452signatureofnameofauthorizedrepresentative: string;
  fd452dateofsignatureofnameofauthorizedrepresentative_af_date: string;
}

export const getPage24Fields = (formData: FormData): Partial<PdfFfsIndividualPage24> => {
  return {
    fd452nameofauthorizedrepresentative: formatName(formData),
    fd452titleofnameofauthorizedrepresentative: DOULA_TITLE,
  };
};
