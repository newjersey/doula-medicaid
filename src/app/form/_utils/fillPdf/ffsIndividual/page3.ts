import { formatDateOfBirth, formatName } from "@/app/form/_utils/fillPdf/formatters";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 3 - doula qualifications form

export class UnexpectedFormDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnexpectedFormDataError";
  }
}

export interface PdfFfsIndividualPage3 {
  fd427LegalName: string;
  fd427SocialSecurityNumber: string;
  fd427dateofbirthDate1_af_date: string;
  fd427TrainingProgramName: string;
  fd427TrainingProgramContact: string;
  "fd427trainingprogramcontanctE-mailAddress": string;
  fd427trainingprogramcontactTelephoneNo: string;
  fd427trainingsiteStreetaddress: string;
  fd427trainingsiteCity: string;
  fd427trainingsiteState: string;
  fd427trainingsiteZip: string;
  fd427NameofCurrentProfessionalLiabilityInsuranceCarrier: string;
  fd427currentprofessionalliabilityinsurancecarrierStreetaddress: string;
  fd427currentprofessionalliabilityinsurancecarriercity: string;
  fd427currentprofessionalliabilityinsurancecarrierstate: string;
  fd427currentprofessionalliabilityinsurancecarrierzip: string;
  fd427currentprofessionalliabilityinsurancecarrierpolicyno: string;
  fd427currentprofessionalliabilityinsurancecarrierPeriodofCoverage: string;
  fd427currentprofessionalliabilityinsurancecarrierAmountofCoveragePerOccurrence: string;
  fd427currentprofessionalliabilityinsurancecarrierAmountofCoveragePerAggregate: string;
}

export const getPage3Fields = (formData: FormData): Partial<PdfFfsIndividualPage3> => {
  if (
    formData.stateApprovedTraining === "None of these" &&
    formData.nameOfTrainingOrganization === null
  ) {
    throw new UnexpectedFormDataError(
      "stateApprovedTraining had value none of these, but no training organization was provided.",
    );
  }

  return {
    fd427dateofbirthDate1_af_date: formatDateOfBirth(formData),
    fd427LegalName: formatName(formData),
    fd427SocialSecurityNumber: formData.socialSecurityNumber || "",
    fd427TrainingProgramName:
      formData.stateApprovedTraining === "None of these"
        ? formData.nameOfTrainingOrganization!
        : formData.stateApprovedTraining,
    fd427TrainingProgramContact: `${formData.instructorFirstName!} ${formData.instructorLastName!}`,
    "fd427trainingprogramcontanctE-mailAddress": formData.instructorEmail!,
    fd427trainingprogramcontactTelephoneNo: formData.instructorPhoneNumber!,
    fd427trainingsiteStreetaddress: formData.isDoulaTrainingInPerson!
      ? `${formData.trainingStreetAddress1}${formData.trainingStreetAddress2 ? ` ${formData.trainingStreetAddress2}` : ""}`
      : "Virtual",
    fd427trainingsiteCity: formData.trainingCity ?? "",
    fd427trainingsiteState: formData.trainingState ?? "",
    fd427trainingsiteZip: formData.trainingZip ?? "",
  };
};
