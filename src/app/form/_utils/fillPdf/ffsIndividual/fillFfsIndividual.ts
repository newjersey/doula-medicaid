import {
  getPage12Fields,
  type PdfFfsIndividualPage12,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page12";
import {
  getPage16Fields,
  type PdfFfsIndividualPage16,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page16";
import {
  getPage3Fields,
  type PdfFfsIndividualPage3,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page3";
import {
  getPage5Fields,
  type PdfFfsIndividualPage5,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page5";
import {
  getPage7Fields,
  type PdfFfsIndividualPage7,
} from "@/app/form/_utils/fillPdf/ffsIndividual/page7";
import { fillForm, type FormData } from "@form/_utils/fillPdf/form";

export const FFS_INDIVIDUAL_PDF_NAME = "ffs_individual_filled.pdf";
export const FFS_INDIVIDUAL_PDF_PATH = "/pdf/ffs_individual.pdf";

export interface PdfFfsIndividual
  extends PdfFfsIndividualPage3,
    PdfFfsIndividualPage5,
    PdfFfsIndividualPage7,
    PdfFfsIndividualPage12,
    PdfFfsIndividualPage16 {}

export const mapFfsIndividualFields = (formData: FormData): Partial<PdfFfsIndividual> => {
  const fieldsToFill = {
    ...getPage3Fields(formData),
    ...getPage5Fields(formData),
    ...getPage7Fields(formData),
    ...getPage12Fields(formData),
    ...getPage16Fields(formData),
  };
  return fieldsToFill;
};

export const fillFfsIndividualForm = (formData: FormData) => {
  return fillForm(
    mapFfsIndividualFields(formData),
    FFS_INDIVIDUAL_PDF_PATH,
    FFS_INDIVIDUAL_PDF_NAME,
  );
};
