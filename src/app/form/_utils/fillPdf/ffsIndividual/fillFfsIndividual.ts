import {
  getPage10Fields,
  type PdfFfsIndividualPage10,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page10";
import {
  getPage12Fields,
  type PdfFfsIndividualPage12,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page12";
import {
  getPage16Fields,
  type PdfFfsIndividualPage16,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page16";
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
  getPage25Fields,
  pdfFfsIndividualPage25FieldOptions,
  type PdfFfsIndividualPage25,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page25";
import {
  getPage3Fields,
  type PdfFfsIndividualPage3,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page3";
import {
  getPage4Fields,
  type PdfFfsIndividualPage4,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page4";
import {
  getPage5Fields,
  type PdfFfsIndividualPage5,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page5";
import {
  getPage7Fields,
  type PdfFfsIndividualPage7,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page7";
import { fillForm, type FormData } from "@form/_utils/fillPdf/form";

export const FFS_INDIVIDUAL_PDF_NAME = "Fee For Service Application.pdf";
export const FFS_INDIVIDUAL_PDF_PATH = "/pdf/ffs_individual.pdf";

export interface PdfFfsIndividual
  extends PdfFfsIndividualPage3,
    PdfFfsIndividualPage4,
    PdfFfsIndividualPage5,
    PdfFfsIndividualPage7,
    PdfFfsIndividualPage10,
    PdfFfsIndividualPage12,
    PdfFfsIndividualPage16,
    PdfFfsIndividualPage17,
    PdfFfsIndividualPage18,
    PdfFfsIndividualPage19,
    PdfFfsIndividualPage20,
    PdfFfsIndividualPage21,
    PdfFfsIndividualPage22,
    PdfFfsIndividualPage25 {}

export const mapFfsIndividualFields = (formData: FormData): Partial<PdfFfsIndividual> => {
  const pdfFields = {
    ...getPage3Fields(formData),
    ...getPage4Fields(formData),
    ...getPage5Fields(formData),
    ...getPage7Fields(formData),
    ...getPage10Fields(formData),
    ...getPage12Fields(formData),
    ...getPage16Fields(formData),
    ...getPage17Fields(formData),
    ...getPage18Fields(formData),
    ...getPage19Fields(formData),
    ...getPage20Fields(formData),
    ...getPage21Fields(formData),
    ...getPage22Fields(formData),
    ...getPage25Fields(formData),
  };
  return pdfFields;
};

export const fillFfsIndividualForm = (formData: FormData) => {
  const fieldOptions = { ...pdfFfsIndividualPage25FieldOptions };
  return fillForm(
    mapFfsIndividualFields(formData),
    fieldOptions,
    FFS_INDIVIDUAL_PDF_PATH,
    FFS_INDIVIDUAL_PDF_NAME,
  );
};
