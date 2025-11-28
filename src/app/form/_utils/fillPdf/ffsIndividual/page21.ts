import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import { formatDate } from "@/app/form/_utils/fillPdf/formatters";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 21 - disclosure of ownership and control interest statement
export interface PdfFfsIndividualPage21 {
  fd452ownershiphealthcareprovideryes: boolean;
  fd452ownershiphealthcareproviderno: boolean;
  fd452healthcareproviderownershipprovidernumnpiline1: string;
  fd452healthcareproviderownershipnameandtitleline1: string;
  fd452healthcareproviderownershipownershipcontrolpercentline1: string;
  fd452healthcareproviderownershipnameaddressline1: string;
  fd452healthcareproviderownershipprovidernumnpiline2: string;
  fd452healthcareproviderownershipnameandtitleline2: string;
  fd452healthcareproviderownershipownershipcontrolpercentline2: string;
  fd452healthcareproviderownershipnameaddressline2: string;
  fd452healthcareproviderownershipprovidernumnpiline3: string;
  fd452healthcareproviderownershipnameandtitleline3: string;
  fd452healthcareproviderownershipownershipcontrolpercentline3: string;
  fd452healthcareproviderownershipnameaddressline3: string;
  fd452healthcareproviderownershipprovidernumnpiline4: string;
  fd452healthcareproviderownershipnameandtitleline4: string;
  fd452healthcareproviderownershipownershipcontrolpercentline4: string;
  fd452healthcareproviderownershipnameaddressline4: string;
  fd452ownershipchangeyes: boolean;
  fd452ownershipchangeno: boolean;
  fd452ownershipchangedate: string;
  fd452ownershipchangeyesdescribe: string;
  fd452ownershipchangewithinyearyes: boolean;
  fd452ownershipchangewithinyearno: boolean;
  fd452ownershipchangewithinyeardate: string;
  fd452ownershipchangewithinyearyesdescribe: string;
  fd452filedbankruptcypastsevenyearsyes: boolean;
  fd452filedbankruptcypastsevenyearsno: boolean;
  fd452filedbankruptcypastsevenyearsdate: string;
  fd452filedbankruptcywithinyearyes: boolean;
  fd452filedbankruptcywithinyearno: boolean;
  fd452filedbankruptcywithinyeardate: string;
}

const getPastBankruptcyFields = (formData: FormData) => {
  if (formData.hasFiledBankruptcy === true) {
    if (formData.pastBankruptcyDate === null) {
      throw new UnexpectedFormDataError(
        `hasFiledBankruptcy true, but pastBankruptcyDate is ${formData.pastBankruptcyDate}.`,
      );
    }
    return {
      fd452filedbankruptcypastsevenyearsyes: true,
      fd452filedbankruptcypastsevenyearsdate: formatDate(formData.pastBankruptcyDate),
    };
  }
  return {
    fd452filedbankruptcypastsevenyearsno: true,
  };
};

const getFutureBankruptcyFields = (formData: FormData) => {
  if (formData.mightFileBankruptcy === true) {
    if (formData.futureBankruptcyDate === null) {
      throw new UnexpectedFormDataError(
        `mightFileBankruptcy true, but futureBankruptcyDate is ${formData.futureBankruptcyDate}.`,
      );
    }
    return {
      fd452filedbankruptcywithinyearyes: true,
      fd452filedbankruptcywithinyeardate: formatDate(formData.futureBankruptcyDate),
    };
  }
  return {
    fd452filedbankruptcywithinyearno: true,
  };
};

export const getPage21Fields = (formData: FormData): Partial<PdfFfsIndividualPage21> => {
  if (formData.isSupportedSoleProprietor !== true) {
    throw new UnexpectedFormDataError(
      `Expected isSupportedSoleProprietor to be true, is instead ${formData.isSupportedSoleProprietor}.`,
    );
  }

  return {
    fd452ownershiphealthcareproviderno: true,
    fd452ownershipchangeno: true,
    fd452ownershipchangewithinyearno: true,
    ...getPastBankruptcyFields(formData),
    ...getFutureBankruptcyFields(formData),
  };
};
