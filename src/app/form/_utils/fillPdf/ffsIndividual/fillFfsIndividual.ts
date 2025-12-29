import {
  getPage11Fields,
  type PdfFfsIndividualPage11,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page11";
import {
  getPage13Fields,
  type PdfFfsIndividualPage13,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page13";
import {
  getPage17Fields,
  type PdfFfsIndividualPage17,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page17";
import {
  getPage18Fields,
  type PdfFfsIndividualPage18,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page18";
import {
  getPage19Fields,
  type PdfFfsIndividualPage19,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page19";
import {
  getPage20Fields,
  type PdfFfsIndividualPage20,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page20";
import {
  getPage21Fields,
  type PdfFfsIndividualPage21,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page21";
import {
  getPage22Fields,
  type PdfFfsIndividualPage22,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page22";
import {
  getPage23Fields,
  type PdfFfsIndividualPage23,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page23";
import {
  getPage26Fields,
  pdfFfsIndividualPage26FieldOptions,
  type PdfFfsIndividualPage26,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page26";
import {
  getPage4Fields,
  type PdfFfsIndividualPage4,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page4";
import {
  getPage5Fields,
  type PdfFfsIndividualPage5,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page5";
import {
  getPage6Fields,
  type PdfFfsIndividualPage6,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page6";
import {
  getPage8Fields,
  type PdfFfsIndividualPage8,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page8";
import {
  getPage9Fields,
  type PdfFfsIndividualPage9,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page9";
import { fillForm, type FormData } from "@form/_utils/fillPdf/form";

export const FFS_INDIVIDUAL_PDF_NAME = "Fee For Service Application.pdf";
export const FFS_INDIVIDUAL_PDF_PATH = "/pdf/ffs_individual.pdf";

export interface PdfFfsIndividual
  extends
    PdfFfsIndividualPage4,
    PdfFfsIndividualPage5,
    PdfFfsIndividualPage6,
    PdfFfsIndividualPage8,
    PdfFfsIndividualPage9,
    PdfFfsIndividualPage11,
    PdfFfsIndividualPage13,
    PdfFfsIndividualPage17,
    PdfFfsIndividualPage18,
    PdfFfsIndividualPage19,
    PdfFfsIndividualPage20,
    PdfFfsIndividualPage21,
    PdfFfsIndividualPage22,
    PdfFfsIndividualPage23,
    PdfFfsIndividualPage26 {}

export const mapFfsIndividualFields = (formData: FormData): Partial<PdfFfsIndividual> => {
  const pdfFields = {
    ...getPage4Fields(formData),
    ...getPage5Fields(formData),
    ...getPage6Fields(formData),
    ...getPage8Fields(formData),
    ...getPage9Fields(formData),
    ...getPage11Fields(formData),
    ...getPage13Fields(formData),
    ...getPage17Fields(formData),
    ...getPage18Fields(formData),
    ...getPage19Fields(formData),
    ...getPage20Fields(formData),
    ...getPage21Fields(formData),
    ...getPage22Fields(formData),
    ...getPage23Fields(formData),
    ...getPage26Fields(formData),
  };
  return pdfFields;
};

export const fillFfsIndividualForm = (formData: FormData) => {
  const fieldOptions = { ...pdfFfsIndividualPage26FieldOptions };
  return fillForm(
    mapFfsIndividualFields(formData),
    fieldOptions,
    FFS_INDIVIDUAL_PDF_PATH,
    FFS_INDIVIDUAL_PDF_NAME,
  );
};
