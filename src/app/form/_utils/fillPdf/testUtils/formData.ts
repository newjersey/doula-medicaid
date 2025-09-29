import type { BusinessDetailsFormData } from "@/app/form/(formSteps)/business-details/BusinessDetailsData";
import type { InsuranceFormData } from "@/app/form/(formSteps)/insurance/InsuranceData";
import type { PersonalDetailsFormData } from "@/app/form/(formSteps)/personal-details/PersonalDetailsData";
import type { ScreeningFormData } from "@/app/form/(formSteps)/screening/ScreeningData";
import type { TrainingFormData } from "@/app/form/(formSteps)/training/TrainingData";
import type { DataStoreKey } from "@/app/form/_utils/dataStore";
import { AddressState } from "@/app/form/_utils/inputFields/enums";
import { type FormData } from "@form/_utils/fillPdf/form";

const testinsuranceEndDateDay = "31";
const testinsuranceEndDateMonth = "12";
const testinsuranceEndDateYear = "2024";
const testinsuranceStartDateDay = "1";
const testinsuranceStartDateMonth = "1";
const testinsuranceStartDateYear = "2025";
const testDateOfBirthDay = "25";
const testDateOfBirthMonth = "12";
const testDateOfBirthYear = "1990";

const testScreeningFormData: ScreeningFormData = {
  isSupportedSoleProprietor: true,
};

const testTrainingFormData: TrainingFormData = {
  stateApprovedTraining: "New Jersey Doula Learning Collaborative (NJDLC)",
  nameOfTrainingOrganization: null,
  isDoulaTrainingInPerson: false,
  trainingStreetAddress1: null,
  trainingStreetAddress2: null,
  trainingCity: null,
  trainingState: null,
  trainingZip: null,
  instructorFirstName: "Default instructor first",
  instructorLastName: "Default instructor last",
  instructorEmail: "defaultInstructor@test.com",
  instructorPhoneNumber: null,
};

const testInsuranceFormData: InsuranceFormData = {
  insuranceStartDate: new Date(
    `${testinsuranceStartDateYear}-${testinsuranceStartDateMonth}-${testinsuranceStartDateDay}`,
  ),
  insuranceEndDate: new Date(
    `${testinsuranceEndDateYear}-${testinsuranceEndDateMonth}-${testinsuranceEndDateDay}`,
  ),
  insuranceOccurenceAmount: "300000",
  insuranceAggregateAmount: "1000000",
  insuranceCarrierName: "Default insurance carrier",
  insurancePolicyNumber: "Default-policy-123",
  insuranceStreetAddress1: "Default insurance street 1",
  insuranceStreetAddress2: null,
  insuranceCity: "Default insurance city",
  insuranceState: AddressState.NJ,
  insuranceZip: "08000",
};

const testPersonalDetailsFormData: PersonalDetailsFormData = {
  firstName: "Default first",
  middleName: null,
  lastName: "Default last",
  dateOfBirth: new Date(`${testDateOfBirthYear}-${testDateOfBirthMonth}-${testDateOfBirthDay}`),
  phoneNumber: "333-333-3333",
  email: "default@test.com",
  socialSecurityNumber: "333-33-3333",
  streetAddress1: "Default street 1",
  streetAddress2: null,
  city: "Default city",
  state: AddressState.NJ,
  zip: "08000",
  billingStreetAddress1: "Default billing street 1",
  billingStreetAddress2: null,
  billingCity: "Default billing city",
  billingState: AddressState.NJ,
  billingZip: "08000",
  npiNumber: "3333333333",
  medicareProviderId: null,
  upinNumber: null,
};

const testBusinessDetailsFormData: BusinessDetailsFormData = {
  businessStreetAddress1: "Default business street 1",
  businessStreetAddress2: null,
  businessCity: "Default business city",
  businessState: AddressState.NJ,
  businessZip: "08000",
  hasEin: false,
  ein: null,
  hasDisclosableEvent: false,
};

const testFormData: FormData = {
  ...testScreeningFormData,
  ...testInsuranceFormData,
  ...testTrainingFormData,
  ...testPersonalDetailsFormData,
  ...testBusinessDetailsFormData,
};

export const generateFormData = (formDataOverrides: Partial<FormData>): FormData => {
  return { ...testFormData, ...formDataOverrides };
};

export const setRequiredFieldsInDataStore = () => {
  // Screening
  window.sessionStorage.setItem("isSoleProprietor", "true");
  window.sessionStorage.setItem("everHadEmployees", "false");
  window.sessionStorage.setItem("everHadOtherBusinessOwner", "false");
  window.sessionStorage.setItem("haveOtherBusinessOwnerNextYear", "false");
  window.sessionStorage.setItem("hadDhmasBusiness", "false");

  // Personal details
  for (const [key, value] of Object.entries(testFormData)) {
    if (key === "dateOfBirth") {
      window.sessionStorage.setItem("dateOfBirthDay", testDateOfBirthDay);
      window.sessionStorage.setItem("dateOfBirthMonth", testDateOfBirthMonth);
      window.sessionStorage.setItem("dateOfBirthYear", testDateOfBirthYear);
    } else if (key === "insuranceStartDate") {
      window.sessionStorage.setItem("insuranceStartDateDay", testinsuranceStartDateDay);
      window.sessionStorage.setItem("insuranceStartDateMonth", testinsuranceStartDateMonth);
      window.sessionStorage.setItem("insuranceStartDateYear", testinsuranceStartDateYear);
    } else if (key === "insuranceEndDate") {
      window.sessionStorage.setItem("insuranceEndDateDay", testinsuranceEndDateDay);
      window.sessionStorage.setItem("insuranceEndDateMonth", testinsuranceEndDateMonth);
      window.sessionStorage.setItem("insuranceEndDateYear", testinsuranceEndDateYear);
    } else if (value !== null) {
      window.sessionStorage.setItem(key as DataStoreKey, value.toString());
    }
  }
  window.sessionStorage.setItem("hasSameBillingMailingAddress", "true");

  // Business details
  window.sessionStorage.setItem("businessAddressSameAsOtherAddress", "different");
  window.sessionStorage.setItem("hasUncollectedDebt", "false");
  window.sessionStorage.setItem("isSubjectToPaymentSuspension", "false");
  window.sessionStorage.setItem("hasBeenExcludedFromMedicaid", "false");
  window.sessionStorage.setItem("hasBeenSuspendedFromMedicaid", "false");
};

export const setInDataStore = (
  dataStoreValues: Partial<{
    [key in DataStoreKey]: string;
  }>,
) => {
  for (const [key, value] of Object.entries(dataStoreValues)) {
    window.sessionStorage.setItem(key, value);
  }
};
