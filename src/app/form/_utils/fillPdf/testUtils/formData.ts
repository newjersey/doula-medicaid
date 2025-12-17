import type { BusinessFormData } from "@/app/form/(formSteps)/business/BusinessData";
import type { InsuranceFormData } from "@/app/form/(formSteps)/insurance/InsuranceData";
import type { LegalFormData } from "@/app/form/(formSteps)/legal/LegalData";
import type { PersonalFormData } from "@/app/form/(formSteps)/personal/PersonalData";
import type { ScreeningFormData } from "@/app/form/(formSteps)/screening/ScreeningData";
import type { TrainingFormData } from "@/app/form/(formSteps)/training/TrainingData";
import type { DataStore, DataStoreKey } from "@/app/form/_utils/dataStore";
import { AddressState } from "@/app/form/_utils/inputFields/addressState";
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

const testPersonalFormData: PersonalFormData = {
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

const testBusinessFormData: BusinessFormData = {
  businessStreetAddress1: "Default business street 1",
  businessStreetAddress2: null,
  businessCity: "Default business city",
  businessState: AddressState.NJ,
  businessZip: "08000",
  hasDisclosableEvent: false,
  hasFiledBankruptcy: false,
  pastBankruptcyDate: null,
  mightFileBankruptcy: false,
  futureBankruptcyDate: null,
};

const testLegalFormData: LegalFormData = {
  // legal 1
  employedByState: false,
  employedByStateDetails: null,
  approvedForMedicaidProgram: false,
  approvedForMedicaidDetails: null,

  // legal 2
  hasCrimeCharge: false,
  crimeChargeExplanation: null,
  hadLicenseSuspended: false,
  licenseSuspendedExplanation: null,
  hasDisqualification: false,
  disqualificationExplanation: null,
  hasCompanyInvolvement: false,
  companyInvolvementExplanation: null,
};

const getTestFormData = () => {
  return {
    ...testScreeningFormData,
    ...testInsuranceFormData,
    ...testTrainingFormData,
    ...testPersonalFormData,
    ...testBusinessFormData,
    ...(process.env.NEXT_PUBLIC_FLAG_LEGAL === "1" ? testLegalFormData : {}),
  };
};

export const generateFormData = (formDataOverrides: Partial<FormData>): FormData => {
  return {
    ...getTestFormData(),
    ...formDataOverrides,
  };
};

export const generateDataStoreWithRequiredFields = (
  dataStoreOverrides?: DataStore,
  keysToOmit?: Array<DataStoreKey>,
) => {
  const dataStoreFieldsNotInFormData: DataStore = {
    // Screening
    isSoleProprietor: "true",
    everHadEmployees: "false",
    everHadOtherBusinessOwner: "false",
    haveOtherBusinessOwnerNextYear: "false",
    hadDhmasBusiness: "false",

    // Personal
    hasSameBillingMailingAddress: "true",

    // Business
    businessAddressSameAsOtherAddress: "different",
    hasUncollectedDebt: "false",
    isSubjectToPaymentSuspension: "false",
    hasBeenExcludedFromMedicaid: "false",
    hasBeenSuspendedFromMedicaid: "false",
  };

  const defaultDataStore: DataStore = {
    ...dataStoreFieldsNotInFormData,
  };

  const replaceFormDataWithDataStoreFields = {
    dateOfBirth: [
      { key: "dateOfBirthDay", value: testDateOfBirthDay },
      { key: "dateOfBirthMonth", value: testDateOfBirthMonth },
      { key: "dateOfBirthYear", value: testDateOfBirthYear },
    ],
    insuranceStartDate: [
      { key: "insuranceStartDateDay", value: testinsuranceStartDateDay },
      { key: "insuranceStartDateMonth", value: testinsuranceStartDateMonth },
      { key: "insuranceStartDateYear", value: testinsuranceStartDateYear },
    ],
    insuranceEndDate: [
      { key: "insuranceEndDateDay", value: testinsuranceEndDateDay },
      { key: "insuranceEndDateMonth", value: testinsuranceEndDateMonth },
      { key: "insuranceEndDateYear", value: testinsuranceEndDateYear },
    ],
  };

  const testFormData = getTestFormData();
  for (const [key, value] of Object.entries(testFormData)) {
    if (!(key in replaceFormDataWithDataStoreFields) && value !== null) {
      defaultDataStore[key as DataStoreKey] = value.toString();
    }
  }

  for (const replacementFields of Object.values(replaceFormDataWithDataStoreFields)) {
    for (const replacement of replacementFields) {
      defaultDataStore[replacement.key] = replacement.value;
    }
  }

  const dataStore = { ...defaultDataStore, ...dataStoreOverrides };
  if (keysToOmit !== undefined) {
    for (const key of keysToOmit) {
      delete dataStore[key];
    }
  }

  return dataStore;
};
