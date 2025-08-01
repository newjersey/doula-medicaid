export interface PersonalDetails1Data {
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  dateOfBirthMonth: string | null;
  dateOfBirthDay: string | null;
  dateOfBirthYear: string | null;
  socialSecurityNumber: string | null;
  email: string | null;
  phoneNumber: string | null;
}

export interface PersonalDetails2Data {
  streetAddress1: string | null;
  streetAddress2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
}

export interface PersonalDetails3Data {
  npiNumber: string | null;
  medicareProviderId: string | null;
  upinNumber: string | null;
}
