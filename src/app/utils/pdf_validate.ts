import { Poppler } from 'node-poppler';
import path from 'path';

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

async function extractTextFromPDF(filePath: string): Promise<string> {

  const pngPath = await convertPdfToPng(filePath);

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
