import { Poppler } from 'node-poppler';
import path from 'path';
import Tesseract from 'tesseract.js';

async function convertPdfToPng(pdfPath: string): Promise<string> {
  const poppler = new Poppler();
  const outputDir = path.dirname(pdfPath);
  const options = {
    firstPageToConvert: 4, // TODO: don't hardcode
    lastPageToConvert: 4, // TODO: don't hardcode
    pngFile: true,
    singleFile: false,
  };

  return await poppler.pdfToCairo(pdfPath, `${outputDir}/output`, options);
}

async function textFromPng(imagePath: Tesseract.ImageLike): Promise<string> {
  const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
  return text;
}

async function extractTextFromPDF(filePath: string): Promise<string> {
  await convertPdfToPng(filePath);

  const outputDir = path.dirname(filePath);

  // TODO: don't hardcode
  const imagePath = path.resolve(outputDir, 'output-04.png');

  return await textFromPng(imagePath);
}

export async function validatePDF(filePath: string): Promise<boolean> {
  const text = await extractTextFromPDF(filePath);

  const groupNamePattern = /Group Practice Name\s*(.+?)(?=\n|$)/;
  const groupAddressPattern = /Group Practice Address\s*(.+?)(?=\n|$)/;

  const groupNameMatch = text.match(groupNamePattern);
  const groupAddressMatch = text.match(groupAddressPattern);

  const isAddressValid = groupAddressMatch !== null && groupAddressMatch[1].trim() !== '' && groupAddressMatch[1].trim() !== '_';

  if (groupNameMatch && groupNameMatch[1].trim() !== '' && groupNameMatch[1].trim() !== '_') {
    return isAddressValid;
  }

  return true;
}
