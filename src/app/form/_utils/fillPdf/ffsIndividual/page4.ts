import { UnexpectedFormDataError } from "@/app/form/_utils/fillPdf/ffsIndividual/errors";
import { formatDate, formatName } from "@/app/form/_utils/fillPdf/formatters";
import { StateApprovedTraining } from "@/app/form/_utils/inputFields/stateApprovedTraining";
import { type FormData } from "@form/_utils/fillPdf/form";

// Page 4 - doula qualifications form
export interface PdfFfsIndividualPage4 {
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

export const getPage4Fields = (formData: FormData): Partial<PdfFfsIndividualPage4> => {
  let trainingProgramName: string;
  if (formData.stateApprovedTraining === StateApprovedTraining.NONE) {
    if (formData.nameOfTrainingOrganization === null) {
      throw new UnexpectedFormDataError(
        "stateApprovedTraining had value none of these, but no training organization was provided.",
      );
    }
    trainingProgramName = formData.nameOfTrainingOrganization;
  } else {
    trainingProgramName = formData.stateApprovedTraining;
  }

  return {
    fd427dateofbirthDate1_af_date: formatDate(formData.dateOfBirth),
    fd427LegalName: formatName(formData),
    fd427SocialSecurityNumber: formData.socialSecurityNumber,
    fd427TrainingProgramName: trainingProgramName,
    fd427TrainingProgramContact: `${formData.instructorFirstName} ${formData.instructorLastName}`,
    "fd427trainingprogramcontanctE-mailAddress": formData.instructorEmail,
    fd427trainingprogramcontactTelephoneNo: formData.instructorPhoneNumber ?? "",
    fd427trainingsiteStreetaddress: formData.isDoulaTrainingInPerson
      ? `${formData.trainingStreetAddress1}${formData.trainingStreetAddress2 ? ` ${formData.trainingStreetAddress2}` : ""}`
      : "Virtual",
    fd427trainingsiteCity: formData.trainingCity ?? "",
    fd427trainingsiteState: formData.trainingState ?? "",
    fd427trainingsiteZip: formData.trainingZip ?? "",
    fd427currentprofessionalliabilityinsurancecarrierPeriodofCoverage: `${formatDate(formData.insuranceStartDate)} - ${formatDate(formData.insuranceEndDate)}`,
    fd427currentprofessionalliabilityinsurancecarrierAmountofCoveragePerOccurrence:
      formData.insuranceOccurenceAmount,
    fd427currentprofessionalliabilityinsurancecarrierAmountofCoveragePerAggregate:
      formData.insuranceAggregateAmount,
    fd427NameofCurrentProfessionalLiabilityInsuranceCarrier: formData.insuranceCarrierName,
    fd427currentprofessionalliabilityinsurancecarrierStreetaddress: `${formData.insuranceStreetAddress1}${formData.insuranceStreetAddress2 ? ` ${formData.insuranceStreetAddress2}` : ""}`,
    fd427currentprofessionalliabilityinsurancecarriercity: formData.insuranceCity,
    fd427currentprofessionalliabilityinsurancecarrierstate: formData.insuranceState,
    fd427currentprofessionalliabilityinsurancecarrierzip: formData.insuranceZip,
    fd427currentprofessionalliabilityinsurancecarrierpolicyno: formData.insurancePolicyNumber,
  };
};
