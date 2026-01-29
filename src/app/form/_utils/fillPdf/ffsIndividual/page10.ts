import { DOULA_TITLE } from "@/app/form/_utils/fillPdf/doulaTitle";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 10 - PROVIDER CERTIFICATION
export interface PdfFfsIndividualPage10 {
  fd429bsignature: string;
  fd429printnameandtitle: string;
  fd429dateofsignature_af_date: string;
}

export const getPage10Fields = (formData: FormData): Partial<PdfFfsIndividualPage10> => {
  return {
    fd429printnameandtitle: `${formData.firstName} ${formData.lastName}, ${DOULA_TITLE}`, // Deliberately omitting middle name even if present, since the field is short. See README for PDF field overflow notes
  };
};
