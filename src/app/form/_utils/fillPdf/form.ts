import { fillAetnaForm } from "@form/_utils/fillPdf/aetna";
import { fillFfsIndividualForm } from "@form/_utils/fillPdf/ffsIndividual";
import { fillFidelisForm } from "@form/_utils/fillPdf/fidelis";
import type { AddressState, DisclosingEntity } from "@form/_utils/inputFields/enums";
import {
  PDFCheckBox,
  PDFDocument,
  PDFTextField,
  concatTransformationMatrix,
  rotateRadians,
} from "pdf-lib";

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
  hasSameBusinessAddress: boolean | null;
  businessStreetAddress1: string | null;
  businessStreetAddress2: string | null;
  businessCity: string | null;
  businessState: AddressState | null;
  businessZip: string | null;
  signature: string | null;
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
  formData: FormData,
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

  if (formData.signature && filename === "ffs_individual_filled.pdf") {
    try {
      const signatureField = form.getField("fd444authorizationsignaturename1");
      const widgets = signatureField.acroField.getWidgets();

      if (widgets.length > 0) {
        const widget = widgets[0];
        const pages = pdfDoc.getPages();
        const pageRef = widget.P();
        let targetPage = pages[0];

        if (pageRef) {
          const pageIndex = pages.findIndex((page) => page.ref === pageRef);
          if (pageIndex !== -1) {
            targetPage = pages[pageIndex];
          }
        }

        const rect = widget.getRectangle();
        const signatureImage = await pdfDoc.embedPng(formData.signature);
        const signatureDims = signatureImage.scaleToFit(rect.width - 4, rect.height - 4);

        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;

        const imageX = -signatureDims.width / 2;
        const imageY = -signatureDims.height / 2;

        targetPage.pushOperators(
          concatTransformationMatrix(1, 0, 0, 1, centerX, centerY),
          rotateRadians(Math.PI),
        );

        targetPage.drawImage(signatureImage, {
          x: imageX,
          y: imageY,
          width: signatureDims.width,
          height: signatureDims.height,
        });
      }
    } catch (error) {
      console.error("Error placing signature:", error);
    }
  }

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
