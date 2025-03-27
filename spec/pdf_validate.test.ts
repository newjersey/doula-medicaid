import { validatePDF } from '../src/app/utils/pdf_validate';
import path from 'path';

describe('PDF Validation Tests', () => {
  test('valid_no_group.pdf should be valid', async () => {
    const filePath = path.resolve(__dirname, 'path/to/valid_no_group.pdf');
    const isValid = await validatePDF(filePath);
    expect(isValid).toBe(true);
  });

  test('valid_group.pdf should be valid', async () => {
    const filePath = path.resolve(__dirname, 'path/to/valid_group.pdf');
    const isValid = await validatePDF(filePath);
    expect(isValid).toBe(true);
  });

  test('invalid_no_group_address.pdf should be invalid', async () => {
    const filePath = path.resolve(__dirname, 'path/to/invalid_no_group_address.pdf');
    const isValid = await validatePDF(filePath);
    expect(isValid).toBe(false);
  });
});
