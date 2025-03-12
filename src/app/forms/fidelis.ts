import { FormData, fillForm } from './form';

export const FIDELIS_PDF_NAME = 'fidelis_filled.pdf';
export const FIDELIS_PDF_PATH = '/pdf/fidelis.pdf';

export const FIDELIS_FIELD_MAP: Partial<Record<keyof FormData, string>> = {
  dob: 'Text3',
  firstName: 'Text2',
  lastName: 'Text1',
};

export const fillFidelisForm = (formData: FormData): Promise<Uint8Array> => {
  return fillForm(formData, FIDELIS_PDF_PATH, FIDELIS_FIELD_MAP);
};
