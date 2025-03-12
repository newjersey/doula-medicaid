import { FormData, fillForm } from './form';

export const AETNA_PDF_NAME = 'aetna_filled.pdf';
export const AETNA_PDF_PATH = '/pdf/aetna.pdf';

export const AETNA_FIELD_MAP: Partial<Record<keyof FormData, string>> = {
  dob: 'Text2',
  firstName: 'Text3',
  lastName: 'Text1',
};

export const fillAetnaForm = (formData: FormData): Promise<Uint8Array> => {
  return fillForm(formData, AETNA_PDF_PATH, AETNA_FIELD_MAP);
};
