'use client';
import { Download, Copy, Archive, FileText, FileType } from 'lucide-react';
import { useExport } from '@/hooks/useExport';
import { useState } from 'react';
import clsx from 'clsx';

export default function ExportButtons({ sections, combined }) {
  const { handleTxt, handleDocx, handleZip, handleClipboard } = useExport(sections, combined);
  const disabled = sections.length === 0;

  const Button = ({ onClick, icon: Icon, label, variant = 'default', title }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title || label}
      className={clsx(
        'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 border',
        disabled && 'opacity-40 cursor-not-allowed',
        !disabled && variant === 'primary' && 'bg-violet-600 hover:bg-violet-700 text-white border-transparent shadow-lg shadow-violet-200 dark:shadow-violet-900/30',
        !disabled && variant === 'default' && 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-violet-300 dark:hover:border-violet-600 hover:text-violet-700 dark:hover:text-violet-300 shadow-sm',
        !disabled && variant === 'green' && 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40'
      )}
    >
      <Icon size={15} />
      {label}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mr-1">
        Export:
      </span>
      <Button onClick={handleTxt} icon={FileText} label=".TXT" variant="primary" title="Download as plain text" />
      <Button onClick={handleDocx} icon={FileType} label=".DOCX" variant="default" title="Download as Word document" />
      <Button onClick={handleZip} icon={Archive} label="ZIP" variant="default" title="Download each section as separate .txt files in a ZIP archive" />
      <Button onClick={handleClipboard} icon={Copy} label="Copy" variant="green" title="Copy all text to clipboard" />
    </div>
  );
}
