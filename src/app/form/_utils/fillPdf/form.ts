import { BASE_PATH } from "@/app/basePath";
import {
  getBusinessFormData,
  type BusinessFormData,
} from "@/app/form/(formSteps)/business/BusinessData";
import {
  getInsuranceFormData,
  type InsuranceFormData,
} from "@/app/form/(formSteps)/insurance/InsuranceData";
import { getLegalFormData, type LegalFormData } from "@/app/form/(formSteps)/legal/LegalData";
import {
  getPersonalFormData,
  type PersonalFormData,
} from "@/app/form/(formSteps)/personal/PersonalData";
import {
  getScreeningFormData,
  type ScreeningFormData,
} from "@/app/form/(formSteps)/screening/ScreeningData";
import {
  getTrainingFormData,
  type TrainingFormData,
} from "@/app/form/(formSteps)/training/TrainingData";
import type { DataStore } from "@/app/form/_utils/dataStore";
import { PDFBool, PDFCheckBox, PDFDocument, PDFName, PDFTextField } from "pdf-lib";

interface BaseFormData
  extends ScreeningFormData,
    InsuranceFormData,
    TrainingFormData,
    PersonalFormData,
    BusinessFormData {}

export interface FormDataWithLegal extends BaseFormData, LegalFormData {}

export type FormData = FormDataWithLegal | BaseFormData;

export interface FilledPDFData {
  filename: string;
  bytes: Uint8Array;
}

interface FieldOption {
  fontSize?: number;
}

export const getFormData = (dataStore: DataStore): FormData => {
  return {
    ...getScreeningFormData(dataStore),
    ...getInsuranceFormData(dataStore),
    ...getTrainingFormData(dataStore),
    ...getPersonalFormData(dataStore),
    ...getBusinessFormData(dataStore),
    ...(process.env.NEXT_PUBLIC_FLAG_LEGAL === "1" ? { ...getLegalFormData(dataStore) } : {}),
  };
};

const getFontSize = (fieldName: string, fieldOptions: { [key: string]: FieldOption }) => {
  if (fieldName in fieldOptions && fieldOptions[fieldName].fontSize !== undefined) {
    return fieldOptions[fieldName].fontSize;
  } else {
    return 12;
  }
};

export const fillForm = async (
  pdfFields: { [key: string]: string | boolean },
  fieldOptions: { [key: string]: FieldOption },
  pdfPath: string,
  filename: string,
): Promise<FilledPDFData> => {
  const unfilledPdfFile = await fetch(`${BASE_PATH}${pdfPath}`);
  const unfilledPdfBytes = await unfilledPdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(unfilledPdfBytes);
  const form = pdfDoc.getForm();

  Object.entries(pdfFields).forEach(([fieldName, value]) => {
    const field = form.getField(fieldName);
    if (field instanceof PDFTextField) {
      if (typeof value !== "string") {
        throw new Error(`Expected string for text field ${fieldName}, but got ${typeof value}`);
      }
      field.setText(value.toString());
      field.setFontSize(getFontSize(fieldName, fieldOptions));
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
 * Issues/difficulty with parsing
 *
 * - User might upload pdf not as a fillable pdf, or even non-filllable typed-out pdf, but as a scan
 *   of handwriting
 * - FFS might have "full legal name", but MCO wants separate first and last names
 * - User might input date in any number of formats (we can likely overcome this)
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
