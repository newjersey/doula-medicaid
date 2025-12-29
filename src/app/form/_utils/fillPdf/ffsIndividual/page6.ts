import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import { formatFullAddressThreeFields, formatName } from "@/app/form/_utils/fillPdf/formatters";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 6 - authorization agreement for automated deposits of state payments
export interface PdfFfsIndividualPage6 {
  fd443bankname: string;
  fd443branch: string;
  fd443CITY: string;
  fd443STATE: string;
  fd443zipcode: string;
  fd443banktransitno: string;
  fd443bankacctno: string;
  fd443bankaccount: string;
  fd443providername: string;
  fd443providerno: string;
  fd443telephoneno: string;
  fd443npino: string;
  fd443paytoaddressline1: string;
  fd443paytoaddressline2: string;
  fd443paytoaddressline3: string;
  fd443printedname: string;
  fd443signature: string;
  fd443datefdate_af_date: string;
  fd443jointprintedname: string;
  fd443jointsignature: string;
  fd443jointdatefdate_af_date: string;
}

export const getPage6Fields = (formData: FormData): Partial<PdfFfsIndividualPage6> => {
  const billingAddressLines = formatFullAddressThreeFields(
    formData.billingStreetAddress1,
    formData.billingStreetAddress2,
    formData.billingCity,
    formData.billingState,
    formData.billingZip,
  );

  let jointPrintedNameField = {};
  if (formData.hasJointBankAccount === true) {
    if (formData.secondNameOnJointBankAccount === null) {
      throw new UnexpectedFormDataError(
        "hasJointBankAccount is true, but secondNameOnJointBankAccount was not provided",
      );
    }
    jointPrintedNameField = { fd443jointprintedname: formData.secondNameOnJointBankAccount };
  }

  return {
    fd443bankname: formData.bankName,
    fd443CITY: formData.bankCity,
    fd443STATE: formData.bankState,
    fd443zipcode: formData.bankZip,
    fd443banktransitno: formData.bankRoutingNumber,
    fd443bankacctno: formData.bankAccountNumber,
    fd443bankaccount: formData.nameOnBankAccount,
    fd443telephoneno: formData.phoneNumber ?? "",
    fd443npino: formData.npiNumber ?? "",
    fd443paytoaddressline1: billingAddressLines.line1,
    fd443paytoaddressline2: billingAddressLines.line2,
    fd443paytoaddressline3: billingAddressLines.line3,
    fd443printedname: formatName(formData),
    ...jointPrintedNameField,
  };
};
