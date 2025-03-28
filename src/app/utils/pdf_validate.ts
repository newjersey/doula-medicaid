import { Poppler } from 'node-poppler';
import path from 'path';
import Tesseract from 'tesseract.js';

async function convertPdfToPngs(pdfPath: string): Promise<string> {
  const poppler = new Poppler();
  const outputDir = path.dirname(pdfPath);
  const options = {
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
  await convertPdfToPngs(filePath);

  const outputDir = path.dirname(filePath);

  // TODO: don't hardcode
  const imagePath = path.resolve(outputDir, 'output-04.png');

  return await textFromPng(imagePath);
}

const entryPresentAfterPromptInText = (prompt: string, text: string) => {
  const promptPattern = new RegExp(`${prompt}\\s*(.+?)(?=\\n|$)`);
  const promptMatch = text.match(promptPattern);
  return promptMatch !== null && promptMatch[1].trim() !== '' && promptMatch[1].trim() !== '_';
};

const validateGroup = (text: string) => {
  const groupNameValid = entryPresentAfterPromptInText("Group Practice Name", text);
  const groupAddressValid = entryPresentAfterPromptInText("Group Practice Address", text);

  if (groupNameValid) {
    return groupAddressValid;
  }

  return true;
};

export async function validatePDF(filePath: string): Promise<boolean> {
  await convertPdfToPngs(filePath);
  const text = await extractTextFromPDF(filePath);
  return validateGroup(text);
}
