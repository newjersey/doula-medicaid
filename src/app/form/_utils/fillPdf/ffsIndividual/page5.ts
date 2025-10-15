import { formatName } from "@/app/form/_utils/fillPdf/formatters";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 5 - signature authorization form
export interface PdfFfsIndividualPage5 {
  fd444Providername: string;
  fd444providerNPINumber: string;
  fd444authorizationname1: string;
  fd444authorizationsignaturename1: string;
  fd444authorizationname2: string;
  fd444authorizationsignaturename2: string;
  fd444authorizationname3: string;
  fd444authorizationsignaturename3: string;
  fd444authorizationname4: string;
  fd444authorizationsugnaturename4: string;
  fd444authorizationname5: string;
  fd444authorizationsignaturename5: string;
}

export const getPage5Fields = (formData: FormData): Partial<PdfFfsIndividualPage5> => {
  return {
    fd444Providername: formatName(formData),
    fd444providerNPINumber: formData.npiNumber,
  };
};
