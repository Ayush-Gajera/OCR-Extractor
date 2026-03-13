import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { buildFullOutput } from './textFormatter';

/**
 * Download all extracted text as a single .txt file.
 */
export function downloadTxt(sections, combined = false) {
  const content = buildFullOutput(sections, combined);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'ocr-output.txt');
}

/**
 * Download all extracted text as a .docx Word document.
 */
export async function downloadDocx(sections, combined = false) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');

  const children = [];

  if (combined) {
    const combinedText = sections.map((s) => s.text.trim()).join('\n\n');
    combinedText.split('\n').forEach((line) => {
      children.push(new Paragraph({ children: [new TextRun(line)] }));
    });
  } else {
    sections.forEach((section, i) => {
      children.push(
        new Paragraph({
          text: `[${i + 1}] ${section.filename}`,
          heading: HeadingLevel.HEADING_2,
        })
      );
      section.text.split('\n').forEach((line) => {
        children.push(new Paragraph({ children: [new TextRun(line)] }));
      });
      children.push(new Paragraph({})); // spacer
    });
  }

  const doc = new Document({
    sections: [{ children }],
  });

  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  saveAs(blob, 'ocr-output.docx');
}

/**
 * Download each image's OCR text as a separate .txt file in a ZIP archive.
 */
export async function downloadZip(sections) {
  const zip = new JSZip();
  sections.forEach((section, i) => {
    const name = section.filename.replace(/\.[^.]+$/, '') || `image_${i + 1}`;
    zip.file(`${String(i + 1).padStart(3, '0')}_${name}.txt`, section.text);
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'ocr-sections.zip');
}

/**
 * Copy all text to clipboard.
 */
export async function copyToClipboard(sections, combined = false) {
  const content = buildFullOutput(sections, combined);
  await navigator.clipboard.writeText(content);
}
