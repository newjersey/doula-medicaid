import { AddressState } from "@/app/form/_utils/inputFields/enums";
import type { SessionStorageKey } from "@/app/form/_utils/sessionStorage";
import { type FormData } from "@form/_utils/fillPdf/form";

const defaultDateOfBirthDay = "25";
const defaultDateOfBirthMonth = "12";
const defaultDateOfBirthYear = "1990";

const defaultFormData = {
  stateApprovedTraining: "Children's Home Society of NJ (Trenton)",
  nameOfTrainingOrganization: null,
  instructorFirstName: "First",
  instructorLastName: "Last",
  instructorEmail: "test@example.com",
  instructorPhoneNumber: "111-111-1111",
  isDoulaTrainingInPerson: false,
  trainingStreetAddress1: null,
  trainingStreetAddress2: null,
  trainingCity: null,
  trainingState: null,
  trainingZip: null,
  firstName: "First",
  middleName: null,
  lastName: "Last",
  dateOfBirth: new Date(
    `${defaultDateOfBirthYear}-${defaultDateOfBirthMonth}-${defaultDateOfBirthDay}`,
  ),
  phoneNumber: "111-111-1111",
  email: "test@domain.com",
  npiNumber: "1111111111",
  socialSecurityNumber: "111-11-1111",
  streetAddress1: "Test street 1",
  streetAddress2: null,
  city: "Trenton",
  state: AddressState.NJ,
  zip: "08601",
  hasSameBillingMailingAddress: true,
  billingStreetAddress1: null,
  billingStreetAddress2: null,
  billingCity: null,
  billingState: null,
  billingZip: null,
  natureOfDisclosingEntity: null,
  hasSameBusinessAddress: true,
  businessStreetAddress1: null,
  businessStreetAddress2: null,
  businessCity: null,
  businessState: null,
  businessZip: null,
};

export const generateFormData = (formDataOverrides: Partial<FormData>): FormData => {
  return { ...defaultFormData, ...formDataOverrides };
};

export const setRequiredFieldsInSessionStorage = () => {
  window.sessionStorage.setItem("isSoleProprietorship", "true");
  for (const [key, value] of Object.entries(defaultFormData)) {
    if (key === "dateOfBirth") {
      window.sessionStorage.setItem("dateOfBirthDay", defaultDateOfBirthDay);
      window.sessionStorage.setItem("dateOfBirthMonth", defaultDateOfBirthMonth);
      window.sessionStorage.setItem("dateOfBirthYear", defaultDateOfBirthYear);
    } else if (value !== null) {
      window.sessionStorage.setItem(key as SessionStorageKey, value.toString());
    }
  }
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
