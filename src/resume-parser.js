import fs from "fs/promises";
import path from "path";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

const MAX_TEXT = 18000;

export async function extractResumeText(file) {
  if (!file?.path) throw new Error("No resume file provided.");
  const ext = path.extname(file.originalname || "").toLowerCase();
  const buffer = await fs.readFile(file.path);
  let text = "";

  if (ext === ".pdf") {
    const parsed = await pdfParse(buffer);
    text = parsed.text || "";
  } else if (ext === ".docx") {
    const parsed = await mammoth.extractRawText({ buffer });
    text = parsed.value || "";
  } else {
    throw new Error("Unsupported file type. Please upload a PDF or DOCX resume.");
  }

  text = text.replace(/\u0000/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  if (!text) throw new Error("I couldn't extract readable text from that resume.");
  return text.slice(0, MAX_TEXT);
}
