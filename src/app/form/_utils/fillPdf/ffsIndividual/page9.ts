import { mapYesNoExplainYesFields } from "@/app/form/_utils/fillPdf/mappers";
import { type FormData, type FormDataWithLegal } from "@form/_utils/fillPdf/form";

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

export const getPage9Fields = (formData: FormData): Partial<PdfFfsIndividualPage9> => {
  if (process.env.NEXT_PUBLIC_FLAG_LEGAL === "1") {
    const formDataWithLegal = formData as FormDataWithLegal;

    // Question 1
    const medicaidProviderFields = mapYesNoExplainYesFields<PdfFfsIndividualPage9>(
      formDataWithLegal.hasProvidedMedicaidServices,
      formDataWithLegal.medicaidProviderExplanation,
      {
        yesPdfKey: "fd425approvedprovideryes",
        noPdfKey: "fd425approvedproviderno",
        yesExplanationPdfKey: "fd425approvedprovideryesexplaination",
      },
    );

    // Question 2
    const licenseSuspendedFields = mapYesNoExplainYesFields<PdfFfsIndividualPage9>(
      formDataWithLegal.hadLicenseSuspended,
      formDataWithLegal.licenseSuspendedExplanation,
      {
        yesPdfKey: "fd425licensesuspensionyes",
        noPdfKey: "fd425licensesuspensionno",
        yesExplanationPdfKey: "fd425licensesuspensionyesexplaination",
      },
    );

    // Question 3
    const crimeChargeFields = mapYesNoExplainYesFields<PdfFfsIndividualPage9>(
      formDataWithLegal.hasCrimeCharge,
      formDataWithLegal.crimeChargeExplanation,
      {
        yesPdfKey: "fd425indictedyes",
        noPdfKey: "fd425indictedno",
        yesExplanationPdfKey: "fd425indictedyesexplaination",
      },
    );

    // Question 4
    const disqualificationsFields = mapYesNoExplainYesFields<PdfFfsIndividualPage9>(
      formDataWithLegal.hasDisqualification,
      formDataWithLegal.disqualificationExplanation,
      {
        yesPdfKey: "fd425programsuspensionsyes",
        noPdfKey: "fd425programsuspensionsno",
        yesExplanationPdfKey: "fd425programsuspensionsyesexplaination",
      },
    );

    // Question 5
    const healthProgramCompanyFields = mapYesNoExplainYesFields<PdfFfsIndividualPage9>(
      formDataWithLegal.hasCompanyInvolvement,
      formDataWithLegal.companyInvolvementExplanation,
      {
        yesPdfKey: "fd425partnershipyes",
        noPdfKey: "fd425partnershipno",
        yesExplanationPdfKey: "fd425partnershipyesexplaination",
      },
    );

    // Question 6
    const njEmploymentFields = mapYesNoExplainYesFields<PdfFfsIndividualPage9>(
      formDataWithLegal.isEmployedByNj,
      formDataWithLegal.employedByNjExplanation,
      {
        yesPdfKey: "fd425employedbystateofnjyes",
        noPdfKey: "fd425employedbystateofnjno",
        yesExplanationPdfKey: "fd425employedbystateofnjyesexplaination",
      },
    );

    return {
      ...medicaidProviderFields,
      ...crimeChargeFields,
      ...licenseSuspendedFields,
      ...disqualificationsFields,
      ...healthProgramCompanyFields,
      ...njEmploymentFields,
    };
  }

  return {};
};
