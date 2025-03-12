import { PDFDocument } from 'pdf-lib';

export interface FormData {
  ccEmail: string;
  dob: string;
  firstName: string;
  lastName: string;
}

export const fillForm = async (
  formData: FormData,
  pdfPath: string,
  fieldMap: Partial<Record<keyof FormData, string>>
): Promise<Uint8Array> => {
  const existingPdfBytes = await fetch(pdfPath).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();

  Object.entries(fieldMap).forEach(([key, fieldName]) => {
    const field = form.getTextField(fieldName);
    field.setText(formData[key as keyof FormData]);
  });

  return await pdfDoc.save();
};
