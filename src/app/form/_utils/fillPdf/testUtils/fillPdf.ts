import {
  mapFfsIndividualFields,
  type PdfFfsIndividual,
} from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import { generateFormData } from "@/app/form/_utils/fillPdf/testUtils/formData";
import { type FormData } from "@form/_utils/fillPdf/form";

export const expectNoDuplicateTest = <T>(pdfKey: keyof T, testedPdfKeys: Set<keyof T>) => {
  expect(testedPdfKeys.has(pdfKey), `Duplicate test for ${pdfKey.toString()}`).toEqual(false);
  testedPdfKeys.add(pdfKey);
};

export const testName = (pdfKey: keyof PdfFfsIndividual) => {
  const formDataWithMiddleName: FormData = generateFormData({
    firstName: "First",
    middleName: "Middle",
    lastName: "Last",
  });
  const pdfFieldsWithMiddleName = mapFfsIndividualFields(formDataWithMiddleName);
  expect(pdfFieldsWithMiddleName[pdfKey]).toEqual("First Middle Last");

  const formDataWithoutMiddleName: FormData = generateFormData({
    firstName: "First",
    lastName: "Last",
  });
  const pdfFieldsWithoutMiddleName = mapFfsIndividualFields(formDataWithoutMiddleName);
  expect(pdfFieldsWithoutMiddleName[pdfKey]).toEqual("First Last");
};

export const testNameAndDoulaTitle = (pdfKey: keyof PdfFfsIndividual) => {
  const formDataWithMiddleName: FormData = generateFormData({
    firstName: "First",
    middleName: "Middle",
    lastName: "Last",
  });
  const pdfFieldsWithMiddleName = mapFfsIndividualFields(formDataWithMiddleName);
  expect(pdfFieldsWithMiddleName[pdfKey]).toEqual("First Middle Last, Doula");

  const formDataWithoutMiddleName: FormData = generateFormData({
    firstName: "First",
    lastName: "Last",
  });
  const pdfFieldsWithoutMiddleName = mapFfsIndividualFields(formDataWithoutMiddleName);
  expect(pdfFieldsWithoutMiddleName[pdfKey]).toEqual("First Last, Doula");
};

export const testDateOfBirth = (pdfKey: keyof PdfFfsIndividual) => {
  const formData: FormData = generateFormData({
    dateOfBirth: new Date("1/2/1990"),
  });
  const pdfFields = mapFfsIndividualFields(formData);
  expect(pdfFields[pdfKey]).toEqual("01/02/1990");
};

export const testPhoneNumber = (pdfKey: keyof PdfFfsIndividual) => {
  const formData: FormData = generateFormData({
    phoneNumber: "111-111-1111",
  });
  const pdfFields = mapFfsIndividualFields(formData);
  expect(pdfFields[pdfKey]).toEqual("111-111-1111");
};

export const testNpiNumber = (pdfKey: keyof PdfFfsIndividual) => {
  const formData: FormData = generateFormData({
    npiNumber: "1111111111",
  });
  const pdfFields = mapFfsIndividualFields(formData);
  expect(pdfFields[pdfKey]).toEqual("1111111111");
};

export const testSocialSecurityNumber = (pdfKey: keyof PdfFfsIndividual) => {
  const formData: FormData = generateFormData({
    socialSecurityNumber: "123-45-6789",
  });
  const pdfFields = mapFfsIndividualFields(formData);
  expect(pdfFields[pdfKey]).toEqual("123-45-6789");
};
