import JSZip from "jszip";
import type { FilledPDFData } from "../proof-of-concept/forms/form";

export const zipForms = async (pdfDataList: FilledPDFData[]) => {
  const zip = new JSZip();

  pdfDataList.forEach(({ filename, bytes }) => {
    zip.file(filename, bytes);
  });

  return await zip.generateAsync({ type: "blob" });
};
