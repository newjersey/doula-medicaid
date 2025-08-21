import {
  getBusinessDetailsData,
  type BusinessDetailsFormData,
} from "@/app/form/(formSteps)/business-details/BusinessDetailsData";
import {
  getPersonalDetailsFormData,
  type PersonalDetailsFormData,
} from "@/app/form/(formSteps)/personal-details/PersonalDetailsData";
import {
  getTrainingFormData,
  type TrainingFormData,
} from "@/app/form/(formSteps)/training/TrainingData";
import { fillFfsIndividualForm } from "@/app/form/_utils/fillPdf/ffsIndividual/fillFfsIndividual";
import { fillAetnaForm } from "@form/_utils/fillPdf/aetna";
import { fillFidelisForm } from "@form/_utils/fillPdf/fidelis";
import { PDFBool, PDFCheckBox, PDFDocument, PDFName, PDFTextField } from "pdf-lib";

export interface FormData
  extends TrainingFormData,
    PersonalDetailsFormData,
    BusinessDetailsFormData {}

export interface FilledPDFData {
  filename: string;
  bytes: Uint8Array;
}

export const getFormData = (): FormData => {
  return {
    ...getTrainingFormData(),
    ...getPersonalDetailsFormData(),
    ...getBusinessDetailsData(),
  };
};

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

  form.acroForm.dict.set(PDFName.of("NeedAppearances"), PDFBool.True);
  form.updateFieldAppearances();

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
