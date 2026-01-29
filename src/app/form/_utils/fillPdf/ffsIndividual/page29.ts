import { formatName } from "@/app/form/_utils/fillPdf/formatters";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 29 - Agreement of Understanding
export interface PdfFfsIndividualPage29 {
  AgreementofUnderstandingsignature: string;
  AgreementofUnderstandingprintname: string;
  AgreementofUnderstandingdate: string;
}

export const getPage29Fields = (formData: FormData): Partial<PdfFfsIndividualPage29> => {
  return {
    AgreementofUnderstandingprintname: formatName(formData),
  };
};
