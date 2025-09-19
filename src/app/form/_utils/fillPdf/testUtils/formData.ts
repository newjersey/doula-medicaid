import { AddressState } from "@/app/form/_utils/inputFields/enums";
import type { SessionStorageKey } from "@/app/form/_utils/sessionStorage";
import { type FormData } from "@form/_utils/fillPdf/form";

const testDateOfBirthDay = "25";
const testDateOfBirthMonth = "12";
const testDateOfBirthYear = "1990";

const testFormData: FormData = {
  isSupportedSoleProprietor: true,
  stateApprovedTraining: "New Jersey Doula Learning Collaborative (NJDLC)",
  nameOfTrainingOrganization: null,
  instructorFirstName: "Default instructor first",
  instructorLastName: "Default instructor last",
  instructorEmail: "defaultInstructor@test.com",
  instructorPhoneNumber: null,
  isDoulaTrainingInPerson: false,
  trainingStreetAddress1: null,
  trainingStreetAddress2: null,
  trainingCity: null,
  trainingState: null,
  trainingZip: null,
  firstName: "Default first",
  middleName: null,
  lastName: "Default last",
  dateOfBirth: new Date(`${testDateOfBirthYear}-${testDateOfBirthMonth}-${testDateOfBirthDay}`),
  phoneNumber: "333-333-3333",
  email: "default@test.com",
  npiNumber: "3333333333",
  medicareProviderId: null,
  upinNumber: null,
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
  businessStreetAddress1: "Default business street 1",
  businessStreetAddress2: null,
  businessCity: "Default business city",
  businessState: AddressState.NJ,
  businessZip: "08000",
  hasEin: false,
  ein: null,
  hasDisclosableEvent: false,
};

export const generateFormData = (formDataOverrides: Partial<FormData>): FormData => {
  return { ...testFormData, ...formDataOverrides };
};

export const setRequiredFieldsInSessionStorage = () => {
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
    } else if (value !== null) {
      window.sessionStorage.setItem(key as SessionStorageKey, value.toString());
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

export const setInSessionStorage = (
  sessionStorageValues: Partial<{
    [key in SessionStorageKey]: string;
  }>,
) => {
  for (const [key, value] of Object.entries(sessionStorageValues)) {
    window.sessionStorage.setItem(key, value);
  }
};
