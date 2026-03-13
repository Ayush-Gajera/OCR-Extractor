'use client';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, ImagePlus, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { ACCEPTED_TYPES } from '@/utils/fileValidation';
import clsx from 'clsx';

const MAX_IMAGES = parseInt(process.env.NEXT_PUBLIC_MAX_IMAGES || '60');

export default function ImageUploader({ onFilesAdded, currentCount }) {
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        toast.error(`${rejectedFiles.length} file(s) rejected — unsupported format.`);
      }

      const remaining = MAX_IMAGES - currentCount;
      if (acceptedFiles.length > remaining) {
        toast.error(`Only ${remaining} more images can be added (max ${MAX_IMAGES}).`);
        acceptedFiles = acceptedFiles.slice(0, remaining);
      }

      if (acceptedFiles.length > 0) {
        const added = onFilesAdded(acceptedFiles);
        if (typeof added === 'number' && added > 0) {
          toast.success(`${added} image${added === 1 ? '' : 's'} loaded!`);
        }
      }
    },
    [onFilesAdded, currentCount]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'], 'image/bmp': ['.bmp'], 'image/tiff': ['.tiff', '.tif'] },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={clsx(
        'relative flex flex-col items-center justify-center w-full min-h-[200px] rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 group',
        isDragActive && !isDragReject && 'border-violet-500 bg-violet-500/10 scale-[1.01]',
        isDragReject && 'border-red-500 bg-red-500/10',
        !isDragActive && 'border-gray-300 dark:border-gray-600 hover:border-violet-400 dark:hover:border-violet-500 bg-gray-50 dark:bg-gray-800/50 hover:bg-violet-50 dark:hover:bg-violet-900/10'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3 pointer-events-none p-8 text-center">
        {isDragReject ? (
          <AlertCircle size={48} className="text-red-400" />
        ) : isDragActive ? (
          <ImagePlus size={48} className="text-violet-500 animate-bounce" />
        ) : (
          <Upload size={48} className="text-gray-400 dark:text-gray-500 group-hover:text-violet-500 transition-colors" />
        )}
        <div className="space-y-1">
          {isDragReject ? (
            <p className="text-red-500 font-medium">Unsupported file type!</p>
          ) : isDragActive ? (
            <p className="text-violet-600 dark:text-violet-400 font-semibold text-lg">Drop images here!</p>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
                Drag & drop images here
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                or <span className="text-violet-500 font-medium">click to browse</span>
              </p>
            </>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
            Supports JPG, PNG, WEBP, BMP, TIFF • Up to {MAX_IMAGES} images
          </p>
        </div>
      </div>
    </div>
  );
}
