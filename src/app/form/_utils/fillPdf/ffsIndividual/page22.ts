import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 22 - disclosure of ownership and control interest statement
export interface PdfFfsIndividualPage22 {
  fd452increasedbedcapacityyyes: boolean;
  fd452increasedbedcapacityno: boolean;
  fd452increasedbedcapacityyear: string;
  fd452currentnumberofbeds: string;
  fd452priornumberofbeds: string;
  fd452disclosableeventyyes: boolean;
  fd452disclosableeventno: boolean;
  fd452disclosabledateline1: string;
  fd452disclosableindividualentityinvolvedline1: string;
  fd452disclosablenpiline1: string;
  fd452disclosableeventline1: string;
  fd452disclosabledebtowedline1: string;
  fd452disclosableresolutionline1: string;
  fd452disclosabledateline2: string;
  fd452disclosableindividualentityinvolvedline2: string;
  fd452disclosablenpiline2: string;
  fd452disclosableeventline2: string;
  fd452disclosabledebtowedline2: string;
  fd452disclosableresolutionline2: string;
  fd452disclosabledateline3: string;
  fd452disclosableindividualentityinvolvedline3: string;
  fd452disclosablenpiline3: string;
  fd452disclosableeventline3: string;
  fd452disclosabledebtowedline3: string;
  fd452disclosableresolutionline3: string;
  fd452disclosabledateline4: string;
  fd452disclosableindividualentityinvolvedline4: string;
  fd452disclosablenpiline4: string;
  fd452disclosableeventline4: string;
  fd452disclosabledebtowedline4: string;
  fd452disclosableresolutionline4: string;
  fd452disclosabledateline5: string;
  fd452disclosableindividualentityinvolvedline5: string;
  fd452disclosablenpiline5: string;
  fd452disclosableeventline5: string;
  fd452disclosabledebtowedline5: string;
  fd452disclosableresolutionline5: string;
}

export const getPage22Fields = (formData: FormData): Partial<PdfFfsIndividualPage22> => {
  if (formData.isSupportedSoleProprietor === true) {
    return {
      fd452increasedbedcapacityno: true,
      fd452disclosableeventyyes: formData.hasDisclosableEvent,
      fd452disclosableeventno: !formData.hasDisclosableEvent,
    };
  } else {
    throw new UnexpectedFormDataError(
      `Expected isSupportedSoleProprietor to be true, is instead ${formData.isSupportedSoleProprietor}.`,
    );
  }
};
