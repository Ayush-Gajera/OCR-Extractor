/**
 * Validates image files for upload.
 * Returns { valid: File[], invalid: { file: File, reason: string }[] }
 */
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/tiff'];
export const MAX_IMAGES = parseInt(process.env.NEXT_PUBLIC_MAX_IMAGES || '60');

export function validateFiles(files) {
  const valid = [];
  const invalid = [];

  for (const file of files) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      invalid.push({ file, reason: `Unsupported format: ${file.type || 'unknown'}` });
    } else {
      valid.push(file);
    }
  }

  return { valid, invalid };
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isLargeFile(file, thresholdMB = 5) {
  return file.size > thresholdMB * 1024 * 1024;
}
