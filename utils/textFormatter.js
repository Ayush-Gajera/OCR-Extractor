/**
 * Formats OCR output with decorative section dividers.
 */
export function formatSection(index, filename, text) {
  return `$[${index + 1}] ${filename}\n${text.trim()}\n\n`;
}

export function combineAllText(sections) {
  return sections.map((s) => s.text).join('\n\n');
}

export function countWords(text) {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

export function countCharacters(text) {
  return text.length;
}

export function buildFullOutput(sections, combined = false) {
  if (combined) {
    return sections.map((s) => s.text.trim()).join('\n\n');
  }
  return sections
    .map((s, i) => formatSection(i, s.filename, s.text))
    .join('');
}
