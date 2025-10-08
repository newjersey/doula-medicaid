import { formatName } from "@/app/form/_utils/fillPdf/formatters";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 10 - provider agreement
export interface PdfFfsIndividualPage10 {
  fd62aprovidername: string;
  fd62asignatureofprovider: string;
  fd62asignaturedate_af_date: string;
  fd62aPrintNameTitle: string;
}

export const getPage10Fields = (formData: FormData): Partial<PdfFfsIndividualPage10> => {
  return {
    fd62aprovidername: formatName(formData),
  };
};
