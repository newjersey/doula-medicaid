import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { validatePDF } from "../../utils/pdf_validate";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const tempDir = "./temp";
  await fs.promises.mkdir(tempDir, { recursive: true });
  const filePath = path.join(tempDir, "upload.pdf");
  const fileStream = fs.createWriteStream(filePath);
  const buffer = await req.arrayBuffer();
  const data = new Uint8Array(buffer);
  fileStream.write(data);
  fileStream.end();

  try {
    const result = await validatePDF(filePath);
    return NextResponse.json({ result }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Error validating PDF" }, { status: 500 });
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });
  }
}
