import { PDFCheckBox, PDFDocument, PDFTextField } from "pdf-lib";
import type { AddressState, DisclosingEntity } from "../inputFields/enums";
import { fillAetnaForm } from "./aetna";
import { fillFfsIndividualForm } from "./ffsIndividual";
import { fillFidelisForm } from "./fidelis";

export interface FormData {
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  dateOfBirth: Date | null;
  phoneNumber: string | null;
  email: string | null;
  npiNumber: string | null;
  socialSecurityNumber: string | null;
  streetAddress1: string | null;
  streetAddress2: string | null;
  city: string | null;
  state: AddressState | null;
  zip: string | null;
  natureOfDisclosingEntity: DisclosingEntity | null;
}

export interface FilledPDFData {
  filename: string;
  bytes: Uint8Array;
}

export const fillAllForms = async (formData: FormData) => {
  return await Promise.all([
    fillAetnaForm(formData),
    fillFidelisForm(formData),
    fillFfsIndividualForm(formData),
  ]);
};

export const fillForm = async (
  fieldsToFill: { [key: string]: string | boolean },
  pdfPath: string,
  filename: string,
): Promise<FilledPDFData> => {
  const unfilledPdfFile = await fetch(pdfPath);
  const unfilledPdfBytes = await unfilledPdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(unfilledPdfBytes);
  const form = pdfDoc.getForm();

  Object.entries(fieldsToFill).forEach(([fieldName, value]) => {
    const field = form.getField(fieldName);
    if (field instanceof PDFTextField) {
      if (typeof value !== "string") {
        throw new Error(`Expected string for text field, but got ${typeof value}`);
      }
      field.setText(value.toString());
    } else if (field instanceof PDFCheckBox) {
      if (typeof value !== "boolean") {
        throw new Error(`Expected boolean for checkbox field, but got ${typeof value}`);
      }
      if (value) {
        field.check();
      } else {
        field.uncheck();
      }
    }
  });

  const filledPdfBytes = await pdfDoc.save();
  return { filename, bytes: filledPdfBytes };
};

/**
  Issues/difficulty with parsing
  - User might upload pdf not as a fillable pdf, or even non-filllable typed-out pdf, but as a scan of handwriting
  - FFS might have "full legal name", but MCO wants separate first and last names
  - User might input date in any number of formats (we can likely overcome this)
 */
// export const parseForm = async (
//   file: File,
//   fieldMap: Partial<Record<keyof FormData, string>>,
// ): Promise<Partial<FormData>> => {
//   const arrayBuffer = await file.arrayBuffer();
//   const pdfDoc = await PDFDocument.load(arrayBuffer);
//   const form = pdfDoc.getForm();
//   const formData: Partial<FormData> = {};

//   Object.entries(fieldMap).forEach(([key, fieldName]) => {
//     const field = form.getTextField(fieldName);
//     if (field.getText()) {
//       formData[key as keyof FormData] = field.getText();
//     }
//   });
//   return formData as FormData;
// };
