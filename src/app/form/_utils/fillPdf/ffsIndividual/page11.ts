import { formatName, formatNameAndDoulaTitle } from "@/app/form/_utils/fillPdf/formatters";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 11 - provider agreement
export interface PdfFfsIndividualPage11 {
  fd62aprovidername: string;
  fd62asignatureofprovider: string;
  fd62asignaturedate_af_date: string;
  fd62aPrintNameTitle: string;
}

export const getPage11Fields = (formData: FormData): Partial<PdfFfsIndividualPage11> => {
  return {
    fd62aprovidername: formatName(formData),
    fd62aPrintNameTitle: formatNameAndDoulaTitle(formData),
  };
};
