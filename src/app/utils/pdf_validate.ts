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

async function analyzeImage(imagePath: Tesseract.ImageLike, outputTextFile: fs.PathOrFileDescriptor) {
  try {
    console.log(`Analyzing ${imagePath}...`);

    // Perform OCR on the image
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      logger: info => console.log(info), // Optional: log progress
    });

    console.log(`Extracted Text: \n${text}`);

    // Write the extracted text to a file
    fs.writeFileSync(outputTextFile, text, 'utf8');
    console.log(`Text written to ${outputTextFile}`);
  } catch (error) {
    console.error('Error during OCR:', error);
  }
}


async function extractTextFromPDF(filePath: string): Promise<string> {

  const pngPath = await convertPdfToPng(filePath);

  const outputDir = path.dirname(filePath);

  // Define the path to your specific PNG and the output text file
  const imagePath = path.resolve(outputDir, 'output-04.png');
  const outputTextFile = path.resolve(outputDir, 'output-04.txt');

  // Run the OCR and save the result
  await analyzeImage(imagePath, outputTextFile);

  return pngPath;

  // return new Promise((resolve, reject) => {
  //   const pdfParser = new PDFParser();

  //   pdfParser.on("pdfParser_dataReady", (pdfData) => {
  //     resolve(JSON.stringify(pdfData));
  //    });

  //   pdfParser.on("pdfParser_dataError", err => {
  //     reject(err);
  //   });

  //   pdfParser.loadPDF(filePath);
  // });
}

export async function validatePDF(filePath: string): Promise<boolean> {
  try {
    const text = await extractTextFromPDF(filePath);

    console.log(text);

    const groupNamePattern = /Group Practice Name\s*:\s*(.+?)(?=\s)/;
    const groupAddressPattern = /Group Practice Address\s*:\s*(.+?)(?=\s)/;

    const groupNameMatch = text.match(groupNamePattern);
    const groupAddressMatch = text.match(groupAddressPattern);

    if (groupNameMatch && groupNameMatch[1].trim() !== "") {
      return groupAddressMatch !== null && groupAddressMatch[1].trim() !== "";
    }
    return true;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    return false;
  }
}
