import { Poppler } from 'node-poppler';
import path from 'path';
import Tesseract from 'tesseract.js';
import fs from 'fs/promises';

const TEMP_DIR = 'temp';

async function convertPdfToPngs(pdfPath: string): Promise<string> {
  const poppler = new Poppler();
  const options = {
    pngFile: true,
    singleFile: false,
  };

  return await poppler.pdfToCairo(pdfPath, `${TEMP_DIR}/output`, options);
}

async function textFromPng(imagePath: Tesseract.ImageLike): Promise<string> {
  const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
  return text;
}

async function extractTextFromPNGs(): Promise<string> {
  // TODO: do for all contents of TEMP_DIR
  const imagePath = path.resolve(TEMP_DIR, 'output-04.png');

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

async function cleanupTempDir() {
  const files = await fs.readdir(TEMP_DIR);

  for (const file of files) {
    await fs.unlink(path.join(TEMP_DIR, file));
  }

  await fs.rmdir(TEMP_DIR);
}

export async function validatePDF(filePath: string): Promise<boolean> {
  await fs.mkdir(TEMP_DIR);
  await convertPdfToPngs(filePath);
  const text = await extractTextFromPNGs();
  const result = validateGroup(text);
  await cleanupTempDir();
  return result;
}
