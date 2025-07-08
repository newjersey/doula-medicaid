import JSZip from "jszip";

export interface FilledPDFData {
  filename: string;
  bytes: Uint8Array;
}

export const zipForms = async (pdfDataList: FilledPDFData[]) => {
  const zip = new JSZip();

  pdfDataList.forEach(({ filename, bytes }) => {
    zip.file(filename, bytes);
  });

  return await zip.generateAsync({ type: "blob" });
};
