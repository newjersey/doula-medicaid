import { type FormData } from "@form/_utils/fillPdf/form";

// Page 9 - SECTION II – PROVIDER IDENTIFICATION
export interface PdfFfsIndividualPage9 {
  fd425approvedprovideryes: boolean;
  fd425approvedproviderno: boolean;
  fd425approvedprovideryesexplaination: string;
  fd425licensesuspensionno: boolean;
  fd425licensesuspensionyes: boolean;
  fd425licensesuspensionyesexplaination: string;
  fd425indictedyes: boolean;
  fd425indictedno: boolean;
  fd425indictedyesexplaination: string;
  fd425programsuspensionsyes: boolean;
  fd425programsuspensionsno: boolean;
  fd425programsuspensionsyesexplaination: string;
  fd425partnershipyes: boolean;
  fd425partnershipno: boolean;
  fd425partnershipyesexplaination: string;
  fd425employedbystateofnjyes: boolean;
  fd425employedbystateofnjno: boolean;
  fd425employedbystateofnjyesexplaination: string;
  fd425signatureofdoulaprov: string;
  fd425printnamedoulaprov: string;
  fd425titleofdoulaprov: string;
  fd425signaturedateofdoulaprovfdate_af_date: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getPage9Fields = (formData: FormData): Partial<PdfFfsIndividualPage9> => {
  return {};
};
