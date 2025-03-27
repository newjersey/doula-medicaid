import { FormData, fillForm } from './form';

export const HORIZON_PDF_NAME = 'horizon_filled.pdf';
export const HORIZON_PDF_PATH = '/pdf/horizon.pdf';

export const HORIZON_FIELD_MAP: Partial<Record<keyof FormData, string>> = {
  groupPracticeAddress: 'Text2',
  groupPracticeName: 'Text1',
};

export const fillHorizonForm = (formData: FormData) => {
  return fillForm(formData, HORIZON_PDF_PATH, HORIZON_FIELD_MAP, HORIZON_PDF_NAME);
};
