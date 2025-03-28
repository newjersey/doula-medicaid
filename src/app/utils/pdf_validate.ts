import { Poppler } from 'node-poppler';
import path from 'path';
import Tesseract from 'tesseract.js';
import fs from 'fs';

async function convertPdfToPng(pdfPath: string): Promise<string> {
  console.log("convertPdfToPng");
  console.log(pdfPath);
  const poppler = new Poppler();
  const outputDir = path.dirname(pdfPath);
  const options = {
    pngFile: true, // Specify that we want PNG output
    singleFile: false, // Produce separate image files for each page
  };

  const res = await poppler.pdfToCairo(pdfPath, `${outputDir}/output`, options);

  console.log(res);
  return res;
}

async function textFromPng(imagePath: Tesseract.ImageLike): Promise<string> {
    console.log(`Analyzing ${imagePath}...`);

    // Perform OCR on the image
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      logger: info => console.log(info), // Optional: log progress
    });

    return text;

    // console.log(`Extracted Text: \n${text}`);

    // // Write the extracted text to a file
    // fs.writeFileSync(outputTextFile, text, 'utf8');
    // console.log(`Text written to ${outputTextFile}`);
}

async function extractTextFromPDF(filePath: string): Promise<string> {
  await convertPdfToPng(filePath);

  const outputDir = path.dirname(filePath);

  // Define the path to your specific PNG and the output text file
  const imagePath = path.resolve(outputDir, 'output-04.png');

  // Run the OCR and save the result
  const text = await textFromPng(imagePath);

  return text;
}

export async function validatePDF(filePath: string): Promise<boolean> {

  const text = await extractTextFromPDF(filePath);

  console.log(text);
  
  const groupNamePattern = /Group Practice Name\s*(.+?)(?=\n|$)/;
  const groupAddressPattern = /Group Practice Address\s*(.+?)(?=\n|$)/;

  const groupNameMatch = text.match(groupNamePattern);
  const groupAddressMatch = text.match(groupAddressPattern);

  // Check if the address is filled with actual content and not just placeholders like "_"
  const isAddressValid = groupAddressMatch !== null && groupAddressMatch[1].trim() !== '' && groupAddressMatch[1].trim() !== '_';

  if (groupNameMatch && groupNameMatch[1].trim() !== '' && groupNameMatch[1].trim() !== '_') {
    // If there's a group name, ensure there's also a valid group address
    return isAddressValid;
  }

  return true;
}
