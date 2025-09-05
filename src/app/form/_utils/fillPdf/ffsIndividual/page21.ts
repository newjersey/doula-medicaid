import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 21 - disclosure of ownership and control interest statement
export interface PdfFfsIndividualPage21 {
  fd452operatedorfiscallymanagedyes: boolean;
  fd452operatedorfiscallymanagedno: boolean;
  fd452operatedorfiscallymanagedyesline1: string;
  fd452operatedorfiscallymanagedyesline2: string;
  fd452operatedorfiscallymanagedyesline3: string;
  fd452operatedorfiscallymanagedyesline4: string;
  fd452operatedorfiscallymanagedyesline5: string;
  fd452operatedorfiscallymanagedyesline6: string;
  fd452changeinmanagingyes: boolean;
  fd452changeinmanagingno: boolean;
  fd452changeinmanagingyesline1: string;
  fd452changeinmanagingyesline2: string;
  fd452changeinmanagingyesline3: string;
  fd452changeinmanagingyesline4: string;
  fd452changeinmanagingyesline5: string;
  fd452changeinmanagingyesline6: string;
  fd452subsidiaryofparentcompanyyes: boolean;
  fd452subsidiaryofparentcompanyno: boolean;
  fd452subsidiaryofparentcompanyyesline1: string;
  fd452subsidiaryofparentcompanyyesline2: string;
  fd452subsidiaryofparentcompanyyesline3: string;
  fd452subsidiaryofparentcompanyyesline4: string;
  fd452subsidiaryofparentcompanyyesline5: string;
  fd452subsidiaryofparentcompanyyesline6: string;
  fd452affiliatedwithparentcompanyyes: boolean;
  fd452affiliatedwithparentcompanyno: boolean;
  fd452affiliatedwithparentcompanyyesline1: string;
  fd452affiliatedwithparentcompanyyesline2: string;
  fd452affiliatedwithparentcompanyyesline3: string;
  fd452affiliatedwithparentcompanyyesline4: string;
  fd452affiliatedwithparentcompanyyesline5: string;
  fd452affiliatedwithparentcompanyyesline6: string;
}

export const getPage21Fields = (formData: FormData): Partial<PdfFfsIndividualPage21> => {
  if (formData.isSupportedSoleProprietor === true) {
    return {
      fd452operatedorfiscallymanagedno: true,
      fd452changeinmanagingno: true,
      fd452subsidiaryofparentcompanyno: true,
      fd452affiliatedwithparentcompanyno: true,
    };
  }
  throw new UnexpectedFormDataError(
    `Expected isSupportedSoleProprietor to be true, is instead ${formData.isSupportedSoleProprietor}.`,
  );
};
