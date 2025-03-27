import { PDFDocument } from 'pdf-lib';
import { fillAetnaForm } from './aetna';
import { fillFidelisForm } from './fidelis';

export interface FormData {
  ccEmail: string;
  dob: string;
  firstName: string;
  groupPracticeAddress: string;
  groupPracticeName: string;
  lastName: string;
}

export interface FilledPDFData {
  filename: string;
  bytes: Uint8Array;
}

export const fillAllForms = async (formData: FormData) => {
  return await Promise.all([
    fillAetnaForm(formData),
    fillFidelisForm(formData),
  ]);
};

export const fillForm = async (
  formData: FormData,
  pdfPath: string,
  fieldMap: Partial<Record<keyof FormData, string>>,
  filename: string
): Promise<FilledPDFData> => {
  const unfilledPdfFile = await fetch(pdfPath);
  const unfilledPdfBytes = await unfilledPdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(unfilledPdfBytes);
  const form = pdfDoc.getForm();

  Object.entries(fieldMap).forEach(([key, fieldName]) => {
    const field = form.getTextField(fieldName);
    field.setText(formData[key as keyof FormData]);
  });

  const filledPdfBytes = await pdfDoc.save();
  return { filename, bytes: filledPdfBytes };
};
