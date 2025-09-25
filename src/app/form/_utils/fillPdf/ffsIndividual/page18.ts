import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import {
  formatDate,
  formatMultilineAddress,
  formatName,
} from "@/app/form/_utils/fillPdf/formatters";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 18 - disclosure of ownership and control interest statement
export interface PdfFfsIndividualPage18 {
  fd452nameofotherentitywithownershipinteresline1: string;
  fd452nameofotherentitywithownershipinteresline2: string;
  fd452nameofotherentitywithownershipinteresline3: string;
  fd452nameofotherentitywithownershipinteresline4: string;
  fd452nameofotherentitywithownershipinteresline5: string;
  fd452managingagentsdateofbirthine1: string;
  fd452managingagentsssnline1: string;
  fd452managingagentsnametitleline1: string;
  fd452managingagentsaddressline1: string;
  fd452fd452managingagentsdateofbirthine2: string;
  fd452managingagentsssnline2: string;
  fd452managingagentsnametitleline2: string;
  fd452managingagentsaddressline2: string;
  fd452managingagentsdateofbirthine3: string;
  fd452managingagentsssnline3: string;
  fd452managingagentsnametitleline3: string;
  fd452managingagentsaddressline3: string;
  fd452fd452managingagentsdateofbirthine4: string;
  fd452managingagentsssnline4: string;
  fd452managingagentsnametitleline4: string;
  fd452managingagentsaddressline4: string;
  fd452managingagentsdateofbirthine5: string;
  fd452managingagentsssnline5: string;
  fd452managingagentsnametitleline5: string;
  fd452managingagentsaddressline5: string;
  fd452businesstransactions25000ormoreline1: string;
  fd452businesstransactions25000ormoreline2: string;
  fd452businesstransactions25000ormoreline3: string;
  fd452businesstransactions25000ormoreline4: string;
  fd452businesstransactions25000ormoreline5: string;
}

export const getPage18Fields = (formData: FormData): Partial<PdfFfsIndividualPage18> => {
  if (formData.isSupportedSoleProprietor === true) {
    return {
      fd452nameofotherentitywithownershipinteresline1: "N/A",
      fd452managingagentsdateofbirthine1: formatDate(formData.dateOfBirth),
      fd452managingagentsssnline1: formData.socialSecurityNumber,
      fd452managingagentsnametitleline1: `${formatName(formData)}, doula`,
      fd452managingagentsaddressline1: formatMultilineAddress(
        formData.businessStreetAddress1,
        formData.businessStreetAddress2,
        formData.businessCity,
        formData.businessState,
        formData.businessZip,
      ),
      fd452businesstransactions25000ormoreline1: "N/A",
    };
  }
  throw new UnexpectedFormDataError(
    `Expected isSupportedSoleProprietor to be true, is instead ${formData.isSupportedSoleProprietor}.`,
  );
};
