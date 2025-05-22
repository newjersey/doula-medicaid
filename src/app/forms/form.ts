import { PDFArray, PDFDocument, PDFName, PDFTextField } from "pdf-lib";
import { fillAetnaForm } from "./aetna";
import { fillFidelisForm } from "./fidelis";

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
  return await Promise.all([fillAetnaForm(formData), fillFidelisForm(formData)]);
};

export const fillForm = async (
  formData: FormData,
  pdfPath: string,
  fieldMap: Partial<Record<keyof FormData, string>>,
  filename: string,
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

export const parseFfs = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const form = pdfDoc.getForm();
  const pages = pdfDoc.getPages();
  const allFields = [];
  for (const field of form.getFields()) {
    const fieldPage = pdfDoc.findPageForAnnotationRef(field.ref);
    if (fieldPage === undefined) throw "whoops";
    const pageNum = pages.findIndex((page) => page.ref.tag === fieldPage.ref.tag) + 1;
    allFields.push({
      type: field.constructor.name,
      pageNum: pageNum,
      yPos: field.acroField.getWidgets()[0].getRectangle().y,
      xPos: field.acroField.getWidgets()[0].getRectangle().x,
      key: field.getName(),
      isReadOnly: field.isReadOnly(),
      isRequired: field.isRequired(),
      maxLength: field instanceof PDFTextField && field.getMaxLength(),
    });
  }
  const sortedFields = allFields.sort(
    (a, b) => a.pageNum - b.pageNum || b.yPos - a.yPos || a.xPos - b.xPos,
  );
  console.log(sortedFields);
};

export const parseForm = async (
  file: File,
  // pdfPath: string,
  fieldMap: Partial<Record<keyof FormData, string>>,
  // filename: string,
): Promise<FormData> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const form = pdfDoc.getForm();
  const formData: Partial<FormData> = {};

  Object.entries(fieldMap).forEach(([key, fieldName]) => {
    const field = form.getTextField(fieldName);
    formData[key as keyof FormData] = field.getText();
  });
  return formData as FormData;

  // not implemented
  // const unfilledPdfFile = await fetch(pdfPath);
  // const unfilledPdfBytes = await unfilledPdfFile.arrayBuffer();
  // const pdfDoc = await PDFDocument.load(unfilledPdfBytes);
  // const form = pdfDoc.getForm();

  // Object.entries(fieldMap).forEach(([key, fieldName]) => {
  //   const field = form.getTextField(fieldName);
  //   field.setText(formData[key as keyof FormData]);
  // });

  // const filledPdfBytes = await pdfDoc.save();
  // return { filename, bytes: filledPdfBytes };
};
