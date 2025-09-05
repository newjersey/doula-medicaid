import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 17 - disclosure of ownership and control interest statement
export interface PdfFfsIndividualPage17 {
  fd452affliatedprevious12monthsyes: boolean;
  fd452affliatedprevious12monthsno: boolean;
  fd452ownershipinterestnameline1: string;
  fd452ownershipinterestDateofBirthline1: string;
  fd452ownershipinterestcontrolpercentline1: string;
  fd452ownershipinterestssnortaxidline1: string;
  fd452ownershipinterestaddressline1: string;
  fd452ownershipinterestnpiline1: string;
  fd452ownershipinterestnameline2: string;
  fd452ownershipinterestDateofBirthline2: string;
  fd452ownershipinterestcontrolpercentline2: string;
  fd452ownershipinterestssnortaxidline2: string;
  fd452ownershipinterestaddressline2: string;
  fd452ownershipinterestnpiline2: string;
  fd452ownershipinterestnameline3: string;
  fd452ownershipinterestDateofBirthline3: string;
  fd452ownershipinterestcontrolpercentline3: string;
  fd452ownershipinterestssnortaxidline3: string;
  fd452ownershipinterestaddressline3: string;
  fd452ownershipinterestnpiline3: string;
  fd452ownerreleationshipline1: string;
  fd452ownerreleationshipline2: string;
  fd452ownerreleationshipline3: string;
  fd452ownerreleationshipline4: string;
  fd452ownerreleationshipsubcontractorline1: string;
  fd452ownerreleationshipsubcontractorline2: string;
  fd452ownerreleationshipsubcontractorline3: string;
  fd452ownerreleationshipsubcontractorline4: string;
}

export const getPage17Fields = (formData: FormData): Partial<PdfFfsIndividualPage17> => {
  if (formData.isSupportedSoleProprietor === true) {
    return {
      fd452affliatedprevious12monthsno: true,
      fd452ownerreleationshipline1: "N/A",
      fd452ownerreleationshipsubcontractorline1: "N/A",
    };
  }
  throw new UnexpectedFormDataError(
    `Expected isSupportedSoleProprietor to be true, is instead ${formData.isSupportedSoleProprietor}.`,
  );
};
